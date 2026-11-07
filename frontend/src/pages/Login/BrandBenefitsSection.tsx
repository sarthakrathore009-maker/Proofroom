// Screenshot ke exact icons (Open book, Document, Shield-check, aur Top Checkmark)
const vector =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b49a63' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const image =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b49a63' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>";
const vector2 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b49a63' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>";
const vector6 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b8cec3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";

type Benefit = {
  icon: string;
  iconClassName: string;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: vector,
    iconClassName: "absolute w-[94.30%] h-[90.13%] top-[9.87%] left-[5.70%]",
    title: "One source of brand truth",
    description: "Approved guidelines, facts and language.",
  },
  {
    icon: image,
    iconClassName: "absolute w-[85.96%] h-[94.30%] top-[5.70%] left-[14.04%]",
    title: "Evidence behind every decision",
    description: "Find issues. Resolve them with confidence.",
  },
  {
    icon: vector2,
    iconClassName: "absolute w-[85.96%] h-[94.30%] top-[5.70%] left-[14.04%]",
    title: "A record you can stand behind",
    description: "Every approval, captured in a Release Passport.",
  },
];

export const BrandBenefitsSection = () => {
  return (
    <section
      aria-labelledby="brand-benefits-heading"
      className="flex flex-col w-[612px] items-start justify-between p-14 relative self-stretch bg-[#173d35]"
    >
      <header className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
        <div
          aria-hidden="true"
          className="flex w-[29px] h-8 items-center justify-center relative bg-[#173d35] rounded overflow-hidden"
        >
          <div className="relative w-5 h-5">
            <img
              className="absolute w-[85.83%] h-[77.50%] top-[22.50%] left-[14.17%]"
              src={vector6}
              alt=""
            />
          </div>
        </div>
        <div className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[22px] tracking-[-0.80px] leading-[normal]">
          
        </div>
      </header>
      <main className="flex flex-col items-start gap-7 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#b49a63] text-[11px] tracking-[2.00px] leading-[normal] whitespace-nowrap">
          AI BRAND GOVERNANCE
        </div>
        <h1
          id="brand-benefits-heading"
          className="relative self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[46px] tracking-[-1.80px] leading-[53.4px]"
        >
          Every word.
          <br />
          On brand.
          <br />
          Backed by proof.
        </h1>
        <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#b8cec3] text-base leading-6 relative tracking-[0]">
          A clear path from first draft to confident approval. Keep your claims
          honest and your brand consistent.
        </p>
        <div aria-hidden="true" className="relative w-12 h-0.5 bg-[#b49a63]" />
        <ul className="flex flex-col items-start gap-[18px] relative self-stretch w-full flex-[0_0_auto] list-none p-0 m-0">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="gap-[15px] self-stretch w-full flex-[0_0_auto] flex items-start relative"
            >
              <div
                aria-hidden="true"
                className="relative w-[19px] h-[19px] shrink-0"
              >
                <img
                  className={benefit.iconClassName}
                  src={benefit.icon}
                  alt=""
                />
              </div>
              <div className="flex-col gap-[3px] flex-1 grow flex items-start relative">
                <h2 className="self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm leading-[21px] relative tracking-[0]">
                  {benefit.title}
                </h2>
                <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#b8cec3] text-xs leading-[18px] relative tracking-[0]">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#b8cec3] text-[11px] leading-[16.5px] relative tracking-[0]">
        Clarity before content leaves the room.
      </footer>
    </section>
  );
};