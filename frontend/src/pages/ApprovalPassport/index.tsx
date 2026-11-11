import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";
import { useWorkspaceData } from "../../context/WorkspaceDataContext";
import { getCurrentUser } from "../../lib/roles";
import { RoleAccessPill, approvalAccessMessage, reviewerActionLockNote } from "../../components/RoleAccessPill";

const resolvedChanges = [
  {
    title: "Claim corrected",
    detail: "100% → 80% recycled plastic, excluding the cap",
    code: "F-014 ↗",
  },
  {
    title: "Terminology aligned",
    detail: "“Eco pods” → “refill concentrates”",
    code: "T-003 ↗",
  },
  {
    title: "Tone refined",
    detail: "Miracle language → practical, measured benefit",
    code: "G-001 ↗",
  },
];

const evidenceRefs = [
  {
    title: "Packaging specification ↗",
    meta: "F-014 · v2.1",
  },
  {
    title: "Refill concentrates ↗",
    meta: "T-003 · v1.2",
  },
  {
    title: "Voice & tone ↗",
    meta: "G-001 · v1.3",
  },
];

const formatApprovalDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const ApprovalPassport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get("reviewId");
  const user = getCurrentUser();
  const canApprove = user.role === "reviewer";
  const approvalAccess = approvalAccessMessage(user.role);
  const approvalLockNote = reviewerActionLockNote(user.role);
  const {
    getReviewDetail,
    reviewDetailsById,
    latestReviewDetail,
    ensureInitialLoad,
    isInitialLoaded,
    refreshWorkspaceAfterActivity,
  } = useWorkspaceData();
  const [status, setStatus] = useState<"Approved" | "Changes Requested">("Approved");
  const [contentTitle, setContentTitle] = useState("A simpler clean — launch email");
  const [contentType, setContentType] = useState("Email campaign");
  const [creatorName, setCreatorName] = useState("Maya Lewis");
  const [reviewCode, setReviewCode] = useState("PR-024");
  const [approvedVersion, setApprovedVersion] = useState("v1.1");
  const [reviewerName, setReviewerName] = useState("Elena Ruiz · Brand lead");
  const [passportId, setPassportId] = useState("RP-2026-024");
  const [approvalDate, setApprovalDate] = useState("05 Nov 2026 · 10:32 UTC");
  const [submittedContent, setSubmittedContent] = useState(
    "Meet a simpler way to clean. Our bottles are made with 100% recycled plastic. Just add water to our eco pods and refill your DemoBrand Co. bottle. It’s a planet-saving miracle for your home. Discover the everyday refill ritual."
  );
  const [approvedContent, setApprovedContent] = useState(
    "Meet a simpler way to clean. Our bottles are made with 80% recycled plastic, excluding the cap. Just add water to our refill concentrates and refill your DemoBrand Co. bottle. It’s a simple step toward a less wasteful routine. Discover the everyday refill ritual."
  );
  const [dynamicResolvedChanges, setDynamicResolvedChanges] = useState(resolvedChanges);
  const [dynamicEvidenceRefs, setDynamicEvidenceRefs] = useState(evidenceRefs);

  useEffect(() => {
    if (!isInitialLoaded) {
      void ensureInitialLoad();
    }
  }, [ensureInitialLoad, isInitialLoaded]);

  useEffect(() => {
    const applyData = (data: Awaited<ReturnType<typeof getReviewDetail>>) => {
      if (!data?.review) return;
      const passport = data.passport;
      setContentTitle(data.review.title);
      setContentType(data.review.content_type);
      setCreatorName(data.review.creator_name);
      setReviewCode(data.review.review_code);
      setSubmittedContent(data.review.submitted_body_text ?? data.review.body_text);
      setApprovedContent(data.review.body_text);
      if (passport) {
        setApprovedVersion(passport.approved_version);
        setReviewerName(passport.reviewer_name);
        setPassportId(passport.passport_code);
        setStatus(passport.is_valid ? "Approved" : "Changes Requested");
        setApprovalDate(formatApprovalDate(passport.created_at ?? data.review.created_at));
      } else {
        setApprovalDate(formatApprovalDate(data.review.created_at));
      }
      if (passport?.resolved_changes?.length) {
        setDynamicResolvedChanges(passport.resolved_changes);
      }
      if (passport?.evidence_refs?.length) {
        setDynamicEvidenceRefs(
          passport.evidence_refs.map((reference) => ({
            title: reference.title,
            meta: reference.source,
          }))
        );
      }
    };

    const cached = reviewId ? reviewDetailsById[reviewId] : latestReviewDetail;
    if (cached?.review) {
      applyData(cached);
      return;
    }

    let active = true;
    void getReviewDetail(reviewId).then((data) => {
      if (active) applyData(data);
    });
    return () => {
      active = false;
    };
  }, [getReviewDetail, latestReviewDetail, reviewId, reviewDetailsById]);

  const handleDecision = async (next: "Approved" | "Changes Requested") => {
    if (!canApprove) return;
    setStatus(next);
    await refreshWorkspaceAfterActivity();
  };

  const handleDownloadPassport = () => {
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      console.error("Unable to open the Release Passport print window.");
      return;
    }

    const evidenceMarkup = dynamicEvidenceRefs
      .map(
        (reference) => `
          <li>
            <strong>${escapeHtml(reference.title)}</strong>
            <span>${escapeHtml(reference.meta)}</span>
          </li>`
      )
      .join("");
    const findingsMarkup = dynamicResolvedChanges
      .map(
        (finding) => `
          <li>
            <strong>${escapeHtml(finding.title)}</strong>
            <span>${escapeHtml(finding.detail)}</span>
            <em>${escapeHtml(finding.code)}</em>
          </li>`
      )
      .join("");

    printWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(passportId)} - Release Passport</title>
          <style>
            @page { size: A4; margin: 18mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #252b29; font: 14px/1.55 Arial, sans-serif; }
            .passport { max-width: 760px; margin: 0 auto; }
            header { padding: 28px 30px; background: #173d35; color: #fff; }
            header .eyebrow { color: #b8cec3; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; }
            h1 { margin: 18px 0 6px; font-size: 30px; font-weight: 500; }
            header p { margin: 0; color: #b8cec3; }
            section { padding: 22px 0; border-bottom: 1px solid #dfe3da; }
            h2 { margin: 0 0 13px; color: #173d35; font-size: 17px; }
            .status { display: inline-block; margin-top: 16px; padding: 5px 10px; background: #dce6de; color: #173d35; font-weight: 700; }
            .metadata { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
            .label { display: block; color: #707871; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
            .value { display: block; margin-top: 3px; font-weight: 600; }
            .content { white-space: pre-wrap; padding: 16px; background: #f8f9f6; }
            ul { margin: 0; padding: 0; list-style: none; }
            li { display: grid; grid-template-columns: 1fr auto; gap: 4px 16px; padding: 10px 0; border-bottom: 1px solid #eef0ec; }
            li span { grid-column: 1 / -1; color: #707871; }
            li em { color: #173d35; font-size: 11px; font-style: normal; }
            footer { padding-top: 24px; color: #707871; font-size: 11px; }
            @media print { .passport { max-width: none; } }
          </style>
        </head>
        <body>
          <main class="passport">
            <header>
              <div class="eyebrow">Proofroom / DemoBrand Co.</div>
              <h1>Release Passport</h1>
              <p>Release Passport — Proofroom / DemoBrand Co.</p>
              <div class="status">${escapeHtml(status)}</div>
            </header>
            <section>
              <div class="metadata">
                <div><span class="label">Passport ID</span><span class="value">${escapeHtml(passportId)}</span></div>
                <div><span class="label">Review ID</span><span class="value">${escapeHtml(reviewCode)}</span></div>
                <div><span class="label">Content Title</span><span class="value">${escapeHtml(contentTitle)}</span></div>
                <div><span class="label">Content Type</span><span class="value">${escapeHtml(contentType)}</span></div>
                <div><span class="label">Creator</span><span class="value">${escapeHtml(creatorName)}</span></div>
                <div><span class="label">Reviewer</span><span class="value">${escapeHtml(reviewerName)}</span></div>
                <div><span class="label">Approved Version</span><span class="value">${escapeHtml(approvedVersion)}</span></div>
                <div><span class="label">Approval Date</span><span class="value">${escapeHtml(approvalDate)}</span></div>
              </div>
            </section>
            <section>
              <h2>Approved Final Content</h2>
              <div class="content">${escapeHtml(approvedContent)}</div>
            </section>
            <section>
              <h2>Resolved Findings</h2>
              <ul>${findingsMarkup || "<li>No resolved findings recorded.</li>"}</ul>
            </section>
            <section>
              <h2>Evidence References</h2>
              <ul>${evidenceMarkup || "<li>No evidence references recorded.</li>"}</ul>
            </section>
            <footer>
              This passport records approval of this version only. Any subsequent edit invalidates this approval.
            </footer>
          </main>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.onafterprint = () => printWindow.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f6f5ef] text-[#252b29]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader breadcrumb="Reviews / Approval & release" />
        {/* Page Body */}
        <div className="flex flex-col px-10 pb-9 pt-[34px]">
          {/* Page Heading */}
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-[1.4px] text-[#707871]">
              REVIEW {reviewCode} · DEMOBRAND CO.
            </span>
            <div className="mt-2.5 flex items-center justify-between gap-6">
              <h1 className="text-[30px] font-medium tracking-[-1px] text-[#173d35]">
                Approval &amp; Release Passport
              </h1>
              <span
                className={`rounded px-2 py-1 text-[11px] font-semibold ${
                  status === "Approved"
                    ? "bg-[#dce6de] text-[#173d35]"
                    : "bg-[#f5eedc] text-[#8a642b]"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="mt-2.5 text-sm text-[#707871]">
              {contentTitle} · {contentType} · {creatorName}
            </p>
          </div>

          {/* 3-Step Review Progress */}
          <div className="mt-7 flex items-center gap-6 rounded-md border border-[#dfe3da] bg-white px-5 py-4">
            <div className="flex flex-1 items-center gap-2">
              <span className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#173d35] text-[11px] font-semibold text-white">
                ✓
              </span>
              <span className="flex-1 text-xs text-[#173d35]">Add content</span>
              <i className="ti ti-chevron-right text-sm text-[#707871]" />
            </div>

            <div className="flex flex-1 items-center gap-2">
              <span className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#173d35] text-[11px] font-semibold text-white">
                ✓
              </span>
              <span className="flex-1 text-xs text-[#173d35]">Resolve findings</span>
              <i className="ti ti-chevron-right text-sm text-[#707871]" />
            </div>

            <div className="flex flex-1 items-center gap-2">
              <span className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#173d35] text-[11px] font-semibold text-white">
                3
              </span>
              <span className="flex-1 text-xs font-semibold text-[#173d35]">
                Approve &amp; release
              </span>
            </div>
          </div>

          <div className="mt-4">
            <RoleAccessPill variant={approvalAccess.variant} message={approvalAccess.message} />
          </div>

          {/* Approval Confirmation Banner */}
          <div className="mt-7 flex items-center gap-3 rounded-md bg-[#dce6de] px-5 py-[17px] text-[#173d35]">
            <i className="ti ti-circle-check text-xl shrink-0" />
            <div className="flex flex-1 flex-col">
              <span className="text-[13px] font-semibold">
                {status === "Approved"
                  ? "Approved and ready for release"
                  : "Changes requested — awaiting new version"}
              </span>
              <span className="text-xs">
                {status === "Approved"
                  ? "Elena Ruiz approved v1.1 on 05 Nov 2026 at 10:32. Your evidence and final content are now recorded."
                  : "Reviewer requested revisions. Edit content in the Review Workspace to generate v1.2."}
              </span>
            </div>
            <i className="ti ti-shield-check text-2xl shrink-0" />
          </div>

          {/* Main 2-Column Section: Left Comparison & Decision + Right Release Passport */}
          <div className="mt-7 flex items-start gap-6">
            {/* Left Column */}
            <div className="flex flex-1 flex-col">
              {/* Version Comparison Card */}
              <div
                data-tour="reviewed-to-final"
                className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white"
              >
                <div className="flex items-center justify-between p-[22px]">
                  <h2 className="text-base font-semibold text-[#252b29]">
                    Reviewed to final
                  </h2>
                  <span className="rounded bg-[#dce6de] px-2 py-1 text-[11px] font-semibold text-[#173d35]">
                    3 of 3 findings resolved
                  </span>
                </div>

                {/* Side-by-Side Submitted vs Approved Final */}
                <div className="grid grid-cols-2 border-t border-[#dfe3da]">
                  {/* Submitted v1.0 */}
                  <div className="border-r border-[#dfe3da] p-[22px] text-[#707871]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold">SUBMITTED</span>
                      <span>v1.0</span>
                    </div>
                    <p className="mt-[15px] text-[13px] leading-5">
                      {submittedContent}
                    </p>
                  </div>

                  {/* Approved Final v1.1 */}
                  <div className="p-[22px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#173d35]">
                      <span>APPROVED FINAL</span>
                      <span className="rounded bg-[#dce6de] px-2 py-0.5">v1.1</span>
                    </div>
                    <p className="mt-[15px] text-[13px] leading-5 text-[#252b29]">
                      {approvedContent}
                    </p>
                  </div>
                </div>

                {/* What Changed List */}
                <div className="border-t border-[#dfe3da] p-[22px]">
                  <h3 className="text-xs font-semibold text-[#252b29]">What changed</h3>
                  <div className="mt-3.5 flex flex-col gap-3.5">
                    {dynamicResolvedChanges.map((item) => (
                      <div key={item.title} className="flex items-start gap-2.5">
                        <i className="ti ti-check mt-0.5 text-sm text-[#173d35]" />
                        <div className="flex flex-1 flex-col text-[11px]">
                          <span className="font-medium text-[#252b29]">
                            {item.title}
                          </span>
                          <span className="text-[#707871]">{item.detail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate("/brand-vault")}
                          className="text-[10px] font-semibold text-[#173d35] hover:underline cursor-pointer"
                        >
                          {item.code}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Completed Decision Card */}
              <div className="mt-5 rounded-lg border border-[#dfe3da] bg-white p-[22px]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#252b29]">
                    Approval decision
                  </span>
                  <span className="text-[11px] text-[#707871]">Decision recorded</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStatus("Approved")}
                    className={`flex min-h-[40px] items-center gap-2 rounded-md border px-4 text-[13px] font-semibold cursor-pointer ${
                      status === "Approved"
                        ? "border-[#dfe3da] bg-[#f8f9f6] text-[#a2a8a1]"
                        : "border-[#173d35] bg-[#173d35] text-white"
                    }`}
                  >
                    <i className="ti ti-check text-sm" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Changes Requested")}
                    className="flex min-h-[40px] items-center gap-2 rounded-md border border-[#dfe3da] bg-[#f8f9f6] px-4 text-[13px] font-semibold text-[#707871] hover:bg-[#eef0ec] cursor-pointer"
                  >
                    <span>Request Changes</span>
                  </button>
                  <span className="flex-1 text-[11px] text-[#707871]">
                    This approval is complete. Create a new version to make changes.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Release Passport Card */}
            <aside
              data-tour="release-passport-card"
              className="flex w-[332px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white"
            >
              {/* Green Passport Header */}
              <div className="flex flex-col bg-[#173d35] p-6 text-[#b8cec3]">
                <div className="flex items-center justify-between text-[9px] font-medium tracking-[1.5px]">
                  <i className="ti ti-shield-check text-2xl text-[#b49a63]" />
                  <span>PROOFROOM / DEMOBRAND CO.</span>
                </div>
                <h2 className="mt-[15px] text-[25px] tracking-[-0.8px] text-white">
                  Release Passport
                </h2>
                <div className="mt-[15px] flex items-center gap-1.5 text-[11px]">
                  <i className="ti ti-circle-check text-sm text-[#b8cec3]" />
                  <span>Approved · Ready for release</span>
                </div>
              </div>

              {/* Passport Metadata Body */}
              <div className="flex flex-col p-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#707871]">CONTENT</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    {contentTitle}
                  </span>
                </div>

                <div className="mt-[18px] flex gap-[18px]">
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] text-[#707871]">CONTENT VERSION</span>
                    <span className="mt-1 text-xs font-medium text-[#252b29]">{approvedVersion}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] text-[#707871]">REVIEW ID</span>
                    <span className="mt-1 text-xs font-medium text-[#252b29]">
                      {reviewCode}
                    </span>
                  </div>
                </div>

                <div className="my-[18px] h-px w-full bg-[#dfe3da]" />

                <div className="flex flex-col">
                  <span className="text-[10px] text-[#707871]">REVIEWER</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    {reviewerName}
                  </span>
                </div>

                <div className="mt-[18px] flex flex-col">
                  <span className="text-[10px] text-[#707871]">APPROVAL DATE</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    {approvalDate}
                  </span>
                </div>

                <div className="mt-[18px] flex flex-col">
                  <span className="text-[10px] text-[#707871]">PASSPORT ID</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    {passportId}
                  </span>
                </div>

                <div className="my-[18px] h-px w-full bg-[#dfe3da]" />

                {/* Evidence References */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#707871]">
                    EVIDENCE REFERENCES
                  </span>
                  <div className="mt-[11px] flex flex-col gap-[11px]">
                    {dynamicEvidenceRefs.map((ref) => (
                      <div key={ref.title} className="flex items-center gap-2">
                        <i className="ti ti-file-check text-sm text-[#173d35]" />
                        <div className="flex flex-1 flex-col">
                          <span className="text-[11px] font-medium text-[#252b29]">
                            {ref.title}
                          </span>
                          <span className="text-[10px] text-[#707871]">{ref.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="my-[18px] h-px w-full bg-[#dfe3da]" />

                {/* Download Button */}
                <button
                  type="button"
                  data-tour="download-passport-btn"
                  disabled={!canApprove}
                  onClick={handleDownloadPassport}
                  className={`flex min-h-[40px] items-center justify-center gap-2 self-start rounded-md border border-[#dfe3da] bg-white px-4 text-[13px] font-semibold text-[#173d35] ${
                    canApprove
                      ? "hover:bg-[#f8f9f6] cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  <span>{canApprove ? "↓" : "🔒"} Download Passport</span>
                </button>
                {!canApprove && (
                  <p className="mt-2 text-[10px] leading-[15px] text-[#707871]">
                    🔒 {approvalLockNote}
                  </p>
                )}

                <p className="mt-[18px] text-[10px] leading-[15px] text-[#707871]">
                  This passport records approval of this version only. It does not
                  publish your content.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPassport;