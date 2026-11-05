import { useState } from "react";
import { useNavigate } from "react-router-dom";

const vectorCheck =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";
const vectorDropdown =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m7 15 5 5 5-5'/><path d='m7 9 5-5 5 5'/></svg>";
const vectorGrid =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='7' x='3' y='3' rx='1'/><rect width='7' height='7' x='14' y='3' rx='1'/><rect width='7' height='7' x='14' y='14' rx='1'/><rect width='7' height='7' x='3' y='14' rx='1'/></svg>";
const vectorFileActive =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>";
const vectorVault =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const vectorShield =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>";
const vectorProfileArrow =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>";

export const WorkspaceNavigationSection = () => {
  const [activeItem, setActiveItem] = useState("Reviews");
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Dashboard", icon: vectorGrid, path: "/dashboard" },
    { label: "Reviews", icon: vectorFileActive, path: "/new-review" },
    { label: "Brand Vault", icon: vectorVault, path: "/brand-vault" },
  ];

  return (
    <aside className="flex min-h-[1000px] w-[232px] shrink-0 flex-col items-start justify-between self-stretch border-r border-[#dfe3da] bg-white px-5 pb-6 pt-7">
      <div className="flex w-full flex-col items-start gap-[34px]">
        <div className="inline-flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="flex h-8 w-[29px] items-center justify-center overflow-hidden rounded bg-[#173d35]"
          >
            <div className="relative h-5 w-5">
              <img
                className="w-full h-full"
                src={vectorCheck}
                alt=""
              />
            </div>
          </div>
          <div className="[font-family:'Inter-SemiBold',Helvetica] text-[22px] font-semibold leading-[normal] tracking-[-0.80px] text-[#173d35]">
            proofroom
          </div>
        </div>
        <div className="relative w-full">
          <button
            type="button"
            aria-expanded={isWorkspaceMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsWorkspaceMenuOpen((open) => !open)}
            className="flex w-full items-center gap-2.5 rounded-md border border-solid border-[#dfe3da] p-3 text-left cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-[#f6f5ef] [font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-[21px] text-[#173d35]"
            >
              a.
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-start">
              <span className="mt-[-1px] self-stretch [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold leading-[18px] text-[#252b29]">
                Aster
              </span>
              <span className="self-stretch [font-family:'Inter-Regular',Helvetica] text-[10px] font-normal leading-[15px] text-[#707871]">
                Brand workspace
              </span>
            </span>
            <span aria-hidden="true" className="relative h-[13px] w-[13px]">
              <img
                className="w-full h-full"
                src={vectorDropdown}
                alt=""
              />
            </span>
          </button>
        </div>
        <nav
          aria-label="Workspace navigation"
          className="flex w-full flex-col items-start gap-1.5"
        >
          {navigationItems.map((item) => {
            const isActive = activeItem === item.label;

            return (
              <button
                key={item.label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  setActiveItem(item.label);
                  navigate(item.path);
                }}
                className={`flex h-[43px] w-full items-center gap-3 overflow-hidden rounded-md px-3 py-0 text-left cursor-pointer ${
                  isActive ? "bg-[#dce6de]" : "bg-white"
                }`}
              >
                <span className="relative h-[18px] w-[18px] shrink-0">
                  <img
                    className="w-full h-full"
                    src={item.icon}
                    alt=""
                  />
                </span>
                <span
                  className={`flex-1 [font-family:'Inter-${
                    isActive ? "SemiBold" : "Regular"
                  }',Helvetica] text-[13px] font-${
                    isActive ? "semibold" : "normal"
                  } leading-[19.5px] ${
                    isActive ? "text-[#173d35]" : "text-[#707871]"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="relative h-4 w-1 rounded-sm bg-[#173d35]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex w-full flex-col items-start gap-5">
        <div className="flex w-full flex-col items-start gap-[7px] overflow-hidden rounded-md bg-[#f8f9f6] p-3">
          <div className="flex w-full items-center gap-[7px]">
            <span aria-hidden="true" className="relative h-[15px] w-[15px]">
              <img
                className="w-full h-full"
                src={vectorShield}
                alt=""
              />
            </span>
            <div className="mt-[-1px] flex-1 [font-family:'Inter-SemiBold',Helvetica] text-[11px] font-semibold leading-[16.5px] text-[#252b29]">
              Your brand, protected.
            </div>
          </div>
          <p className="w-full [font-family:'Inter-Regular',Helvetica] text-[11px] font-normal leading-[16.5px] text-[#707871]">
            Reviews grounded in your approved sources.
          </p>
        </div>
        <div aria-hidden="true" className="h-px w-full bg-[#dfe3da]" />
        <div className="relative w-full">
          <button
            type="button"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            className="flex w-full items-center gap-2.5 text-left cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[100px] bg-[#dce6de] [font-family:'Inter-SemiBold',Helvetica] text-[11px] font-semibold leading-[16.5px] text-[#173d35]"
            >
              ML
            </span>
            <span className="flex min-w-0 flex-1 flex-col items-start">
              <span className="mt-[-1px] self-stretch [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold leading-[18px] text-[#252b29]">
                Maya Lewis
              </span>
              <span className="self-stretch [font-family:'Inter-Regular',Helvetica] text-[10px] font-normal leading-[15px] text-[#707871]">
                Brand manager
              </span>
            </span>
            <span aria-hidden="true" className="relative h-3.5 w-3.5">
              <img
                className="w-full h-full"
                src={vectorProfileArrow}
                alt=""
              />
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};