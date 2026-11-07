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

/** Replace this URL with your hosted sample brand poster when ready. */
export const SAMPLE_TEST_IMAGE_URL =
  "https://example.com/sample-brand-poster.png";

export const TOUR_STORAGE_KEY = "proofroom_tour_active";
export const TOUR_START_EVENT = "proofroom:start-tour";

const ROUTE_SETTLE_MS = 350;
const SPOTLIGHT_PADDING = 8;
const TOTAL_STEPS = 15;

type TourStep = {
  target: string;
  route: string;
  title: string;
  description: string;
  nextLabel?: string;
  /** Fired when leaving this step via Next (before advancing). */
  onNext?: "download-passport";
  extra?: ReactNode;
};

const tourSteps: TourStep[] = [
  {
    target: "workspace-switcher",
    route: "/dashboard",
    title: "Brand Workspace",
    description:
      "Your active brand environment. All reviews and compliance rules are scoped to DemoBrand Co.",
  },
  {
    target: "user-profile",
    route: "/dashboard",
    title: "Reviewer Profile",
    description:
      "You are logged in as a Brand Manager with permissions to review drafts and issue approvals.",
  },
  {
    target: "recent-reviews",
    route: "/dashboard",
    title: "Recent Reviews",
    description:
      "Track all verified Approved content alongside drafts currently In review in one place.",
  },
  {
    target: "in-review-arrow",
    route: "/dashboard",
    title: "Open Active Review",
    description:
      "Click this arrow (↗) on an In review item to open and inspect the draft.",
  },
  {
    target: "file-upload-section",
    route: "/new-review",
    title: "Edit or Upload Content",
    description:
      "Type or edit your draft directly, or upload a PDF, DOCX, TXT, PNG, or JPG file for instant extraction.",
    extra: (
      <p className="mt-2 text-[13px] leading-5 text-[#374151]">
        <a
          href={SAMPLE_TEST_IMAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium text-emerald-700"
        >
          Download sample test image here
        </a>{" "}
        to test the file upload.
      </p>
    ),
  },
  {
    target: "review-content-btn",
    route: "/new-review",
    title: "Run AI Compliance Check",
    description:
      "Click Review Content to scan your draft against DemoBrand Co.'s approved Brand Vault.",
  },
  {
    target: "submitted-content",
    route: "/workspace",
    title: "Submitted Content",
    description:
      "Your draft is displayed here with real-time inline highlights showing exact compliance findings.",
  },
  {
    target: "severity-badges",
    route: "/workspace",
    title: "Severity Indicators",
    description:
      "Red highlights critical unsupported claims; Amber highlights terminology or tone adjustments.",
  },
  {
    target: "proof-cards",
    route: "/workspace",
    title: "AI Proof Cards",
    description:
      "Each Proof Card shows the violated Brand Vault rule and lets you apply a 1-click suggested fix.",
  },
  {
    target: "submit-approval-btn",
    route: "/workspace",
    title: "Submit for Approval",
    description:
      "Once all findings are resolved, click here to finalize the review and generate its Release Passport.",
  },
  {
    target: "reviewed-to-final",
    route: "/approval",
    title: "Reviewed to Final & What Changed",
    description:
      "Compare the original Submitted draft against the Approved Final copy, with a complete log of every change made.",
  },
  {
    target: "release-passport-card",
    route: "/approval",
    title: "Official Release Passport",
    description:
      "This tamper-proof compliance record logs the Passport ID, Reviewer, timestamp, and cited Brand Vault sources.",
  },
  {
    target: "download-passport-btn",
    route: "/approval",
    title: "Download PDF Certificate",
    description:
      "Click Download Passport to export a clean PDF compliance certificate for your audit records.",
    onNext: "download-passport",
  },
  {
    target: "brand-vault-grid",
    route: "/brand-vault",
    title: "Brand Vault — Source of Truth",
    description:
      "All approved Brand Guidelines, Facts & Claims, Terminology, and Assets live here and power every AI review.",
  },
  {
    target: "add-entry-btn",
    route: "/brand-vault",
    title: "Add New Rules & Facts",
    description:
      "Click + Add entry anytime to add new guidelines, terminology, or verified facts into the live AI engine.",
    nextLabel: "Finish Tour ✓",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TooltipPlacement = {
  top: number;
  left: number;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function waitForTarget(selector: string, attempts = 20): Promise<HTMLElement | null> {
  for (let i = 0; i < attempts; i += 1) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(100);
  }
  return null;
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

function placeTooltip(
  spotlight: SpotlightRect,
  tooltipWidth: number,
  tooltipHeight: number
): TooltipPlacement {
  const gap = 14;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const candidates: TooltipPlacement[] = [
    // Prefer right
    {
      top: spotlight.top,
      left: spotlight.left + spotlight.width + gap,
    },
    // Below
    {
      top: spotlight.top + spotlight.height + gap,
      left: spotlight.left,
    },
    // Left
    {
      top: spotlight.top,
      left: spotlight.left - tooltipWidth - gap,
    },
    // Above
    {
      top: spotlight.top - tooltipHeight - gap,
      left: spotlight.left,
    },
  ];

  for (const candidate of candidates) {
    const fitsX =
      candidate.left >= 12 && candidate.left + tooltipWidth <= viewportW - 12;
    const fitsY =
      candidate.top >= 12 && candidate.top + tooltipHeight <= viewportH - 12;
    if (fitsX && fitsY) return candidate;
  }

  return {
    top: Math.min(
      Math.max(12, spotlight.top),
      Math.max(12, viewportH - tooltipHeight - 12)
    ),
    left: Math.min(
      Math.max(12, spotlight.left + spotlight.width + gap),
      Math.max(12, viewportW - tooltipWidth - 12)
    ),
  };
}

export function startProductTour() {
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
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPlacement>({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  const endTour = useCallback(() => {
    sessionStorage.removeItem(TOUR_STORAGE_KEY);
    syncTokenRef.current += 1;
    setActive(false);
    setReady(false);
    setSpotlight(null);
    setStepIndex(0);
  }, []);

  const beginTour = useCallback(() => {
    sessionStorage.setItem(TOUR_STORAGE_KEY, "true");
    setStepIndex(0);
    setActive(true);
    setReady(false);
    setSpotlight(null);
    if (pathnameRef.current !== "/dashboard") {
      navigate("/dashboard");
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
      setActive(true);
      setStepIndex(0);
    }
  }, [location.pathname, active]);

  useEffect(() => {
    if (!active) return;

    const step = tourSteps[stepIndex];
    if (!step) return;

    const token = ++syncTokenRef.current;
    let cancelled = false;

    const run = async () => {
      setReady(false);

      if (pathnameRef.current !== step.route) {
        navigate(step.route);
        await wait(ROUTE_SETTLE_MS);
      } else {
        await wait(40);
      }

      if (cancelled || token !== syncTokenRef.current) return;

      const el = await waitForTarget(`[data-tour="${step.target}"]`);
      if (cancelled || token !== syncTokenRef.current) return;

      if (!el) {
        setSpotlight(null);
        setReady(true);
        return;
      }

      el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      await wait(120);
      if (cancelled || token !== syncTokenRef.current) return;

      const nextSpotlight = measureSpotlight(el);
      setSpotlight(nextSpotlight);
      setTooltipPos(placeTooltip(nextSpotlight, 360, 220));
      setReady(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [active, stepIndex, navigate]);

  useLayoutEffect(() => {
    if (!active || !ready) return;

    const step = tourSteps[stepIndex];
    if (!step) return;

    const update = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (!el) return;
      const nextSpotlight = measureSpotlight(el);
      setSpotlight(nextSpotlight);
      const tooltipEl = document.querySelector<HTMLElement>("[data-tour-tooltip]");
      const tw = tooltipEl?.offsetWidth ?? 360;
      const th = tooltipEl?.offsetHeight ?? 220;
      setTooltipPos(placeTooltip(nextSpotlight, tw, th));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, ready, stepIndex]);

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

    if (stepIndex >= TOTAL_STEPS - 1) {
      endTour();
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
        <div
          className="fixed inset-0 bg-[rgba(15,23,42,0.65)]"
          aria-hidden="true"
        />
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
          opacity: ready ? 1 : 0.55,
          transition: "top 0.25s ease, left 0.25s ease, opacity 0.2s ease",
        }}
      >
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
          Step {stepNumber} of {TOTAL_STEPS}
        </div>
        <h2
          id="product-tour-title"
          className="text-[15px] font-semibold leading-5 text-[#111827]"
        >
          {step?.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-5 text-[#4b5563]">
          {step?.description}
        </p>
        {step?.extra}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={endTour}
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
