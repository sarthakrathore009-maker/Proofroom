import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";
import { apiRequest } from "../../lib/api";
import { useWorkspaceData, type ReviewDetail } from "../../context/WorkspaceDataContext";
import { getCurrentUser } from "../../lib/roles";
import {
  RoleAccessPill,
  approvalAccessMessage,
  contentSubmitAccessMessage,
  creatorActionLockNote,
  reviewerActionLockNote,
} from "../../components/RoleAccessPill";

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

const mapProofCard = (card: ReviewDetail["proofCards"][number]): ProofCardItem => ({
  id: card.id,
  severity: card.severity,
  severityBadgeClass:
    card.severity === "High"
      ? "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]"
      : card.severity === "Medium"
        ? "bg-[#fffbeb] border-[#fde68a] text-[#92400e]"
        : "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
  title: card.category_title,
  issueText: card.issue_explanation,
  sourceCode: card.source_code,
  sourceRule: card.source_rule_summary,
  originalSentence: card.original_excerpt,
  suggestedSentence: card.suggested_correction,
  highlightBoxClass:
    card.severity === "High"
      ? "bg-[#fef2f2] border-l-[3px] border-[#ef4444]"
      : "bg-[#fffbeb] border-l-[3px] border-[#f59e0b]",
  status: card.resolution_status,
});

const applyAcceptedCorrections = (body: string, cards: ProofCardItem[]) =>
  cards.reduce(
    (draft, card) =>
      card.status === "Accepted"
        ? draft.split(card.originalSentence).join(card.suggestedSentence)
        : draft,
    body
  );

export const ReviewWorkspace = () => {
  const navigate = useNavigate();
  const { id: routeReviewId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedReviewId = searchParams.get("reviewId") ?? routeReviewId ?? null;
  const user = getCurrentUser();
  const canReview = user.role === "reviewer";
  const canEdit = user.role === "creator";
  const submitAccess = contentSubmitAccessMessage(user.role);
  const approvalAccess = approvalAccessMessage(user.role);
  const lockNote = creatorActionLockNote(user.role);
  const reviewLockNote = reviewerActionLockNote(user.role);
  const {
    getReviewDetail,
    reviewDetailsById,
    latestReviewDetail,
    putReviewDetail,
    refreshWorkspaceAfterActivity,
    ensureInitialLoad,
    isInitialLoaded,
  } = useWorkspaceData();

  const [cards, setCards] = useState<ProofCardItem[]>([]);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewType, setReviewType] = useState("");
  const [reviewCode, setReviewCode] = useState("");
  const [creatorName, setCreatorName] = useState("");

  const applyDetail = (data: ReviewDetail | null) => {
    if (!data?.review) return;
    setReviewId(data.review.id);
    setReviewBody(data.review.body_text);
    setReviewTitle(data.review.title);
    setReviewType(data.review.content_type);
    setReviewCode(data.review.review_code);
    setCreatorName(data.review.creator_name);
    setCards(data.proofCards.map(mapProofCard));
  };

  useEffect(() => {
    if (!isInitialLoaded) {
      void ensureInitialLoad();
    }
  }, [ensureInitialLoad, isInitialLoaded]);

  useEffect(() => {
    const cached = requestedReviewId
      ? reviewDetailsById[requestedReviewId]
      : latestReviewDetail;
    if (cached?.review) {
      applyDetail(cached);
      return;
    }
    let active = true;
    void getReviewDetail(requestedReviewId).then((data) => {
      if (active) applyDetail(data);
    });
    return () => {
      active = false;
    };
  }, [getReviewDetail, latestReviewDetail, requestedReviewId, reviewDetailsById]);

  const resolvedCount = cards.filter((c) => c.status !== "Open").length;
  const openCount = cards.length - resolvedCount;
  const allResolved = cards.length === 0 || resolvedCount === cards.length;
  const draftSegments = reviewBody.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];

  const handleCardAction = async (id: string, newStatus: "Accepted" | "Dismissed") => {
    try {
      await apiRequest(`/api/proof-cards/${id}`, {
        method: "PATCH",
        body: {
          resolution_status: newStatus,
          ...(newStatus === "Dismissed"
            ? { exception_reason: "Dismissed by reviewer" }
            : {}),
        },
      });
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, status: newStatus } : card))
      );
      if (reviewId) {
        const existing = reviewDetailsById[reviewId] ?? latestReviewDetail;
        if (existing) {
          putReviewDetail({
            ...existing,
            proofCards: existing.proofCards.map((card) =>
              card.id === id ? { ...card, resolution_status: newStatus } : card
            ),
          });
        }
      }
      await refreshWorkspaceAfterActivity();
    } catch (error) {
      console.error("Unable to update proof card", error);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!reviewId) return;
    try {
      await apiRequest(`/api/reviews/${reviewId}/approve`, {
        method: "POST",
        body: {
          decision: "Approved",
          final_body_text: applyAcceptedCorrections(reviewBody, cards),
        },
      });
      await refreshWorkspaceAfterActivity();
      navigate(`/approval?reviewId=${encodeURIComponent(reviewId)}`);
    } catch (error) {
      console.error("Unable to submit review for approval", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f6f5ef] text-[#252b29]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader breadcrumb="Reviews / A simpler clean" />
        {/* Workspace Body */}
        <div data-tour="reviews-findings-section" className="flex-1 p-10">
          {/* Title & Status Pill */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#707871]">
                Review {reviewCode} · DemoBrand Co.
              </span>
              <h1 className="text-3xl font-medium tracking-[-0.8px] text-[#173d35]">
                {reviewTitle}
              </h1>
              <span className="text-[13px] text-[#707871]">
                {reviewType} · Submitted by {creatorName}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <RoleAccessPill variant={submitAccess.variant} message={submitAccess.message} />
                <RoleAccessPill variant={approvalAccess.variant} message={approvalAccess.message} />
              </div>
            </div>
            <span className="rounded-full border border-[#fde68a] bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#92400e] shrink-0">
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
              <div
                data-tour="submitted-content"
                className="overflow-hidden rounded-[10px] border border-[#dfe3da] bg-white"
              >
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
                    disabled={!canEdit}
                    title={canEdit ? "Edit content" : lockNote}
                    onClick={() =>
                      navigate(
                        reviewId
                          ? `/new-review?reviewId=${encodeURIComponent(reviewId)}`
                          : "/new-review?new=true"
                      )
                    }
                    className={`flex items-center gap-1.5 text-[13px] ${canEdit ? "text-[#6b7280] hover:text-[#111827] cursor-pointer" : "cursor-not-allowed text-[#9ca3af]"}`}
                  >
                    <i className="ti ti-edit text-sm" />
                    <span>{canEdit ? "Edit content" : "🔒 Edit content"}</span>
                  </button>
                </div>

                <div className="p-6">
                  <h2 className="mb-4 text-[22px] font-semibold leading-[30px] text-[#111827]">
                    {reviewTitle}
                  </h2>
                  {draftSegments.map((segment, index) => {
                    const trimmedSegment = segment.trim();
                    const matchingCard = cards.find((card) =>
                      trimmedSegment.includes(card.originalSentence)
                    );
                    if (!matchingCard) {
                      return (
                        <p key={`draft-${index}`} className="mb-3 text-sm leading-[22px] text-[#374151]">
                          {trimmedSegment}
                        </p>
                      );
                    }
                    const displayedText =
                      matchingCard.status === "Accepted"
                        ? matchingCard.suggestedSentence
                        : matchingCard.originalSentence;
                    return (
                      <div
                        key={matchingCard.id}
                        className={`mb-2.5 rounded px-4 py-3 text-sm leading-[22px] text-[#374151] transition-all ${
                          matchingCard.status === "Accepted"
                            ? "border-l-[3px] border-[#16a34a] bg-[#f0fdf4]"
                            : matchingCard.highlightBoxClass
                        }`}
                      >
                        {displayedText}
                      </div>
                    );
                  })}
                </div>

                <div
                  data-tour="severity-badges"
                  className="flex items-center gap-2 border-t border-[#dfe3da] px-5 py-3"
                >
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
                    data-tour="submit-approval-btn"
                    disabled={!allResolved || !canEdit}
                    title={canEdit ? undefined : lockNote}
                    onClick={handleSubmitForApproval}
                    className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-medium transition ${
                      allResolved && canEdit
                        ? "bg-[#173d35] text-white hover:bg-[#245448] cursor-pointer"
                        : "cursor-not-allowed border border-[#e5e7eb] bg-[#f3f4f6] text-[#6b7280] opacity-60"
                    }`}
                  >
                    <span>{canEdit ? "Submit for Approval" : "🔒 Submit for Approval"}</span>
                    <i className="ti ti-arrow-right text-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Proof Cards */}
            <div data-tour="proof-cards" className="flex flex-1 flex-col gap-3">
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
                      disabled={!canReview}
                      title={canReview ? "Request changes" : reviewLockNote}
                      onClick={() => handleCardAction(card.id, "Dismissed")}
                      className={`rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium ${canReview ? "text-[#374151] hover:bg-[#f9fafb] cursor-pointer" : "cursor-not-allowed text-[#9ca3af]"}`}
                    >
                      {canReview ? "Dismiss" : "🔒 Dismiss"}
                    </button>
                    <button
                      type="button"
                      disabled={!canReview}
                      title={canReview ? "Accept suggestion" : reviewLockNote}
                      onClick={() => handleCardAction(card.id, "Accepted")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${canReview ? "bg-[#173d35] text-white hover:bg-[#245448] cursor-pointer" : "cursor-not-allowed bg-[#e5e7eb] text-[#707871]"}`}
                    >
                      <i className="ti ti-check text-xs" />
                      <span>
                        {canReview
                          ? card.status === "Accepted"
                            ? "Accepted"
                            : "Accept suggestion"
                          : "🔒 Accept suggestion"}
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