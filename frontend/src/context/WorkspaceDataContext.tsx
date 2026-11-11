import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "../lib/api";

export type DashboardReview = {
  id: string;
  title: string;
  content_type: string;
  version: string;
  creator_name: string;
  creator_initials: string;
  status: string;
  created_at: string;
};

export type DashboardData = {
  reviews: DashboardReview[];
  openIssuesCount: number;
};

export type BrandVaultData = {
  rules: Array<{
    rule_code: string;
    category?: string;
    title: string;
    description?: string;
    version: string;
    approved_by: string;
    status: string;
  }>;
  facts: Array<{
    fact_code: string;
    title: string;
    claim_statement: string;
    description?: string;
    version: string;
    approved_by: string;
    status: string;
  }>;
  assets: Array<{
    asset_code: string;
    title: string;
    description?: string;
    version: string;
    updated_at?: string;
  }>;
};

export type ReviewDetail = {
  review: {
    id: string;
    title: string;
    content_type: string;
    body_text: string;
    submitted_body_text?: string;
    created_at?: string;
    version?: string;
    review_code: string;
    creator_name: string;
  } | null;
  proofCards: Array<{
    id: string;
    severity: "High" | "Medium" | "Low";
    category_title: string;
    issue_explanation: string;
    source_code: string;
    source_rule_summary: string;
    original_excerpt: string;
    suggested_correction: string;
    resolution_status: "Open" | "Accepted" | "Dismissed";
  }>;
  passport?: {
    passport_code: string;
    approved_version: string;
    reviewer_name: string;
    created_at?: string;
    is_valid: boolean;
    evidence_refs: Array<{ title: string; source: string }>;
    resolved_changes: Array<{ title: string; detail: string; code: string }>;
  } | null;
};

type WorkspaceDataContextValue = {
  dashboardData: DashboardData | null;
  brandVaultData: BrandVaultData | null;
  reviewsList: DashboardReview[];
  reviewDetailsById: Record<string, ReviewDetail>;
  latestReviewDetail: ReviewDetail | null;
  isInitialLoaded: boolean;
  isRefreshing: boolean;
  ensureInitialLoad: () => Promise<void>;
  refreshWorkspaceAfterActivity: () => Promise<void>;
  getReviewDetail: (id?: string | null) => Promise<ReviewDetail | null>;
  putReviewDetail: (detail: ReviewDetail) => void;
  clearWorkspaceCache: () => void;
};

const WorkspaceDataContext = createContext<WorkspaceDataContextValue | null>(null);

const LATEST_KEY = "__latest__";

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [brandVaultData, setBrandVaultData] = useState<BrandVaultData | null>(null);
  const [reviewDetailsById, setReviewDetailsById] = useState<Record<string, ReviewDetail>>({});
  const [latestReviewDetail, setLatestReviewDetail] = useState<ReviewDetail | null>(null);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPromiseRef = useRef<Promise<void> | null>(null);
  const reviewFetchRefs = useRef<Record<string, Promise<ReviewDetail | null>>>({});

  const putReviewDetail = useCallback((detail: ReviewDetail) => {
    if (!detail.review?.id) {
      setLatestReviewDetail(detail);
      return;
    }
    const id = detail.review.id;
    setReviewDetailsById((prev) => ({ ...prev, [id]: detail }));
    setLatestReviewDetail(detail);
  }, []);

  const fetchCoreWorkspace = useCallback(async () => {
    const [dashboard, brandVault, latest] = await Promise.all([
      apiRequest<DashboardData>("/api/dashboard", { method: "GET" }),
      apiRequest<BrandVaultData>("/api/brand-vault", { method: "GET" }),
      apiRequest<ReviewDetail>("/api/reviews/latest", { method: "GET" }).catch(() => null),
    ]);

    setDashboardData(dashboard);
    setBrandVaultData(brandVault);

    if (latest?.review?.id) {
      setLatestReviewDetail(latest);
      setReviewDetailsById((prev) => ({ ...prev, [latest.review!.id]: latest }));
    } else if (latest) {
      setLatestReviewDetail(latest);
    }
  }, []);

  const ensureInitialLoad = useCallback(async () => {
    if (isInitialLoaded) return;
    if (loadPromiseRef.current) {
      await loadPromiseRef.current;
      return;
    }

    loadPromiseRef.current = (async () => {
      try {
        await fetchCoreWorkspace();
        setIsInitialLoaded(true);
      } catch (error) {
        console.error("Unable to preload workspace data", error);
        // Mark loaded so pages can fall back without spinning forever.
        setIsInitialLoaded(true);
      } finally {
        loadPromiseRef.current = null;
      }
    })();

    await loadPromiseRef.current;
  }, [fetchCoreWorkspace, isInitialLoaded]);

  const refreshWorkspaceAfterActivity = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchCoreWorkspace();
      setIsInitialLoaded(true);

      // Refresh any already-cached review detail pages so they stay fresh.
      const ids = Object.keys(reviewDetailsById);
      if (ids.length > 0) {
        const refreshed = await Promise.all(
          ids.map(async (id) => {
            try {
              const detail = await apiRequest<ReviewDetail>(
                `/api/reviews/${encodeURIComponent(id)}`,
                { method: "GET" }
              );
              return [id, detail] as const;
            } catch {
              return null;
            }
          })
        );
        setReviewDetailsById((prev) => {
          const next = { ...prev };
          for (const entry of refreshed) {
            if (entry) next[entry[0]] = entry[1];
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Unable to refresh workspace after activity", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchCoreWorkspace, reviewDetailsById]);

  const getReviewDetail = useCallback(
    async (id?: string | null): Promise<ReviewDetail | null> => {
      const cacheKey = id || LATEST_KEY;

      if (id && reviewDetailsById[id]) {
        return reviewDetailsById[id];
      }
      if (!id && latestReviewDetail) {
        return latestReviewDetail;
      }

      if (reviewFetchRefs.current[cacheKey]) {
        return reviewFetchRefs.current[cacheKey];
      }

      const path = id
        ? `/api/reviews/${encodeURIComponent(id)}`
        : "/api/reviews/latest";

      reviewFetchRefs.current[cacheKey] = apiRequest<ReviewDetail>(path, { method: "GET" })
        .then((detail) => {
          putReviewDetail(detail);
          return detail;
        })
        .catch((error) => {
          console.error("Unable to load review detail", error);
          return null;
        })
        .finally(() => {
          delete reviewFetchRefs.current[cacheKey];
        });

      return reviewFetchRefs.current[cacheKey];
    },
    [latestReviewDetail, putReviewDetail, reviewDetailsById]
  );

  const clearWorkspaceCache = useCallback(() => {
    setDashboardData(null);
    setBrandVaultData(null);
    setReviewDetailsById({});
    setLatestReviewDetail(null);
    setIsInitialLoaded(false);
    setIsRefreshing(false);
    loadPromiseRef.current = null;
    reviewFetchRefs.current = {};
  }, []);

  const value = useMemo<WorkspaceDataContextValue>(
    () => ({
      dashboardData,
      brandVaultData,
      reviewsList: dashboardData?.reviews ?? [],
      reviewDetailsById,
      latestReviewDetail,
      isInitialLoaded,
      isRefreshing,
      ensureInitialLoad,
      refreshWorkspaceAfterActivity,
      getReviewDetail,
      putReviewDetail,
      clearWorkspaceCache,
    }),
    [
      brandVaultData,
      clearWorkspaceCache,
      dashboardData,
      ensureInitialLoad,
      getReviewDetail,
      isInitialLoaded,
      isRefreshing,
      latestReviewDetail,
      putReviewDetail,
      refreshWorkspaceAfterActivity,
      reviewDetailsById,
    ]
  );

  return (
    <WorkspaceDataContext.Provider value={value}>{children}</WorkspaceDataContext.Provider>
  );
}

export function useWorkspaceData() {
  const ctx = useContext(WorkspaceDataContext);
  if (!ctx) {
    throw new Error("useWorkspaceData must be used within WorkspaceDataProvider");
  }
  return ctx;
}
