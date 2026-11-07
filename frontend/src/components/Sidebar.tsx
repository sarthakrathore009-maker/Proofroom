import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const logoCheck =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";
const workspaceSelector =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m7 15 5 5 5-5'/><path d='m7 9 5-5 5 5'/></svg>";
const dashboardIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='7' x='3' y='3' rx='1'/><rect width='7' height='7' x='14' y='3' rx='1'/><rect width='7' height='7' x='14' y='14' rx='1'/><rect width='7' height='7' x='3' y='14' rx='1'/></svg>";
const reviewsIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>";
const brandVaultIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const protectedIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>";
const chevronDown =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: dashboardIcon },
  { label: "Reviews", path: "/new-review", icon: reviewsIcon },
  { label: "Brand Vault", path: "/brand-vault", icon: brandVaultIcon },
];

const isReviewsRoute = (pathname: string) =>
  ["/new-review", "/reviews", "/workspace", "/approval"].includes(pathname);

export const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <aside className="w-[232px] min-h-screen shrink-0 bg-white border-r border-[#dfe3da] pt-7 pb-6 px-5 flex flex-col justify-between" aria-label="Primary navigation">
      <div className="flex flex-col items-start gap-[34px] self-stretch">
        <div className="inline-flex items-center gap-2.5">
          <div className="w-[29px] h-8 bg-[#173d35] rounded flex items-center justify-center shrink-0">
            <img className="w-5 h-5 object-contain" alt="" aria-hidden="true" src={logoCheck} />
          </div>
          <span className="font-semibold text-[#173d35] text-[22px] tracking-[-0.8px]">proofroom</span>
        </div>

        <div className="relative self-stretch">
          <button
            type="button"
            data-tour="workspace-switcher"
            aria-expanded={workspaceMenuOpen}
            aria-haspopup="menu"
            onClick={() => setWorkspaceMenuOpen((open) => !open)}
            className="flex items-center gap-2.5 p-3 self-stretch w-full rounded-md border border-[#dfe3da] bg-white text-left cursor-pointer"
          >
            <span className="flex w-7 h-7 items-center justify-center rounded bg-[#f6f5ef] text-sm font-semibold text-[#173d35]">a.</span>
            <span className="flex flex-1 flex-col">
              <span className="text-xs font-semibold text-[#252b29]">DemoBrand Co.</span>
              <span className="text-[10px] text-[#707871]">Brand workspace</span>
            </span>
            <img className="w-4 h-4 object-contain" alt="" aria-hidden="true" src={workspaceSelector} />
          </button>
          {workspaceMenuOpen && (
            <div role="menu" className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-[#dfe3da] bg-white p-1 shadow-sm">
              <button type="button" role="menuitem" onClick={() => setWorkspaceMenuOpen(false)} className="w-full rounded px-2 py-1.5 text-left text-[11px] text-[#707871] hover:bg-[#f8f9f6]">
                DemoBrand Co. workspace
              </button>
            </div>
          )}
        </div>

        <nav aria-label="Workspace sections" className="flex flex-col gap-1.5 self-stretch">
          {navigationItems.map((item) => {
            const isActive =
              item.label === "Dashboard"
                ? pathname === "/dashboard"
                : item.label === "Reviews"
                  ? isReviewsRoute(pathname)
                  : pathname === "/brand-vault";
            return (
              <button
                key={item.label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => navigate(item.path)}
                className={`flex h-[43px] items-center gap-3 px-3 self-stretch rounded-md text-left cursor-pointer ${isActive ? "bg-[#dce6de]" : "bg-white hover:bg-[#f8f9f6]"}`}
              >
                <img className="w-[18px] h-[18px] object-contain" alt="" aria-hidden="true" src={item.icon} />
                <span className={`flex-1 text-[13px] leading-[19.5px] ${isActive ? "font-semibold text-[#173d35]" : "text-[#707871]"}`}>{item.label}</span>
                {isActive && <span aria-hidden="true" className="w-1 h-4 bg-[#173d35] rounded-sm" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-5 self-stretch">
        <div className="flex flex-col gap-[7px] p-3 self-stretch bg-[#f8f9f6] rounded-md">
          <div className="flex items-center gap-[7px]">
            <img className="w-4 h-4 object-contain" alt="" aria-hidden="true" src={protectedIcon} />
            <span className="text-[11px] font-semibold text-[#252b29]">Your brand, protected.</span>
          </div>
          <p className="text-[11px] leading-[16.5px] text-[#707871]">Reviews grounded in your approved sources.</p>
        </div>
        <div className="self-stretch h-px bg-[#dfe3da]" />
        <div className="relative self-stretch">
          <button type="button" data-tour="user-profile" aria-expanded={profileMenuOpen} aria-haspopup="menu" onClick={() => setProfileMenuOpen((open) => !open)} className="flex items-center gap-2.5 self-stretch w-full bg-white text-left cursor-pointer">
            <span className="w-8 h-8 bg-[#dce6de] flex items-center justify-center rounded-full text-[11px] font-semibold text-[#173d35]">ML</span>
            <span className="flex flex-1 flex-col">
              <span className="text-xs font-semibold text-[#252b29]">Maya Lewis</span>
              <span className="text-[10px] text-[#707871]">Brand manager</span>
            </span>
            <img className="w-4 h-4 object-contain" alt="" aria-hidden="true" src={chevronDown} />
          </button>
          {profileMenuOpen && (
            <div role="menu" className="absolute bottom-full left-0 right-0 z-10 mb-1 rounded-md border border-[#dfe3da] bg-white p-1 shadow-sm">
              <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }} className="w-full rounded px-2 py-1.5 text-left text-[11px] text-[#707871] hover:bg-[#f8f9f6]">
                My profile
              </button>
              <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate("/login"); }} className="w-full rounded px-2 py-1.5 text-left text-[11px] text-[#707871] hover:bg-[#f8f9f6]">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
