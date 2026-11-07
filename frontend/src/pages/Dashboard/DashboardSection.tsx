import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

const vector10 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>";
const vector11 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>";
const vector12 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>";
const vector13 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z'/><line x1='4' y1='22' x2='4' y2='15'/></svg>";
const arrowUpRight =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='7' y1='17' x2='17' y2='7'/><polyline points='7 7 17 7 17 17'/></svg>";
const vector14 = arrowUpRight;
const vector15 = arrowUpRight;
const vector16 = arrowUpRight;
const vector17 = arrowUpRight;
const vector18 = arrowUpRight;
const vector19 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>";
const vector20 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const vector21 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg>";

type Review = {
  id: string;
  name: string;
  type: string;
  version: string;
  initials: string;
  creator: string;
  status: string;
  statusClass: string;
  statusTextClass: string;
  date: string;
  icon: string;
};

type Activity = {
  title: string;
  description: string;
  time: string;
  icon: string;
};

const reviews: Review[] = [
  {
    id: "mock-review-1",
    name: "A simpler clean — launch email",
    type: "Email campaign",
    version: "v1.0",
    initials: "ML",
    creator: "Maya Lewis",
    status: "In review",
    statusClass: "bg-[#f5eedc]",
    statusTextClass: "text-[#8a642b]",
    date: "05 Nov 2026",
    icon: vector14,
  },
  {
    id: "mock-review-2",
    name: "Refill ritual — product page",
    type: "Website copy",
    version: "v2.0",
    initials: "OC",
    creator: "Oliver Chen",
    status: "Pending approval",
    statusClass: "bg-[#f5eedc]",
    statusTextClass: "text-[#8a642b]",
    date: "04 Nov 2026",
    icon: vector15,
  },
  {
    id: "mock-review-3",
    name: "Everyday essentials — social copy",
    type: "Social post",
    version: "v1.1",
    initials: "ML",
    creator: "Maya Lewis",
    status: "Approved",
    statusClass: "bg-[#dce6de]",
    statusTextClass: "text-[#173d35]",
    date: "04 Nov 2026",
    icon: vector16,
  },
  {
    id: "mock-review-4",
    name: "Meet the refill concentrate",
    type: "Product description",
    version: "v1.0",
    initials: "NP",
    creator: "Nina Patel",
    status: "Approved",
    statusClass: "bg-[#dce6de]",
    statusTextClass: "text-[#173d35]",
    date: "03 Nov 2026",
    icon: vector17,
  },
  {
    id: "mock-review-5",
    name: "DemoBrand Co. welcome series",
    type: "Email campaign",
    version: "v2.1",
    initials: "OC",
    creator: "Oliver Chen",
    status: "Changes requested",
    statusClass: "bg-[#f8f9f6]",
    statusTextClass: "text-[#707871]",
    date: "02 Nov 2026",
    icon: vector18,
  },
];

const activities: Activity[] = [
  {
    title: "Review started",
    description: "You added A simpler clean — launch email.",
    time: "Today, 09:14",
    icon: vector19,
  },
  {
    title: "Source updated",
    description: "Nina approved Packaging specification v2.1.",
    time: "Yesterday, 16:42",
    icon: vector20,
  },
  {
    title: "Content approved",
    description: "Elena approved Everyday essentials.",
    time: "Yesterday, 14:10",
    icon: vector21,
  },
];

const summaryCards = [
  {
    title: "Total Reviews",
    value: "24",
    description: "Across your DemoBrand Co. workspace",
    icon: vector11,
    iconClass: "w-[90.44%] h-[94.61%] top-[5.39%] left-[9.56%]",
  },
  {
    title: "Pending Reviews",
    value: "03",
    description: "2 in review · 1 awaiting approval",
    icon: vector12,
    iconClass: "w-[94.61%] h-[94.61%] top-[5.39%] left-[5.39%]",
  },
  {
    title: "Issues Found",
    value: "07",
    description: "Open findings across active reviews",
    icon: vector13,
    iconClass: "w-[86.27%] h-[94.61%] top-[5.39%] left-[13.73%]",
  },
];

const getGreeting = () => {
  const hour = parseInt(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }),
    10,
  );

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};

export const DashboardSection = () => {
  const navigate = useNavigate();
  const user = { name: "Maya" };
  const greeting = getGreeting();
  const [newReviewOpen, setNewReviewOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryValues, setSummaryValues] = useState({
    totalReviews: "0",
    pendingReviews: "0",
    issuesFound: "0",
  });

  useEffect(() => {
    let active = true;
    apiRequest<{
      reviews: Array<{
        id: string;
        title: string;
        content_type: string;
        version: string;
        creator_name: string;
        creator_initials: string;
        status: string;
        created_at: string;
      }>;
      openIssuesCount: number;
    }>("/api/dashboard", { method: "GET" })
      .then((data) => {
        if (!active) return;
        const mappedReviews = data.reviews.map((review) => ({
          id: review.id,
          name: review.title,
          type: review.content_type,
          version: review.version,
          initials: review.creator_initials,
          creator: review.creator_name,
          status: review.status,
          statusClass:
            review.status === "Approved" ? "bg-[#dce6de]" : review.status === "In review" ? "bg-[#f5eedc]" : "bg-[#f8f9f6]",
          statusTextClass:
            review.status === "Approved" ? "text-[#173d35]" : review.status === "In review" ? "text-[#8a642b]" : "text-[#707871]",
          date: new Date(review.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          icon: arrowUpRight,
        }));
        setLiveReviews(mappedReviews);
        const pending = data.reviews.filter((review) => review.status !== "Approved").length;
        setSummaryValues({
          totalReviews: String(data.reviews.length),
          pendingReviews: String(pending).padStart(2, "0"),
          issuesFound: String(data.openIssuesCount).padStart(2, "0"),
        });
      })
      .catch(() => {
        if (!active) return;
        setLiveReviews(reviews);
        setSummaryValues({
          totalReviews: "24",
          pendingReviews: "03",
          issuesFound: "07",
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const displayedReviews = showAllReviews ? liveReviews : liveReviews.slice(0, 5);
  const inReviewArrowIndex = (() => {
    const found = displayedReviews.findIndex((review) => review.status === "In review");
    return found >= 0 ? found : 0;
  })();
  const liveSummaryCards = summaryCards.map((card) => ({
    ...card,
    value:
      loading
        ? "—"
        : card.title === "Total Reviews"
        ? summaryValues.totalReviews
        : card.title === "Pending Reviews"
          ? summaryValues.pendingReviews
          : summaryValues.issuesFound,
  }));

  return (
    <main className="flex flex-col items-start relative flex-1 grow min-w-0">
      <div className="gap-7 pt-[34px] pb-9 px-10 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <section
          aria-labelledby="workspace-heading"
          className="gap-2.5 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
        >
          <p className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[1.40px] leading-[normal] whitespace-nowrap">
            YOUR WORKSPACE AT A GLANCE
          </p>
          <div className="flex items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <h1
              id="workspace-heading"
              className="relative flex-1 [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-3xl tracking-[-1.00px] leading-[normal]"
            >
              {greeting}, {user.name || "Maya"}.
            </h1>
            <button
              type="button"
              onClick={() => navigate("/new-review?new=true")}
              className="all-unset box-border inline-flex h-10 items-center justify-center gap-2 px-4 py-0 relative flex-[0_0_auto] bg-[#173d35] rounded-md overflow-hidden border border-solid cursor-pointer"
            >
              <span className="relative w-4 h-4">
                <img
                  className="absolute w-[82.30%] h-[82.30%] top-[17.70%] left-[17.70%]"
                  alt=""
                  aria-hidden="true"
                  src={vector10}
                />
              </span>
              <span className="text-white text-[13px] leading-[normal] relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold tracking-[0]">
                New Review
              </span>
            </button>
          </div>
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-sm leading-[21px] relative tracking-[0]">
            A little clarity before your next release. Here&apos;s where things
            stand.
          </p>
        </section>
        <section
          aria-label="Workspace summary"
          className="items-start gap-5 self-stretch w-full flex-[0_0_auto] overflow-hidden flex relative"
        >
          {liveSummaryCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col items-start gap-3.5 p-[22px] relative flex-1 grow bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da]"
            >
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <span className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]">
                  {card.title}
                </span>
                <span className="relative w-[17px] h-[17px]">
                  <img
                    className={`absolute ${card.iconClass}`}
                    alt=""
                    aria-hidden="true"
                    src={card.icon}
                  />
                </span>
              </div>
              <strong className="relative w-fit [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-[34px] tracking-[-1.00px] leading-[normal]">
                {card.value}
              </strong>
              <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
                {card.description}
              </p>
            </article>
          ))}
        </section>
        <section
          data-tour="recent-reviews"
          aria-labelledby="reviews-heading"
          className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da]"
        >
          <div className="flex items-center justify-between px-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
            <h2
              id="reviews-heading"
              className="w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-base leading-6 whitespace-nowrap relative tracking-[0]"
            >
              Recent Reviews
            </h2>
            <button
              type="button"
              onClick={() => setShowAllReviews((current) => !current)}
              className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-xs tracking-[0] leading-[18px] whitespace-nowrap cursor-pointer"
            >
              {showAllReviews ? "Show recent reviews →" : "View all reviews →"}
            </button>
          </div>
          <div className="flex h-[37px] items-center px-6 py-0 relative self-stretch w-full bg-[#f8f9f6]">
            <div className="relative w-[435px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[10px] tracking-[0.80px] leading-[normal]">
              CONTENT NAME
            </div>
            <div className="w-[190px] relative [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[10px] tracking-[0.80px] leading-[normal]">
              CREATOR
            </div>
            <div className="w-[220px] relative [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[10px] tracking-[0.80px] leading-[normal]">
              STATUS
            </div>
            <div className="w-[180px] relative [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[10px] tracking-[0.80px] leading-[normal]">
              DATE
            </div>
          </div>
          {loading ? (
            <div className="flex h-[72px] items-center px-6 text-xs text-[#707871]">
              Loading reviews…
            </div>
          ) : displayedReviews.map((review, index) => (
            <article
              key={`${review.id}-${index}`}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(
                  review.status === "Approved"
                    ? `/approval?reviewId=${encodeURIComponent(review.id)}`
                    : `/new-review?reviewId=${encodeURIComponent(review.id)}`
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(
                    review.status === "Approved"
                      ? `/approval?reviewId=${encodeURIComponent(review.id)}`
                      : `/new-review?reviewId=${encodeURIComponent(review.id)}`
                  );
                }
              }}
              className="h-[72px] items-center px-6 py-0 self-stretch w-full border-t [border-top-style:solid] border-[#dfe3da] flex relative"
            >
              <div className="flex flex-col w-[435px] items-start gap-[3px] relative">
                <h3 className="self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#252b29] text-[13px] leading-[19.5px] relative tracking-[0]">
                  {review.name}
                </h3>
                <div className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
                  {review.type} · {review.version}
                </div>
              </div>
              <div className="flex w-[190px] items-center gap-2 relative">
                <div className="w-[27px] h-[27px] bg-[#f6f5ef] flex items-center justify-center relative rounded-[100px] overflow-hidden">
                  <span className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[9px] leading-[13.5px] whitespace-nowrap relative tracking-[0]">
                    {review.initials}
                  </span>
                </div>
                <span className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]">
                  {review.creator}
                </span>
              </div>
              <div className="w-[220px] items-start flex relative">
                <span
                  className={`inline-flex items-start gap-[5px] px-2 py-1 ${review.statusClass} rounded overflow-hidden relative flex-[0_0_auto]`}
                >
                  <span
                    className={`mt-[-1.00px] ${review.statusTextClass} text-[11px] leading-[14.3px] whitespace-nowrap relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold tracking-[0]`}
                  >
                    {review.status}
                  </span>
                </span>
              </div>
              <div className="w-[150px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
                {review.date}
              </div>
              <button
                type="button"
                data-tour={index === inReviewArrowIndex ? "in-review-arrow" : undefined}
                aria-label={`Open ${review.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(
                    review.status === "Approved"
                      ? `/approval?reviewId=${encodeURIComponent(review.id)}`
                      : `/new-review?reviewId=${encodeURIComponent(review.id)}`
                  );
                }}
                className="relative w-[15px] h-[15px] cursor-pointer"
              >
                <img
                  className="absolute w-[74.16%] h-[74.16%] top-[25.84%] left-[25.84%]"
                  alt=""
                  aria-hidden="true"
                  src={review.icon}
                />
              </button>
            </article>
          ))}
        </section>
        <section
          aria-labelledby="activity-heading"
          className="flex-col items-start gap-5 p-6 bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da] shadow-[0px_2px_5px_#173d3505] flex relative self-stretch w-full flex-[0_0_auto]"
        >
          <div className="items-center justify-between flex relative self-stretch w-full flex-[0_0_auto]">
            <h2
              id="activity-heading"
              className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-base tracking-[0] leading-6 whitespace-nowrap"
            >
              Recent activity
            </h2>
            <button
              type="button"
              className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-xs tracking-[0] leading-[18px] whitespace-nowrap cursor-pointer"
            >
              View reviews →
            </button>
          </div>
          <div className="items-start gap-7 self-stretch w-full flex-[0_0_auto] flex relative">
            {activities.map((activity) => (
              <article
                key={activity.title}
                className="items-start gap-3 flex-1 grow flex relative"
              >
                <div className="w-[30px] h-[30px] items-center justify-center bg-[#f8f9f6] rounded-md overflow-hidden flex relative">
                  <span className="relative w-4 h-4">
                    <img
                      className="absolute w-[94.80%] h-[94.80%] top-[5.20%] left-[5.20%]"
                      alt=""
                      aria-hidden="true"
                      src={activity.icon}
                    />
                  </span>
                </div>
                <div className="flex-col items-start gap-[5px] flex-1 grow flex relative">
                  <h3 className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                    {activity.title}
                  </h3>
                  <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
                    {activity.description}
                  </p>
                  <time className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] relative tracking-[0]">
                    {activity.time}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {newReviewOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#173d35]/20"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNewReviewOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-review-title"
            className="w-[360px] rounded-[10px] border border-[#dfe3da] bg-white p-6 shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="new-review-title"
                  className="[font-family:'Inter-SemiBold',Helvetica] text-base font-semibold leading-6 text-[#252b29]"
                >
                  New review
                </h2>
                <p className="mt-2 [font-family:'Inter-Regular',Helvetica] text-xs leading-[18px] text-[#707871]">
                  Start a new content review in your workspace.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close new review dialog"
                onClick={() => navigate("/new-review?new=true")}
                className="[font-family:'Inter-SemiBold',Helvetica] text-lg leading-none text-[#707871] cursor-pointer"
              >
                ×
              </button>
            </div>
            <button
              type="button"
              onClick={() => setNewReviewOpen(false)}
              className="mt-6 h-10 w-full rounded-md bg-[#173d35] [font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-white cursor-pointer"
            >
              Continue
            </button>
          </section>
        </div>
      )}
    </main>
  );
};