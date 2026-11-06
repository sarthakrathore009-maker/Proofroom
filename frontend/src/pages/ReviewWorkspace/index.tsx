import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";

type ProofCardItem = {
  id: string;
  severity: "High" | "Medium" | "Low";
  severityBadgeClass: string;
  title: string;
  issueText: string;
  sourceCode: string;
  sourceRule: string;
  originalSentence: string;
  suggestedSentence: string;
  highlightBoxClass: string;
  status: "Open" | "Accepted" | "Dismissed";
};

const initialCards: ProofCardItem[] = [
  {
    id: "card-1",
    severity: "High",
    severityBadgeClass: "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]",
    title: "Unsupported claim",
    issueText: '"100% recycled plastic" overstates the approved recycled content.',
    sourceCode: "F-014 · Packaging specification · v2.1",
    sourceRule: "Bottle body: 80% recycled plastic. Cap excluded.",
    originalSentence: "Our bottles are made with 100% recycled plastic.",
    suggestedSentence: "Our bottles are made with 80% recycled plastic, excluding the cap.",
    highlightBoxClass: "bg-[#fef2f2] border-l-[3px] border-[#ef4444]",
    status: "Open",
  },
  {
    id: "card-2",
    severity: "Medium",
    severityBadgeClass: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
    title: "Incorrect terminology",
    issueText: '"Eco pods" is not an approved Aster product term.',
    sourceCode: "T-003 · Refill concentrates · v1.2",
    sourceRule: 'Use "refill concentrates". Avoid "eco pods".',
    originalSentence: "Just add water to our eco pods and refill your Aster bottle.",
    suggestedSentence: "Just add water to our refill concentrates and refill your Aster bottle.",
    highlightBoxClass: "bg-[#fffbeb] border-l-[3px] border-[#f59e0b]",
    status: "Open",
  },
  {
    id: "card-3",
    severity: "Low",
    severityBadgeClass: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
    title: "Tone issue",
    issueText: '"Planet-saving miracle" is exaggerated and off-brand.',
    sourceCode: "G-001 · Voice & tone · v1.3",
    sourceRule: "Be calm, practical and optimistic. Avoid miracle language.",
    originalSentence: "It's a planet-saving miracle for your home.",
    suggestedSentence: "It's a simple step toward a less wasteful routine.",
    highlightBoxClass: "bg-[#fffbeb] border-l-[3px] border-[#f59e0b]",
    status: "Open",
  },
];

export const ReviewWorkspace = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<ProofCardItem[]>(initialCards);

  const resolvedCount = cards.filter((c) => c.status !== "Open").length;
  const openCount = cards.length - resolvedCount;
  const allResolved = openCount === 0;

  const handleCardAction = (id: string, newStatus: "Accepted" | "Dismissed") => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, status: newStatus } : card))
    );
  };

  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f6f5ef] text-[#252b29]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader breadcrumb="Reviews / A simpler clean" />
        {/* Workspace Body */}
        <div className="flex-1 p-10">
          {/* Title & Status Pill */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#707871]">
                Review PR-024 · Aster
              </span>
              <h1 className="text-3xl font-medium tracking-[-0.8px] text-[#173d35]">
                A simpler clean — launch email
              </h1>
              <span className="text-[13px] text-[#707871]">
                Email campaign · Submitted by Maya Lewis · 05 Nov 2026, 09:14
              </span>
            </div>
            <span className="rounded-full border border-[#fde68a] bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#92400e]">
              {allResolved ? "Ready for approval" : "In review"}
            </span>
          </div>

          {/* 3-Step Progress Bar */}
          <div className="my-6 flex overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white">
            <div className="flex flex-1 items-center gap-2 border-r border-[#dfe3da] px-6 py-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#173d35]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5L4 7L8 3"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-[#111827]">Add content</span>
              <i className="ti ti-chevron-right ml-auto text-sm text-[#9ca3af]" />
            </div>

            <div className="flex flex-1 items-center gap-2 border-r border-[#dfe3da] bg-[#f8f9f6] px-6 py-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#173d35] text-[11px] font-semibold text-white">
                2
              </div>
              <span className="text-[13px] font-semibold text-[#173d35]">
                Resolve findings
              </span>
              <i className="ti ti-chevron-right ml-auto text-sm text-[#9ca3af]" />
            </div>

            <div className="flex flex-1 items-center gap-2 px-6 py-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#d1d5db] text-[11px] font-semibold text-[#6b7280]">
                3
              </div>
              <span className="text-[13px] text-[#6b7280]">Approve &amp; release</span>
            </div>
          </div>

          {/* Two Columns: Left Draft & Right Proof Cards */}
          <div className="flex items-start gap-6">
            {/* Left Column: Submitted Content + Resolution Progress */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white">
                <div className="flex items-center justify-between border-b border-[#dfe3da] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#111827]">
                      Submitted content
                    </span>
                    <span className="rounded border border-[#e5e7eb] bg-[#f3f4f6] px-1.5 py-0.5 text-[11px] font-medium text-[#6b7280]">
                      {resolvedCount > 0 ? "v1.1" : "v1.0"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/new-review")}
                    className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#111827] cursor-pointer"
                  >
                    <i className="ti ti-edit text-sm" />
                    <span>Edit content</span>
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#9ca3af]">
                    Aster / Launch Email
                  </div>
                  <h2 className="mb-4 text-[22px] font-semibold leading-[30px] text-[#111827]">
                    A simpler way to clean.
                  </h2>
                  <p className="mb-3 text-sm leading-[22px] text-[#374151]">
                    Meet a simpler way to clean.
                  </p>

                  {/* Highlighted Sentences linked to Proof Cards */}
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className={`mb-2.5 rounded px-4 py-3 text-sm leading-[22px] text-[#374151] transition-all ${
                        card.status === "Accepted"
                          ? "border-l-[3px] border-[#16a34a] bg-[#f0fdf4]"
                          : card.status === "Dismissed"
                            ? "border-l-[3px] border-[#9ca3af] bg-[#f9fafb]"
                            : card.highlightBoxClass
                      }`}
                    >
                      {card.status === "Accepted"
                        ? card.suggestedSentence
                        : card.originalSentence}
                    </div>
                  ))}

                  <p className="mt-4 text-sm leading-[22px] text-[#374151]">
                    Discover the everyday refill ritual.
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-[#dfe3da] px-5 py-3">
                  <span className="rounded-full border border-[#fecaca] bg-[#fef2f2] px-2.5 py-0.5 text-[11px] font-medium text-[#dc2626]">
                    High severity
                  </span>
                  <span className="rounded-full border border-[#fde68a] bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-medium text-[#92400e]">
                    Medium / low severity
                  </span>
                </div>
              </div>

              {/* Resolution Summary Box */}
              <div className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white">
                <div className="flex items-center gap-3 border-b border-[#dfe3da] px-5 py-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#d1d5db] text-[10px] font-semibold text-[#6b7280]">
                    {openCount}
                  </div>
                  <span className="text-[13px] font-medium text-[#111827]">
                    {allResolved
                      ? "All findings resolved!"
                      : `${openCount} findings need your decision`}
                  </span>
                </div>
                <div className="px-5 py-3.5 text-xs leading-[18px] text-[#6b7280]">
                  Accept a suggestion, edit your content or dismiss with a reason before
                  submitting.
                </div>
                <div className="flex items-center justify-between border-t border-[#dfe3da] px-5 py-3.5">
                  <span className="text-xs text-[#6b7280]">
                    {resolvedCount} of {cards.length} findings resolved
                  </span>
                  <button
                    type="button"
                    disabled={!allResolved}
                    onClick={() => navigate("/approval")}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-medium transition ${
                      allResolved
                        ? "bg-[#173d35] text-white hover:bg-[#245448] cursor-pointer"
                        : "cursor-not-allowed border border-[#e5e7eb] bg-[#f3f4f6] text-[#6b7280] opacity-60"
                    }`}
                  >
                    <span>Submit for Approval</span>
                    <i className="ti ti-arrow-right text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Proof Cards */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111827]">Proof Cards</span>
                <span className="text-xs text-[#6b7280]">
                  {openCount} open · {resolvedCount} resolved
                </span>
              </div>

              {cards.map((card) => (
                <div
                  key={card.id}
                  className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white"
                >
                  <div className="flex items-center justify-between border-b border-[#dfe3da] px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${card.severityBadgeClass}`}
                      >
                        {card.severity}
                      </span>
                      <span className="text-[13px] font-semibold text-[#111827]">
                        {card.title}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#6b7280]">
                      {card.status}
                    </span>
                  </div>

                  <div className="border-b border-[#dfe3da] px-4 py-3 text-[13px] text-[#374151]">
                    {card.issueText}
                  </div>

                  <div className="border-b border-[#dfe3da] bg-[#f9fafb] px-4 py-2.5">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-[#374151]">
                      <span>{card.sourceCode}</span>
                      <i className="ti ti-external-link text-[11px] text-[#6b7280]" />
                    </div>
                    <div className="text-[11px] text-[#6b7280]">{card.sourceRule}</div>
                  </div>

                  <div className="border-b border-[#dfe3da] px-4 py-2.5">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6b7280]">
                      Suggested Correction
                    </div>
                    <div className="text-[13px] text-[#374151]">
                      {card.suggestedSentence}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleCardAction(card.id, "Dismissed")}
                      className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCardAction(card.id, "Accepted")}
                      className="flex items-center gap-1.5 rounded-md bg-[#173d35] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#245448] cursor-pointer"
                    >
                      <i className="ti ti-check text-xs" />
                      <span>
                        {card.status === "Accepted" ? "Accepted" : "Accept suggestion"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkspace;