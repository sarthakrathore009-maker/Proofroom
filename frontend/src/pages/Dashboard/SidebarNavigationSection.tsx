import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Screenshot ke exact Sidebar SVG icons
const vector =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";
const image =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m7 15 5 5 5-5'/><path d='m7 9 5-5 5 5'/></svg>";
const vector2 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='7' height='7' x='3' y='3' rx='1'/><rect width='7' height='7' x='14' y='3' rx='1'/><rect width='7' height='7' x='14' y='14' rx='1'/><rect width='7' height='7' x='3' y='14' rx='1'/></svg>";
const vector3 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>";
const vector4 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const vector5 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>";
const vector6 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>";

type NavigationItem = {
  label: string;
  icon: string;
  path: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: vector2,
    path: "/dashboard",
  },
  {
    label: "Reviews",
    icon: vector3,
    path: "/reviews",
  },
  {
    label: "Brand Vault",
    icon: vector4,
    path: "/brand-vault",
  },
];

export const SidebarNavigationSection = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      aria-label="Primary navigation"
      className="flex flex-col w-[232px] min-h-[1000px] items-start justify-between pt-7 pb-6 px-5 relative self-stretch bg-white border-r [border-right-style:solid] border-[#dfe3da]"
    >
      <div className="flex flex-col items-start gap-[34px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
          <div
            aria-hidden="true"
            className="flex w-[29px] h-8 items-center justify-center relative bg-[#173d35] rounded overflow-hidden"
          >
            <div className="relative w-5 h-5">
              <img
                className="absolute w-[85.83%] h-[77.50%] top-[22.50%] left-[14.17%]"
                alt=""
                src={vector}
              />
            </div>
          </div>
          <div className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-[22px] tracking-[-0.80px] leading-[normal]">
            proofroom
          </div>
        </div>
        <div className="relative self-stretch w-full">
          <button
            type="button"
            aria-expanded={workspaceMenuOpen}
            aria-haspopup="menu"
            onClick={() => setWorkspaceMenuOpen((isOpen) => !isOpen)}
            className="flex items-center gap-2.5 p-3 relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden border border-solid border-[#dfe3da] bg-white text-left cursor-pointer"
          >
            <div
              aria-hidden="true"
              className="flex w-7 h-7 items-center justify-center relative bg-[#f6f5ef] rounded overflow-hidden"
            >
              <div className="w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-sm leading-[21px] whitespace-nowrap relative tracking-[0]">
                a.
              </div>
            </div>
            <div className="flex flex-col items-start relative flex-1 grow">
              <div className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                Aster
              </div>
              <div className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] relative tracking-[0]">
                Brand workspace
              </div>
            </div>
            <div aria-hidden="true" className="relative w-[13px] h-[13px]">
              <img
                className="absolute w-[74.68%] h-[88.77%] top-[11.23%] left-[25.32%]"
                alt=""
                src={image}
              />
            </div>
          </button>
          {workspaceMenuOpen && (
            <div
              role="menu"
              className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-[#dfe3da] bg-white p-1 shadow-sm"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => setWorkspaceMenuOpen(false)}
                className="w-full rounded px-2 py-1.5 text-left [font-family:'Inter-Regular',Helvetica] text-[11px] leading-[16.5px] text-[#707871] hover:bg-[#f8f9f6]"
              >
                Aster workspace
              </button>
            </div>
          )}
        </div>
        <nav
          aria-label="Workspace sections"
          className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]"
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
                className={`flex h-[43px] items-center gap-3 px-3 py-0 relative self-stretch w-full rounded-md overflow-hidden text-left cursor-pointer ${
                  isActive ? "bg-[#dce6de]" : "bg-white"
                }`}
              >
                <span className="relative w-[18px] h-[18px]" aria-hidden="true">
                  <img
                    className={
                      item.label === "Dashboard"
                        ? "absolute w-[90.28%] h-[90.28%] top-[9.72%] left-[9.72%]"
                        : item.label === "Reviews"
                          ? "absolute w-[86.11%] h-[94.45%] top-[5.55%] left-[13.89%]"
                          : "absolute w-[94.45%] h-[90.28%] top-[9.72%] left-[5.55%]"
                    }
                    alt=""
                    src={item.icon}
                  />
                </span>
                <span
                  className={`flex-1 [font-family:'Inter-${
                    isActive ? "SemiBold" : "Regular"
                  }',Helvetica] font-${
                    isActive ? "semibold" : "normal"
                  } text-[13px] leading-[19.5px] relative tracking-[0] ${
                    isActive ? "text-[#173d35]" : "text-[#707871]"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="relative w-1 h-4 bg-[#173d35] rounded-sm"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col items-start gap-5 self-stretch w-full relative flex-[0_0_auto]">
        <div className="flex flex-col items-start gap-[7px] p-3 relative self-stretch w-full flex-[0_0_auto] bg-[#f8f9f6] rounded-md overflow-hidden">
          <div className="flex items-center gap-[7px] self-stretch w-full relative flex-[0_0_auto]">
            <div className="relative w-[15px] h-[15px]" aria-hidden="true">
              <img
                className="absolute w-[86.66%] h-[95.00%] top-[5.00%] left-[13.34%]"
                alt=""
                src={vector5}
              />
            </div>
            <div className="flex-1 mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-[11px] leading-[16.5px] relative tracking-[0]">
              Your brand, protected.
            </div>
          </div>
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
            Reviews grounded in your approved sources.
          </p>
        </div>
        <div className="self-stretch w-full h-px relative bg-[#dfe3da]" />
        <div className="relative self-stretch w-full">
          <button
            type="button"
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
            className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto] bg-white text-left cursor-pointer"
          >
            <div
              aria-hidden="true"
              className="w-8 h-8 bg-[#dce6de] flex items-center justify-center relative rounded-[100px] overflow-hidden"
            >
              <div className="w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
                ML
              </div>
            </div>
            <div className="flex flex-col items-start relative flex-1 grow">
              <div className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                Maya Lewis
              </div>
              <div className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] relative tracking-[0]">
                Brand manager
              </div>
            </div>
            <div aria-hidden="true" className="relative w-3.5 h-3.5">
              <img
                className="absolute w-[78.57%] h-[66.07%] top-[33.93%] left-[21.43%]"
                alt=""
                src={vector6}
              />
            </div>
          </button>
          {profileMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-full left-0 right-0 z-10 mb-1 rounded-md border border-[#dfe3da] bg-white p-1 shadow-sm"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full rounded px-2 py-1.5 text-left [font-family:'Inter-Regular',Helvetica] text-[11px] leading-[16.5px] text-[#707871] hover:bg-[#f8f9f6]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};