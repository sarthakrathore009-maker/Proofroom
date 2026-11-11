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

const renderVersionText = (text: string, approved: boolean) => {
  const terms = approved
    ? ["80% recycled plastic, excluding the cap", "refill concentrates", "simple step toward a less wasteful routine"]
    : ["100% recycled plastic", "eco pods", "planet-saving miracle"];
  const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(pattern).map((part, index) =>
    terms.some((term) => term.toLowerCase() === part.toLowerCase()) ? (
      <span
        key={`${part}-${index}`}
        className={approved ? "rounded bg-[#dcfce7] px-1 text-[#166534]" : "text-[#b91c1c] line-through decoration-2"}
      >
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
};

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
  const [status, setStatus] = useState<"Approved" | "Changes Requested" | "Revoked">("Approved");
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
  const [originalApprovedContent, setOriginalApprovedContent] = useState(approvedContent);
  const [dynamicResolvedChanges, setDynamicResolvedChanges] = useState(resolvedChanges);
  const [dynamicEvidenceRefs, setDynamicEvidenceRefs] = useState(evidenceRefs);
  const [approvedHash, setApprovedHash] = useState("—");
  const [modifiedPostApproval, setModifiedPostApproval] = useState(false);
  const [reviewCards, setReviewCards] = useState<
    Array<{
      category_title: string;
      original_excerpt: string;
      suggested_correction: string;
      exception_reason?: string;
      resolution_status: string;
    }>
  >([]);

  useEffect(() => {
    let active = true;
    const calculateHash = async () => {
      if (!window.crypto?.subtle) return;
      const bytes = new TextEncoder().encode(approvedContent);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      const hash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      if (active) setApprovedHash(hash);
    };
    void calculateHash();
    return () => {
      active = false;
    };
  }, [approvedContent]);

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
      if (!modifiedPostApproval) {
        setApprovedContent(data.review.body_text);
        setOriginalApprovedContent(data.review.body_text);
      }
      setReviewCards(data.proofCards);
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
  }, [getReviewDetail, latestReviewDetail, modifiedPostApproval, reviewId, reviewDetailsById]);

  const handleDecision = async (next: "Approved" | "Changes Requested") => {
    if (!canApprove) return;
    setStatus(next);
    await refreshWorkspaceAfterActivity();
  };

  const testPostApprovalEdit = async () => {
    setApprovedContent((current) => `${current} [Post-approval edit]`);
    setModifiedPostApproval(true);
    setStatus("Revoked");
    setApprovedVersion("v1.2");
    await refreshWorkspaceAfterActivity();
  };

  const restoreApprovedVersion = async () => {
    setApprovedContent(originalApprovedContent);
    setModifiedPostApproval(false);
    setStatus("Approved");
    setApprovedVersion("v1.1");
    await refreshWorkspaceAfterActivity();
  };

  const submitFreshReview = () => {
    if (!reviewId) return;
    navigate(`/new-review?reviewId=${encodeURIComponent(reviewId)}`);
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
                  status === "Revoked"
                    ? "bg-[#fef2f2] text-[#991b1b]"
                    : status === "Approved"
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
          <div className={`mt-7 flex items-center gap-3 rounded-md px-5 py-[17px] ${
            status === "Revoked" ? "bg-[#fef2f2] text-[#991b1b]" : "bg-[#dce6de] text-[#173d35]"
          }`}>
            <i className="ti ti-circle-check text-xl shrink-0" />
            <div className="flex flex-1 flex-col">
              <span className="text-[13px] font-semibold">
          {status === "Revoked"
            ? "🚫 REVOKED — Content Modified After Approval (v1.1 Lock Broken)"
            : status === "Approved"
            ? "Approved and ready for release"
            : "Changes requested — awaiting new version"}
              </span>
              <span className="text-xs">
          {status === "Revoked"
            ? "Passport Invalidated: v1.2 requires a fresh review."
            : status === "Approved"
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
                      {renderVersionText(submittedContent, false)}
                    </p>
                  </div>

                  {/* Approved Final v1.1 */}
                  <div className="p-[22px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#173d35]">
                      <span>APPROVED FINAL</span>
                      <span className="rounded bg-[#dce6de] px-2 py-0.5">v1.1</span>
                    </div>
                    <p className="mt-[15px] text-[13px] leading-5 text-[#252b29]">
                      {renderVersionText(approvedContent, true)}
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

              <div className="mt-5 rounded-lg border border-[#dfe3da] bg-white p-[22px]">
                <h2 className="text-sm font-semibold text-[#252b29]">
                  Documented Exceptions &amp; Audit Log
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {reviewCards.filter((card) => card.exception_reason || card.resolution_status === "Dismissed").length > 0 ? (
                    reviewCards
                      .filter((card) => card.exception_reason || card.resolution_status === "Dismissed")
                      .map((card) => (
                        <div key={card.category_title} className="rounded-md border border-[#e5e7eb] bg-[#f8f9f6] p-3 text-[11px] leading-4">
                          <div className="font-semibold text-[#252b29]">
                            Exception requested by Oliver Chen · {card.category_title}
                          </div>
                          <div className="mt-1 text-[#707871]">
                            Business justification: {card.exception_reason || "Creator requested an exception for this finding."}
                          </div>
                          <div className="mt-1 text-[#707871]">
                            Scope / expiry: Limited to this approved version · Decision: {card.resolution_status} by Nina Patel · {approvalDate}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-[11px] text-[#707871]">
                      No exceptions recorded. All findings were resolved against the approved Brand Vault evidence.
                    </p>
                  )}
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
                    onClick={() => void handleDecision("Approved")}
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
                    onClick={() => void handleDecision("Changes Requested")}
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
                  <i className={`ti ${modifiedPostApproval ? "ti-alert-triangle text-[#fca5a5]" : "ti-circle-check text-[#b8cec3]"} text-sm`} />
                  <span>
                    {modifiedPostApproval
                      ? "🚫 REVOKED — Content Modified After Approval (v1.1 Lock Broken)"
                      : "✅ Approved · Ready for release"}
                  </span>
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

                <div className="rounded-md border border-[#dfe3da] bg-[#f8f9f6] p-3">
                  <span className="text-[10px] font-semibold tracking-wide text-[#707871]">
                    VERSION LOCK STATUS
                  </span>
                  <p className="mt-1 text-[11px] font-semibold text-[#173d35]">
                    🔒 Version-Locked to v1.1
                  </p>
                  <span className="mt-3 block text-[10px] font-semibold tracking-wide text-[#707871]">
                    CONTENT INTEGRITY HASH
                  </span>
                  <p className="mt-1 break-all text-[10px] text-[#374151]">
                    SHA-256: {approvedHash.slice(0, 4)}...{approvedHash.slice(-4)} ({modifiedPostApproval ? "Mismatch" : "Verified Match"})
                  </p>
                  <p className="mt-3 text-[10px] leading-4 text-[#707871]">
                    Version-Locked: Modifying even a single character of approved content automatically invalidates this Release Passport and requires a fresh review.
                  </p>
                </div>

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
                  disabled={!canApprove || modifiedPostApproval}
                  onClick={handleDownloadPassport}
                  className={`flex min-h-[40px] items-center justify-center gap-2 self-start rounded-md border border-[#dfe3da] bg-white px-4 text-[13px] font-semibold text-[#173d35] ${
                    canApprove && !modifiedPostApproval
                      ? "hover:bg-[#f8f9f6] cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  <span>{canApprove && !modifiedPostApproval ? "↓" : "🔒"} Download Passport</span>
                </button>
                {modifiedPostApproval ? (
                  <p className="mt-2 text-[10px] leading-[15px] text-[#991b1b]">
                    Passport Invalidated: v1.2 requires a fresh review
                  </p>
                ) : !canApprove ? (
                  <p className="mt-2 text-[10px] leading-[15px] text-[#707871]">
                    🔒 {approvalLockNote}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => void testPostApprovalEdit()}
                    className="rounded-md border border-[#b49a63] bg-[#fffaf0] px-3 py-2 text-[11px] font-semibold text-[#765b24] hover:bg-[#fff5dc] cursor-pointer"
                  >
                    ⚡ Test Post-Approval Edit (Modify Content)
                  </button>
                  {modifiedPostApproval && (
                    <>
                      <button
                        type="button"
                        onClick={submitFreshReview}
                        disabled={!canApprove && user.role !== "creator"}
                        className="rounded-md bg-[#173d35] px-3 py-2 text-[11px] font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Submit v1.2 for Fresh Review
                      </button>
                      <button
                        type="button"
                        onClick={() => void restoreApprovedVersion()}
                        className="rounded-md border border-[#dfe3da] px-3 py-2 text-[11px] font-semibold text-[#173d35] hover:bg-[#f8f9f6] cursor-pointer"
                      >
                        Restore Approved v1.1
                      </button>
                    </>
                  )}
                </div>

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