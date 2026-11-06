import { useNavigate } from "react-router-dom";

const checkIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg>";
const helpIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/><line x1='12' y1='17' x2='12.01' y2='17'/></svg>";
const notificationIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>";

export const TopHeader = ({ breadcrumb }: { breadcrumb: string }) => {
  const navigate = useNavigate();

  return (
    <header className="h-[72px] w-full bg-white border-b border-[#dfe3da] px-10 flex items-center justify-between shrink-0">
      <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2.5 text-xs">
        <button type="button" onClick={() => navigate("/dashboard")} className="text-[#707871] cursor-pointer hover:underline">Aster</button>
        <span aria-hidden="true" className="text-[#a2a8a1]">/</span>
        <span aria-current="page" className="font-medium text-[#252b29]">{breadcrumb}</span>
      </nav>
      <div className="inline-flex items-center gap-6">
        <div className="inline-flex items-center gap-[7px]">
          <img className="w-3.5 h-3.5 object-contain" alt="" aria-hidden="true" src={checkIcon} />
          <span className="text-[11px] leading-[16.5px] text-[#707871]">Brand Vault up to date</span>
        </div>
        <span aria-hidden="true" className="w-px h-5 bg-[#dfe3da]" />
        <button type="button" aria-label="Help" className="w-[18px] h-[18px] cursor-pointer">
          <img className="w-[18px] h-[18px] object-contain" alt="" aria-hidden="true" src={helpIcon} />
        </button>
        <button type="button" aria-label="Notifications" className="w-[18px] h-[18px] cursor-pointer">
          <img className="w-[18px] h-[18px] object-contain" alt="" aria-hidden="true" src={notificationIcon} />
        </button>
      </div>
    </header>
  );
};
