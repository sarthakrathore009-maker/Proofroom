import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";

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

export const ApprovalPassport = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"Approved" | "Changes Requested">("Approved");

  const handleDownloadPassport = () => {
    const passportData = {
      passportId: "RP-2026-024",
      reviewId: "PR-024",
      workspace: "Aster",
      contentTitle: "A simpler clean — launch email",
      contentType: "Email campaign",
      approvedVersion: "v1.1",
      creator: "Maya Lewis",
      reviewer: "Elena Ruiz · Brand lead",
      approvalDate: "05 Nov 2026 · 10:32 UTC",
      status,
      approvedContent:
        "Meet a simpler way to clean. Our bottles are made with 80% recycled plastic, excluding the cap. Just add water to our refill concentrates and refill your Aster bottle. It’s a simple step toward a less wasteful routine. Discover the everyday refill ritual.",
      evidenceReferences: evidenceRefs,
      resolvedFindings: resolvedChanges,
      disclaimer:
        "This passport records approval of this version only. Any subsequent edit invalidates this approval.",
    };

    const blob = new Blob([JSON.stringify(passportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "RP-2026-024_Release_Passport.json";
    link.click();
    URL.revokeObjectURL(url);
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
              REVIEW PR-024 · ASTER
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
              A simpler clean — launch email · Email campaign · Maya Lewis
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
              <div className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white">
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
                      Meet a simpler way to clean. Our bottles are made with 100%
                      recycled plastic. Just add water to our eco pods and refill your
                      Aster bottle. It’s a planet-saving miracle for your home.
                      Discover the everyday refill ritual.
                    </p>
                  </div>

                  {/* Approved Final v1.1 */}
                  <div className="p-[22px]">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#173d35]">
                      <span>APPROVED FINAL</span>
                      <span className="rounded bg-[#dce6de] px-2 py-0.5">v1.1</span>
                    </div>
                    <p className="mt-[15px] text-[13px] leading-5 text-[#252b29]">
                      Meet a simpler way to clean. Our bottles are made with 80%
                      recycled plastic, excluding the cap. Just add water to our
                      refill concentrates and refill your Aster bottle. It’s a simple
                      step toward a less wasteful routine. Discover the everyday
                      refill ritual.
                    </p>
                  </div>
                </div>

                {/* What Changed List */}
                <div className="border-t border-[#dfe3da] p-[22px]">
                  <h3 className="text-xs font-semibold text-[#252b29]">What changed</h3>
                  <div className="mt-3.5 flex flex-col gap-3.5">
                    {resolvedChanges.map((item) => (
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
            <aside className="flex w-[332px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white">
              {/* Green Passport Header */}
              <div className="flex flex-col bg-[#173d35] p-6 text-[#b8cec3]">
                <div className="flex items-center justify-between text-[9px] font-medium tracking-[1.5px]">
                  <i className="ti ti-shield-check text-2xl text-[#b49a63]" />
                  <span>PROOFROOM / ASTER</span>
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
                    A simpler clean — launch email
                  </span>
                </div>

                <div className="mt-[18px] flex gap-[18px]">
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] text-[#707871]">CONTENT VERSION</span>
                    <span className="mt-1 text-xs font-medium text-[#252b29]">v1.1</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] text-[#707871]">REVIEW ID</span>
                    <span className="mt-1 text-xs font-medium text-[#252b29]">
                      PR-024
                    </span>
                  </div>
                </div>

                <div className="my-[18px] h-px w-full bg-[#dfe3da]" />

                <div className="flex flex-col">
                  <span className="text-[10px] text-[#707871]">REVIEWER</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    Elena Ruiz · Brand lead
                  </span>
                </div>

                <div className="mt-[18px] flex flex-col">
                  <span className="text-[10px] text-[#707871]">APPROVAL DATE</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    05 Nov 2026 · 10:32 UTC
                  </span>
                </div>

                <div className="mt-[18px] flex flex-col">
                  <span className="text-[10px] text-[#707871]">PASSPORT ID</span>
                  <span className="mt-1 text-xs font-medium text-[#252b29]">
                    RP-2026-024
                  </span>
                </div>

                <div className="my-[18px] h-px w-full bg-[#dfe3da]" />

                {/* Evidence References */}
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#707871]">
                    EVIDENCE REFERENCES
                  </span>
                  <div className="mt-[11px] flex flex-col gap-[11px]">
                    {evidenceRefs.map((ref) => (
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
                  onClick={handleDownloadPassport}
                  className="flex min-h-[40px] items-center justify-center gap-2 self-start rounded-md border border-[#dfe3da] bg-white px-4 text-[13px] font-semibold text-[#173d35] hover:bg-[#f8f9f6] cursor-pointer"
                >
                  <i className="ti ti-download text-base" />
                  <span>Download Passport</span>
                </button>

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