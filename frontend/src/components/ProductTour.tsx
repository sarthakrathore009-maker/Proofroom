import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, type UserRole } from "../lib/roles";

/** Replace this URL with your hosted sample brand poster when ready. */
export const SAMPLE_TEST_IMAGE_URL =
  "https://example.com/sample-brand-poster.png";

export const TOUR_STORAGE_KEY = "proofroom_tour_active";
export const TOUR_DISMISSED_KEY = "proofroom_tour_dismissed";
export const TOUR_COMPLETED_KEY = "proofroom_tour_completed";
export const TOUR_START_EVENT = "proofroom:start-tour";

const ROUTE_SETTLE_MS = 350;
const SPOTLIGHT_PADDING = 8;
const TOUR_FLAG_KEYS = [TOUR_STORAGE_KEY, TOUR_DISMISSED_KEY, TOUR_COMPLETED_KEY];

type AccessKind = "unlocked" | "locked";
type TourRoleLabel = "ADMIN" | "CREATOR" | "REVIEWER";

type TourStep = {
  target: string;
  route: string;
  title: string;
  description: string;
  access: {
    kind: AccessKind;
    forRole: TourRoleLabel;
    openFor?: TourRoleLabel;
  };
  nextLabel?: string;
  onNext?: "download-passport";
  extra?: ReactNode;
};

const sampleDownloadExtra = (
  <p className="mt-2 text-[13px] leading-5 text-[#374151]">
    <a
      href={SAMPLE_TEST_IMAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="underline font-medium text-emerald-700"
    >
      Download sample test image here
    </a>
  </p>
);

export const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    target: "dashboard-overview",
    route: "/dashboard",
    title: "Governance Overview & Clarity Radar",
    description:
      "Monitor workspace reviews, active findings, and compliance health.",
    access: { kind: "unlocked", forRole: "ADMIN" },
  },
  {
    target: "brand-vault-management",
    route: "/brand-vault",
    title: "Brand Vault Management",
    description:
      "Full write access to add, edit, and verify approved facts, expiry dates, terminology, and visual rules.",
    access: { kind: "unlocked", forRole: "ADMIN" },
  },
  {
    target: "file-upload-section",
    route: "/new-review",
    title: "Content Submission & Draft Revision",
    description:
      "Locked for your Admin role and open for the Creator role (Oliver Chen) to maintain strict separation of duties.",
    access: { kind: "locked", forRole: "ADMIN", openFor: "CREATOR" },
  },
  {
    target: "release-passport-card",
    route: "/approval",
    title: "Final Sign-Off & Release Passport",
    description:
      "Locked for your Admin role and open exclusively for the Reviewer role (Nina Patel).",
    access: { kind: "locked", forRole: "ADMIN", openFor: "REVIEWER" },
    nextLabel: "Finish Tour ✓",
  },
];

export const CREATOR_TOUR_STEPS: TourStep[] = [
  {
    target: "file-upload-section",
    route: "/new-review",
    title: "Submit Content & Upload Files",
    description:
      "Type your draft or upload PDF, DOCX, TXT, PNG, or JPG files for instant extraction.",
    access: { kind: "unlocked", forRole: "CREATOR" },
    extra: sampleDownloadExtra,
  },
  {
    target: "reviews-findings-section",
    route: "/reviews",
    title: "Revise Drafts & Request Exceptions",
    description:
      "Apply suggested fixes from Proof Cards or submit a documented exception request.",
    access: { kind: "unlocked", forRole: "CREATOR" },
  },
  {
    target: "brand-vault-management",
    route: "/brand-vault",
    title: "Brand Vault Rules (Read-Only)",
    description:
      "Editing Brand Vault rules is locked for your Creator role and open only for the Admin role (Maya Lewis).",
    access: { kind: "locked", forRole: "CREATOR", openFor: "ADMIN" },
  },
  {
    target: "release-passport-card",
    route: "/approval",
    title: "Final Approval & Release Passport",
    description:
      "Self-approval is locked for your Creator role and open only for the Reviewer role (Nina Patel).",
    access: { kind: "locked", forRole: "CREATOR", openFor: "REVIEWER" },
    nextLabel: "Finish Tour ✓",
  },
];

export const REVIEWER_TOUR_STEPS: TourStep[] = [
  {
    target: "reviews-findings-section",
    route: "/reviews",
    title: "Audit Proof Cards & Exception Requests",
    description:
      "Inspect flagged claims, verify Brand Vault source links, and evaluate creator exceptions.",
    access: { kind: "unlocked", forRole: "REVIEWER" },
  },
  {
    target: "release-passport-card",
    route: "/approval",
    title: "Approve & Generate Release Passport",
    description:
      "Leave reviewer comments, request changes, or approve the draft to generate an immutable Release Passport.",
    access: { kind: "unlocked", forRole: "REVIEWER" },
  },
  {
    target: "brand-vault-management",
    route: "/brand-vault",
    title: "Brand Vault Modification (Read-Only)",
    description:
      "Modifying Brand Vault rules is locked for your Reviewer role and open only for the Admin role (Maya Lewis).",
    access: { kind: "locked", forRole: "REVIEWER", openFor: "ADMIN" },
  },
  {
    target: "file-upload-section",
    route: "/new-review",
    title: "Content Creation & Draft Editing",
    description:
      "Submitting or rewriting creator drafts is locked for your Reviewer role and open only for the Creator role (Oliver Chen).",
    access: { kind: "locked", forRole: "REVIEWER", openFor: "CREATOR" },
    nextLabel: "Finish Tour ✓",
  },
];

const TOUR_STEPS_BY_ROLE: Record<UserRole, TourStep[]> = {
  admin: ADMIN_TOUR_STEPS,
  creator: CREATOR_TOUR_STEPS,
  reviewer: REVIEWER_TOUR_STEPS,
};

function accessPillLabel(access: TourStep["access"]): string {
  if (access.kind === "unlocked") {
    return `🔓 UNLOCKED FOR ${access.forRole}`;
  }
  return `🔒 LOCKED FOR ${access.forRole} • OPEN FOR ${access.openFor ?? "ANOTHER ROLE"}`;
}

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TooltipPlacement = {
  top: number;
  left: number;
  placement: "right" | "below" | "left" | "above" | "center";
};

const VIEWPORT_EDGE = 16;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function waitForTarget(selector: string, maxMs = 600): Promise<HTMLElement | null> {
  const started = Date.now();
  await waitForAnimationFrame();
  while (Date.now() - started < maxMs) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return el;
    }
    await wait(50);
  }
  const fallback = document.querySelector<HTMLElement>(selector);
  if (!fallback) return null;
  const rect = fallback.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? fallback : null;
}

function measureSpotlight(el: HTMLElement): SpotlightRect {
  const rect = el.getBoundingClientRect();
  return {
    top: Math.max(0, rect.top - SPOTLIGHT_PADDING),
    left: Math.max(0, rect.left - SPOTLIGHT_PADDING),
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

function clampTooltip(top: number, left: number, tooltipWidth: number, tooltipHeight: number) {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  return {
    top: Math.min(
      Math.max(VIEWPORT_EDGE, top),
      Math.max(VIEWPORT_EDGE, viewportH - tooltipHeight - VIEWPORT_EDGE)
    ),
    left: Math.min(
      Math.max(VIEWPORT_EDGE, left),
      Math.max(VIEWPORT_EDGE, viewportW - tooltipWidth - VIEWPORT_EDGE)
    ),
  };
}

function floatingTooltipPos(tooltipWidth = 360, tooltipHeight = 260): TooltipPlacement {
  const clamped = clampTooltip(
    window.innerHeight / 2 - tooltipHeight / 2,
    window.innerWidth / 2 - tooltipWidth / 2,
    tooltipWidth,
    tooltipHeight
  );
  return { ...clamped, placement: "center" };
}

function placeTooltip(
  spotlight: SpotlightRect,
  tooltipWidth: number,
  tooltipHeight: number
): TooltipPlacement {
  const gap = 14;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const candidates: Array<TooltipPlacement> = [
    {
      placement: "below",
      top: spotlight.top + spotlight.height + gap,
      left: spotlight.left + Math.max(0, (spotlight.width - tooltipWidth) / 2),
    },
    {
      placement: "right",
      top: spotlight.top,
      left: spotlight.left + spotlight.width + gap,
    },
    {
      placement: "above",
      top: spotlight.top - tooltipHeight - gap,
      left: spotlight.left + Math.max(0, (spotlight.width - tooltipWidth) / 2),
    },
    {
      placement: "left",
      top: spotlight.top,
      left: spotlight.left - tooltipWidth - gap,
    },
  ];

  for (const candidate of candidates) {
    const fitsX =
      candidate.left >= VIEWPORT_EDGE &&
      candidate.left + tooltipWidth <= viewportW - VIEWPORT_EDGE;
    const fitsY =
      candidate.top >= VIEWPORT_EDGE &&
      candidate.top + tooltipHeight <= viewportH - VIEWPORT_EDGE;
    if (fitsX && fitsY) return candidate;
  }

  const preferred = candidates[0];
  const clamped = clampTooltip(preferred.top, preferred.left, tooltipWidth, tooltipHeight);
  return { ...clamped, placement: preferred.placement };
}

export function clearTourState() {
  for (const key of TOUR_FLAG_KEYS) {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
}

export function startProductTour() {
  clearTourState();
  sessionStorage.setItem(TOUR_STORAGE_KEY, "true");
  window.dispatchEvent(new CustomEvent(TOUR_START_EVENT));
}

export const ProductTour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);
  const syncTokenRef = useRef(0);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourRole, setTourRole] = useState<UserRole>(getCurrentUser().role);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPlacement>(() => floatingTooltipPos());
  const [ready, setReady] = useState(false);
  const [hasTarget, setHasTarget] = useState(false);

  const tourSteps = TOUR_STEPS_BY_ROLE[tourRole];
  const totalSteps = tourSteps.length;

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  const endTour = useCallback((markCompleted = false) => {
    sessionStorage.removeItem(TOUR_STORAGE_KEY);
    if (markCompleted) {
      localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    } else {
      localStorage.setItem(TOUR_DISMISSED_KEY, "true");
    }
    syncTokenRef.current += 1;
    setActive(false);
    setReady(false);
    setSpotlight(null);
    setStepIndex(0);
  }, []);

  const beginTour = useCallback(() => {
    const role = getCurrentUser().role;
    const steps = TOUR_STEPS_BY_ROLE[role];
    sessionStorage.setItem(TOUR_STORAGE_KEY, "true");
    localStorage.removeItem(TOUR_DISMISSED_KEY);
    localStorage.removeItem(TOUR_COMPLETED_KEY);
    setTourRole(role);
    setStepIndex(0);
    setActive(true);
    setReady(false);
    setSpotlight(null);
    setTooltipPos(floatingTooltipPos());
    const firstRoute = steps[0]?.route ?? "/dashboard";
    if (pathnameRef.current !== firstRoute) {
      navigate(firstRoute);
    }
  }, [navigate]);

  useEffect(() => {
    const onStart = () => beginTour();
    window.addEventListener(TOUR_START_EVENT, onStart);
    return () => window.removeEventListener(TOUR_START_EVENT, onStart);
  }, [beginTour]);

  useEffect(() => {
    if (location.pathname === "/login") return;
    if (sessionStorage.getItem(TOUR_STORAGE_KEY) === "true" && !active) {
      beginTour();
    }
  }, [location.pathname, active, beginTour]);

  useEffect(() => {
    if (!active) return;

    const step = tourSteps[stepIndex];
    if (!step) return;

    const token = ++syncTokenRef.current;
    let cancelled = false;

    const run = async () => {
      setReady(false);
      setHasTarget(false);
      setTooltipPos(floatingTooltipPos());

      if (pathnameRef.current !== step.route) {
        navigate(step.route);
        await wait(ROUTE_SETTLE_MS);
      } else {
        await wait(40);
      }

      if (cancelled || token !== syncTokenRef.current) return;

      const el = await waitForTarget(`[data-tour="${step.target}"]`);
      if (cancelled || token !== syncTokenRef.current) return;

      // Never hide the tour when the target is missing — show a floating modal.
      if (!el) {
        setSpotlight(null);
        setHasTarget(false);
        setTooltipPos(floatingTooltipPos());
        setReady(true);
        return;
      }

      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      await wait(180);
      await waitForAnimationFrame();
      if (cancelled || token !== syncTokenRef.current) return;

      const nextSpotlight = measureSpotlight(el);
      setSpotlight(nextSpotlight);
      setHasTarget(true);
      setTooltipPos(placeTooltip(nextSpotlight, 360, 260));
      setReady(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [active, stepIndex, navigate, tourSteps]);

  useLayoutEffect(() => {
    if (!active || !ready) return;

    const step = tourSteps[stepIndex];
    if (!step) return;

    const update = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      const tooltipEl = document.querySelector<HTMLElement>("[data-tour-tooltip]");
      const tw = tooltipEl?.offsetWidth ?? 360;
      const th = tooltipEl?.offsetHeight ?? 260;
      if (!el) {
        setSpotlight(null);
        setHasTarget(false);
        setTooltipPos(floatingTooltipPos(tw, th));
        return;
      }
      const nextSpotlight = measureSpotlight(el);
      setSpotlight(nextSpotlight);
      setHasTarget(true);
      setTooltipPos(placeTooltip(nextSpotlight, tw, th));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, ready, stepIndex, tourSteps]);

  const runStepSideEffect = (step: TourStep) => {
    if (step.onNext === "download-passport") {
      const btn = document.querySelector<HTMLElement>(
        `[data-tour="download-passport-btn"]`
      );
      btn?.click();
    }
  };

  const goNext = () => {
    const step = tourSteps[stepIndex];
    if (!step) return;
    runStepSideEffect(step);

    if (stepIndex >= totalSteps - 1) {
      endTour(true);
      return;
    }
    setReady(false);
    setStepIndex((current) => current + 1);
  };

  const goBack = () => {
    if (stepIndex <= 0) return;
    setReady(false);
    setStepIndex((current) => current - 1);
  };

  if (!active) return null;

  const step = tourSteps[stepIndex];
  const stepNumber = stepIndex + 1;
  const nextLabel = step?.nextLabel ?? "Next →";
  const unlocked = step?.access.kind === "unlocked";

  const spotlightStyle: CSSProperties | undefined = spotlight
    ? {
        position: "fixed",
        top: spotlight.top,
        left: spotlight.left,
        width: spotlight.width,
        height: spotlight.height,
        borderRadius: 10,
        boxShadow:
          "0 0 0 9999px rgba(15, 23, 42, 0.65), 0 0 24px rgba(52, 211, 153, 0.55)",
        border: "2px solid rgba(52, 211, 153, 0.95)",
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 9998,
        transition: "top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease",
      }
    : undefined;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9997]" aria-live="polite">
      {spotlight && <div style={spotlightStyle} aria-hidden="true" />}
      {!spotlight && (
        <div className="fixed inset-0 bg-[rgba(15,23,42,0.65)]" aria-hidden="true" />
      )}

      <div
        data-tour-tooltip
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-tour-title"
        className="pointer-events-auto fixed z-[9999] w-[360px] max-w-[calc(100vw-24px)] rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.28)]"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          opacity: ready ? 1 : 0.9,
          transition: "top 0.25s ease, left 0.25s ease, opacity 0.2s ease",
        }}
      >
        {hasTarget && tooltipPos.placement !== "center" && (
          <span
            aria-hidden="true"
            className={`absolute h-3 w-3 rotate-45 border border-[#e5e7eb] bg-white ${
              tooltipPos.placement === "below"
                ? "-top-1.5 left-8 border-b-0 border-r-0"
                : tooltipPos.placement === "above"
                  ? "-bottom-1.5 left-8 border-t-0 border-l-0"
                  : tooltipPos.placement === "right"
                    ? "top-6 -left-1.5 border-b-0 border-l-0"
                    : "top-6 -right-1.5 border-t-0 border-r-0"
            }`}
          />
        )}
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
          Step {stepNumber} of {totalSteps} · {tourRole}
        </div>
        {step && (
          <div
            className={`mb-2 inline-flex max-w-full rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] ${
              unlocked
                ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                : "border-[#e5e7eb] bg-[#f3f4f6] text-[#6b7280]"
            }`}
          >
            {accessPillLabel(step.access)}
          </div>
        )}
        <h2
          id="product-tour-title"
          className="text-[15px] font-semibold leading-5 text-[#111827]"
        >
          {step?.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-5 text-[#4b5563]">{step?.description}</p>
        {step?.extra}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => endTour(false)}
            className="text-[12px] font-medium text-[#6b7280] hover:text-[#111827] cursor-pointer"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className={`rounded-md border px-3 py-1.5 text-[12px] font-semibold cursor-pointer ${
                stepIndex === 0
                  ? "cursor-not-allowed border-[#e5e7eb] text-[#9ca3af]"
                  : "border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-md bg-[#173d35] px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-[#245448] cursor-pointer"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
