import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWorkspaceData } from "../context/WorkspaceDataContext";
import { ACTIVE_ROLE_KEY, USER_KEY } from "../lib/roles";

const PUBLIC_PATHS = new Set(["/login", "/forgot-password", "/"]);

/**
 * Preloads dashboard + brand vault + latest review once after login / hard refresh.
 * Does nothing on public auth routes.
 */
export function WorkspaceBootstrap() {
  const location = useLocation();
  const { ensureInitialLoad, clearWorkspaceCache, isInitialLoaded } = useWorkspaceData();

  useEffect(() => {
    if (PUBLIC_PATHS.has(location.pathname)) {
      if (location.pathname === "/login") {
        // Keep cache until a successful role login reloads it intentionally.
      }
      return;
    }

    const hasSession =
      Boolean(localStorage.getItem(USER_KEY)) || Boolean(localStorage.getItem(ACTIVE_ROLE_KEY));
    if (!hasSession) return;

    if (!isInitialLoaded) {
      void ensureInitialLoad();
    }
  }, [ensureInitialLoad, isInitialLoaded, location.pathname]);

  // Expose clear for logout callers via custom event.
  useEffect(() => {
    const onClear = () => clearWorkspaceCache();
    window.addEventListener("proofroom:clear-workspace-cache", onClear);
    return () => window.removeEventListener("proofroom:clear-workspace-cache", onClear);
  }, [clearWorkspaceCache]);

  return null;
}

export function clearWorkspaceCacheEvent() {
  window.dispatchEvent(new CustomEvent("proofroom:clear-workspace-cache"));
}
