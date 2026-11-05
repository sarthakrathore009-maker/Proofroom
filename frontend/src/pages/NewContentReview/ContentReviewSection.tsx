import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Icons from screenshot
const iconCheckGreen =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";
const iconBreadcrumbArrow =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>";
const iconUpload =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='17 8 12 3 7 8'/><line x1='12' y1='3' x2='12' y2='15'/></svg>";
const iconArrowRight =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>";
const iconInfo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b49a63' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='12' y1='16' x2='12' y2='12'/><line x1='12' y1='8' x2='12.01' y2='8'/></svg>";
const vectorVaultCheck =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='m9 12 2 2 4-4'/></svg>";
const vectorHelp =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/><line x1='12' y1='17' x2='12.01' y2='17'/></svg>";
const vectorBell =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>";

const contentTypes = [
  { label: "Email campaign", hasCheck: true },
  { label: "Website copy", hasCheck: false },
  { label: "Social post", hasCheck: false },
  { label: "Other", hasCheck: false },
];

const brandKnowledgeItems = [
  { label: "Facts and claims" },
  { label: "Approved terminology" },
  { label: "Brand voice and tone" },
];

const initialContent =
  "Meet a simpler way to clean. Our bottles are made with 100% recycled plastic. Just add water to our eco pods and refill your Aster bottle. It's a planet-saving miracle for your home. Discover the everyday refill ritual.";

export const ContentReviewSection = () => {
  const [title, setTitle] = useState("A simpler clean — launch email");
  const [content, setContent] = useState(initialContent);
  const [selectedType, setSelectedType] = useState("Email campaign");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const wordCount = useMemo(() => {
    const trimmedContent = content.trim();
    return trimmedContent ? trimmedContent.split(/\s+/).length : 0;
  }, [content]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleReviewContent = (event: FormEvent) => {
    event.preventDefault();
    navigate("/workspace");
  };

  return (
    <main className="flex flex-col items-start relative flex-1 grow">
      <header className="flex h-[72px] items-center justify-between px-10 py-0 relative self-stretch w-full bg-white border-b [border-bottom-style:solid] border-[#dfe3da]">
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
        >
          <span className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]">
            Aster
          </span>
          <span
            aria-hidden="true"
            className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#a2a8a1] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]"
          >
            /
          </span>
          <span className="w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#252b29] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]">
            Reviews / New review
          </span>
        </nav>
        <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-[7px] relative flex-[0_0_auto]">
            <div className="relative w-3.5 h-3.5">
              <img
                className="absolute w-[95.24%] h-[95.24%] top-[4.76%] left-[4.76%]"
                alt=""
                aria-hidden="true"
                src={vectorVaultCheck}
              />
            </div>
            <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
              Brand Vault up to date
            </p>
          </div>
          <div aria-hidden="true" className="relative w-px h-5 bg-[#dfe3da]" />
          <button
            type="button"
            aria-label="Help"
            className="relative w-[18px] h-[18px] cursor-pointer"
          >
            <img
              className="absolute w-[94.45%] h-[94.45%] top-[5.55%] left-[5.55%]"
              alt=""
              aria-hidden="true"
              src={vectorHelp}
            />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-[18px] h-[18px] cursor-pointer"
          >
            <img
              className="absolute w-[90.28%] h-[94.45%] top-[5.55%] left-[9.72%]"
              alt=""
              aria-hidden="true"
              src={vectorBell}
            />
          </button>
        </div>
      </header>

      <div className="gap-7 pt-[34px] pb-9 px-10 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <section
          aria-labelledby="review-heading"
          className="gap-2.5 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
        >
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[1.40px] leading-[normal] whitespace-nowrap">
            START WITH YOUR DRAFT
          </div>
          <div className="flex items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
            <h1
              id="review-heading"
              className="relative flex-1 mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-3xl tracking-[-1.00px] leading-[normal]"
            >
              New Content Review
            </h1>
          </div>
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-sm leading-[21px] relative tracking-[0]">
            Add your content. We&apos;ll check it against Aster&apos;s approved brand knowledge.
          </p>
        </section>

        {/* Multi-step progress bar */}
        <ol
          aria-label="Review progress"
          className="items-center gap-6 px-5 py-4 self-stretch w-full flex-[0_0_auto] bg-white rounded-md overflow-hidden border border-solid border-[#dfe3da] flex relative list-none m-0"
        >
          <li className="flex items-center gap-2 relative flex-1 grow">
            <span className="flex w-[23px] h-[23px] items-center justify-center relative bg-[#173d35] rounded-[100px] overflow-hidden">
              <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[11px] tracking-[0] leading-[normal]">
                1
              </span>
            </span>
            <span className="flex-1 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-xs leading-[18px] relative tracking-[0]">
              Add content
            </span>
            <div className="relative w-3.5 h-3.5">
              <img className="w-full h-full" alt="" src={iconBreadcrumbArrow} />
            </div>
          </li>
          <li className="flex items-center gap-2 relative flex-1 grow">
            <span className="flex w-[23px] h-[23px] items-center justify-center relative bg-[#f8f9f6] rounded-[100px] overflow-hidden border border-solid border-[#dfe3da]">
              <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[0] leading-[normal]">
                2
              </span>
            </span>
            <span className="flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
              Resolve findings
            </span>
            <div className="relative w-3.5 h-3.5">
              <img className="w-full h-full" alt="" src={iconBreadcrumbArrow} />
            </div>
          </li>
          <li className="flex items-center gap-2 relative flex-1 grow">
            <span className="flex w-[23px] h-[23px] items-center justify-center relative bg-[#f8f9f6] rounded-[100px] overflow-hidden border border-solid border-[#dfe3da]">
              <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[0] leading-[normal]">
                3
              </span>
            </span>
            <span className="flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
              Approve &amp; release
            </span>
          </li>
        </ol>

        <div className="items-start gap-6 self-stretch w-full flex-[0_0_auto] flex relative">
          {/* Main Draft Form */}
          <form
            onSubmit={handleReviewContent}
            className="gap-[22px] p-6 flex-1 grow bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da] flex flex-col items-start relative"
          >
            <div className="gap-2 self-stretch w-full flex-[0_0_auto] flex flex-col items-start relative">
              <label
                htmlFor="content-title"
                className="relative self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs tracking-[0] leading-[18px]"
              >
                Content title
              </label>
              <input
                id="content-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="flex h-11 items-center px-3.5 py-0 relative self-stretch w-full rounded-md overflow-hidden border border-solid border-[#dfe3da] [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-sm leading-[21px] outline-none focus:border-[#173d35]"
              />
            </div>

            <fieldset className="flex flex-col items-start gap-[9px] relative self-stretch w-full flex-[0_0_auto] border-0 p-0 m-0">
              <legend className="relative self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs tracking-[0] leading-[18px]">
                Content type
              </legend>
              <div className="flex items-start gap-2 self-stretch w-full relative flex-[0_0_auto]">
                {contentTypes.map((type) => {
                  const isSelected = selectedType === type.label;
                  return (
                    <button
                      key={type.label}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedType(type.label)}
                      className={`inline-flex h-9 items-center gap-1.5 px-[13px] py-0 relative flex-[0_0_auto] rounded-md overflow-hidden border border-solid cursor-pointer ${
                        isSelected
                          ? "bg-[#dce6de] border-[#173d35]"
                          : "bg-white border-[#dfe3da]"
                      }`}
                    >
                      {isSelected ? (
                        <span className="relative w-3.5 h-3.5">
                          <img
                            className="w-full h-full"
                            alt=""
                            src={iconCheckGreen}
                          />
                        </span>
                      ) : null}
                      <span
                        className={`w-fit [font-family:${
                          isSelected ? "'Inter-SemiBold'" : "'Inter-Regular'"
                        },Helvetica] font-${
                          isSelected ? "semibold" : "normal"
                        } text-[#252b29] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]`}
                      >
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col items-start gap-[9px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-start justify-between flex-[0_0_auto] relative self-stretch w-full">
                <label
                  htmlFor="content-review"
                  className="w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]"
                >
                  Content to review
                </label>
                <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] whitespace-nowrap relative tracking-[0]">
                  Paste or type your draft
                </p>
              </div>

              {/* Text editor box */}
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden border border-solid border-[#dfe3da]">
                {/* Visual Editor Toolbar */}
                <div className="h-[39px] flex items-center gap-3 px-3.5 py-0 relative self-stretch w-full bg-[#f8f9f6] border-b border-[#dfe3da]">
                  <button type="button" className="text-sm font-bold text-[#707871] hover:text-[#173d35] cursor-pointer">B</button>
                  <button type="button" className="text-sm italic font-serif text-[#707871] hover:text-[#173d35] cursor-pointer">I</button>
                  <button type="button" className="text-xs text-[#707871] hover:text-[#173d35] cursor-pointer">• List</button>
                  <button type="button" className="text-xs text-[#707871] hover:text-[#173d35] cursor-pointer">🔗 Link</button>
                </div>
                <textarea
                  id="content-review"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="flex flex-col min-h-[170px] items-start gap-[18px] p-[18px] relative self-stretch w-full flex-[0_0_auto] resize-none border-0 outline-none [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-sm leading-[21px] tracking-[0]"
                  aria-label="Content to review"
                />
                <div className="flex items-start justify-end px-3.5 py-[9px] flex-[0_0_auto] relative self-stretch w-full">
                  <p className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] whitespace-nowrap relative tracking-[0]">
                    {wordCount} words · English (US)
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="flex items-center gap-[13px] p-[17px] relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden border border-dashed border-[#dfe3da]">
              <div className="relative w-5 h-5">
                <img
                  className="w-full h-full"
                  alt=""
                  src={iconUpload}
                />
              </div>
              <div className="flex flex-col items-start gap-[3px] relative flex-1 grow">
                <p className="self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                  {selectedFile
                    ? selectedFile.name
                    : "Or upload a document or image"}
                </p>
                <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] relative tracking-[0]">
                  PDF, DOCX, TXT, PNG or JPG · Up to 20 MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="all-unset box-border inline-flex h-10 items-center justify-center gap-2 px-4 py-0 relative flex-[0_0_auto] bg-white rounded-md overflow-hidden border border-solid border-[#dfe3da] hover:bg-[#f8f9f6] cursor-pointer"
              >
                <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-[13px] tracking-[0] leading-[normal]">
                  Browse files
                </span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="items-center justify-between self-stretch w-full flex-[0_0_auto] flex relative pt-2">
              <p className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
                Your content stays in this workspace.
              </p>
              <button
                type="submit"
                className="all-unset box-border inline-flex h-10 items-center justify-center gap-2 px-5 py-0 relative flex-[0_0_auto] bg-[#173d35] rounded-md overflow-hidden border-0 hover:bg-[#245448] cursor-pointer"
              >
                <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[13px] tracking-[0] leading-[normal]">
                  Review Content
                </span>
                <span className="relative w-4 h-4">
                  <img
                    className="w-full h-full"
                    alt=""
                    src={iconArrowRight}
                  />
                </span>
              </button>
            </div>
          </form>

          {/* Right Info Sidebar */}
          <aside className="flex-col w-[304px] items-start gap-5 flex relative">
            <section
              aria-labelledby="brand-heading"
              className="flex flex-col items-start gap-5 p-6 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da] shadow-[0px_2px_5px_#173d3505]"
            >
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <h2
                  id="brand-heading"
                  className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-base tracking-[0] leading-6 whitespace-nowrap"
                >
                  Grounded in your brand
                </h2>
              </div>
              <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex w-[35px] h-[35px] items-center justify-center relative bg-[#f6f5ef] rounded-md overflow-hidden">
                  <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    a.
                  </span>
                </div>
                <div className="flex flex-col items-start relative flex-1 grow">
                  <div className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-[13px] leading-[19.5px] relative tracking-[0]">
                    Aster
                  </div>
                  <div className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
                    8 approved sources
                  </div>
                </div>
              </div>
              <div className="relative self-stretch w-full h-px bg-[#dfe3da]" />
              <div className="flex-col items-start gap-3.5 self-stretch w-full flex-[0_0_auto] flex relative">
                {brandKnowledgeItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
                  >
                    <div className="relative w-3.5 h-3.5">
                      <img
                        className="w-full h-full"
                        alt=""
                        src={iconCheckGreen}
                      />
                    </div>
                    <div className="flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/brand-vault")}
                className="self-stretch text-left [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-[11px] leading-[16.5px] relative tracking-[0] hover:underline cursor-pointer"
              >
                View Brand Vault ↗
              </button>
            </section>

            <section className="flex flex-col items-start gap-2 p-[18px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-[18px] h-[18px]">
                <img
                  className="w-full h-full"
                  alt=""
                  src={iconInfo}
                />
              </div>
              <h2 className="self-stretch [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]">
                AI assists. Your team decides.
              </h2>
              <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
                You&apos;ll see the issue, its evidence and a suggested fix. Nothing is changed without your approval.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};