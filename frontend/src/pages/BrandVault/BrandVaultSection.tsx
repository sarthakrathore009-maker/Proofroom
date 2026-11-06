import { useMemo, useState } from "react";

// Screenshot ke exact Brand Vault Icons
const vectorPlus =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>";
const vectorSearch =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>";
const vectorBook =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/><path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/></svg>";
const vectorPalette =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='13.5' cy='6.5' r='.5' fill='%23173d35'/><circle cx='17.5' cy='10.5' r='.5' fill='%23173d35'/><circle cx='8.5' cy='7.5' r='.5' fill='%23173d35'/><circle cx='6.5' cy='12.5' r='.5' fill='%23173d35'/><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'/></svg>";
const vectorDoc =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>";
const vectorFlask =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23173d35' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2'/><line x1='8.5' y1='2' x2='15.5' y2='2'/><line x1='7' y1='16' x2='17' y2='16'/></svg>";
const vectorShieldCheck =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><polyline points='9 12 11 14 15 10'/></svg>";

type Entry = {
  title: string;
  description: string;
  metadata: string;
  icon?: string;
  textIcon?: string;
};

type Category = {
  title: string;
  description: string;
  entries: Entry[];
};

const categories: Category[] = [
  {
    title: "Brand Guidelines",
    description: "How Aster looks, sounds and shows up.",
    entries: [
      {
        title: "Voice & tone",
        description:
          "Calm, practical, optimistic. No miracles or sweeping environmental promises.",
        metadata: "G-001 · v1.3 · Approved by Elena Ruiz",
        icon: vectorBook,
      },
      {
        title: "Visual identity",
        description: "Wordmark, clear space, forest palette and typography.",
        metadata: "G-002 · v2.0 · Approved by Elena Ruiz",
        icon: vectorPalette,
      },
    ],
  },
  {
    title: "Approved Facts and Claims",
    description: "Evidence-led statements your team can use.",
    entries: [
      {
        title: "Packaging specification",
        description: "Bottles: 80% recycled plastic, excluding the cap.",
        metadata: "F-014 · v2.1 · Approved by Nina Patel",
        icon: vectorDoc,
      },
      {
        title: "Refill dilution guide",
        description: "One 25 ml concentrate makes 500 ml of cleaner.",
        metadata: "F-015 · v1.0 · Approved by Nina Patel",
        icon: vectorFlask,
      },
    ],
  },
  {
    title: "Terminology",
    description: "Consistent language, down to the last word.",
    entries: [
      {
        title: "Refill concentrates",
        description: 'Use "refill concentrates". Avoid "eco pods".',
        metadata: "T-003 · v1.2 · Approved by Elena Ruiz",
        textIcon: "Aa",
      },
      {
        title: "Aster bottle",
        description: 'Use "Aster bottle". Avoid "forever bottle".',
        metadata: "T-004 · v1.0 · Approved by Elena Ruiz",
        textIcon: "Aa",
      },
    ],
  },
  {
    title: "Brand Logos and Assets",
    description: "Ready-to-use, approved brand essentials.",
    entries: [
      {
        title: "Aster primary wordmark",
        description: "Forest and white variants · SVG, PNG",
        metadata: "A-001 · v2.0 · Updated 28 Oct 2026",
        textIcon: "a.",
      },
      {
        title: "Aster refill product images",
        description: "Bottle and concentrate packshots · 6 PNG files",
        metadata: "A-002 · v1.0 · Updated 28 Oct 2026",
        textIcon: "a.",
      },
    ],
  },
];

export const BrandVaultSection = () => {
  const [query, setQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        entries: category.entries.filter((entry) =>
          `${category.title} ${category.description} ${entry.title} ${entry.description} ${entry.metadata}`
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.entries.length > 0);
  }, [query]);

  return (
    <main className="flex flex-col items-start relative flex-1 grow bg-[#f8f9f6]">
      <div className="gap-7 pt-[34px] pb-9 px-10 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        <section
          aria-labelledby="brand-vault-title"
          className="gap-2.5 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
        >
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[1.40px] leading-[normal] whitespace-nowrap">
            THE SOURCE OF TRUTH
          </div>
          <div className="gap-6 flex items-center relative self-stretch w-full flex-[0_0_auto]">
            <h1
              id="brand-vault-title"
              className="relative flex-1 [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-3xl tracking-[-1.00px] leading-[normal]"
            >
              Brand Vault
            </h1>
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="all-unset box-border inline-flex h-10 items-center justify-center gap-2 px-4 py-0 relative flex-[0_0_auto] bg-[#173d35] rounded-md overflow-hidden border border-solid hover:bg-[#245448] cursor-pointer"
            >
              <div className="relative w-4 h-4">
                <img
                  className="absolute w-[82.29%] h-[82.29%] top-[17.71%] left-[17.71%]"
                  alt=""
                  src={vectorPlus}
                />
              </div>
              <span className="text-white text-[13px] leading-[normal] relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold tracking-[0]">
                Add entry
              </span>
            </button>
          </div>
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-sm leading-[21px] relative tracking-[0]">
            Approved knowledge for Aster. Every review starts with the sources
            you trust.
          </p>
        </section>
        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
          <label className="flex w-[362px] h-10 items-center gap-[9px] px-3 py-0 relative bg-white rounded-md overflow-hidden border border-solid border-[#dfe3da] focus-within:ring-2 focus-within:ring-[#173d35]">
            <div className="relative w-4 h-4">
              <img
                className="absolute w-[90.62%] h-[90.62%] top-[9.38%] left-[9.38%]"
                alt=""
                src={vectorSearch}
              />
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search approved knowledge"
              placeholder="Search approved knowledge…"
              className="min-w-0 flex-1 bg-transparent outline-none [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] placeholder:text-[#707871] text-xs leading-[18px] relative tracking-[0]"
            />
          </label>
          <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
            <div className="inline-flex items-start gap-[5px] px-2 py-1 bg-[#dce6de] rounded overflow-hidden relative flex-[0_0_auto]">
              <div className="mt-[-1.00px] text-[#173d35] text-[11px] leading-[14.3px] whitespace-nowrap relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold tracking-[0]">
                8 approved entries
              </div>
            </div>
            <p className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
              Last updated 04 Nov 2026
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
          {filteredCategories.map((category, categoryIndex) => (
            <section
              key={category.title}
              aria-labelledby={`category-${categoryIndex}`}
              className="flex flex-col items-start relative flex-1 grow bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da]"
            >
              <div className="flex flex-col items-start gap-2 p-[22px] self-stretch w-full relative flex-[0_0_auto]">
                <div className="justify-between flex items-center relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-[9px] relative flex-[0_0_auto]">
                    <h2
                      id={`category-${categoryIndex}`}
                      className="w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-base leading-6 whitespace-nowrap relative tracking-[0]"
                    >
                      {category.title}
                    </h2>
                    <span className="inline-flex items-start gap-[5px] px-2 py-1 relative flex-[0_0_auto] bg-[#f8f9f6] rounded overflow-hidden">
                      <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#707871] text-[11px] tracking-[0] leading-[14.3px] whitespace-nowrap">
                        {category.entries.length}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddDialog(true)}
                    className="w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-xs leading-[18px] whitespace-nowrap relative tracking-[0] hover:underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
                  {category.description}
                </p>
              </div>
              {category.entries.map((entry) => (
                <article
                  key={entry.title}
                  className="flex items-center gap-[13px] px-[22px] py-[17px] relative self-stretch w-full flex-[0_0_auto] border-t [border-top-style:solid] border-[#dfe3da]"
                >
                  <div className="w-[38px] h-10 items-center justify-center bg-[#f8f9f6] rounded-md overflow-hidden border border-solid border-[#dfe3da] flex relative shrink-0">
                    {entry.icon ? (
                      <div className="relative w-[18px] h-[18px]">
                        <img
                          className="w-full h-full"
                          alt=""
                          src={entry.icon}
                        />
                      </div>
                    ) : (
                      <span className="relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-[15px] leading-[normal]">
                        {entry.textIcon}
                      </span>
                    )}
                  </div>
                  <div className="flex-col items-start gap-1 flex-1 grow flex relative min-w-0">
                    <h3 className="self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#252b29] text-[13px] leading-[19.5px] relative tracking-[0]">
                      {entry.title}
                    </h3>
                    <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
                      {entry.description}
                    </p>
                    <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[10px] leading-[15px] relative tracking-[0]">
                      {entry.metadata}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEntry(entry)}
                    className="w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#173d35] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0] hover:underline cursor-pointer"
                  >
                    View ↗
                  </button>
                </article>
              ))}
            </section>
          ))}
        </div>
        <div className="flex gap-[9px] self-stretch w-full items-center relative flex-[0_0_auto]">
          <div className="relative w-4 h-4">
            <img
              className="w-full h-full"
              alt=""
              src={vectorShieldCheck}
            />
          </div>
          <p className="flex-1 mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] relative tracking-[0]">
            Only approved entries are used as evidence. Updates apply to new
            reviews; existing reviews retain their cited source version.
          </p>
        </div>
      </div>
      {showAddDialog && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddDialog(false);
            }
          }}
          className="fixed inset-0 z-10 flex items-center justify-center bg-[#173d35]/20 p-6"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-entry-title"
            className="w-full max-w-md rounded-[10px] border border-[#dfe3da] bg-white p-6 shadow-xl"
          >
            <h2
              id="add-entry-title"
              className="[font-family:'Inter-SemiBold',Helvetica] text-lg font-semibold text-[#252b29]"
            >
              Add entry
            </h2>
            <p className="mt-2 [font-family:'Inter-Regular',Helvetica] text-sm leading-[21px] text-[#707871]">
              New entries require approval before they become part of the Brand
              Vault.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="rounded-md border border-[#dfe3da] px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold text-[#173d35] hover:bg-[#f8f9f6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="rounded-md bg-[#173d35] px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold text-white hover:bg-[#245448] cursor-pointer"
              >
                Continue
              </button>
            </div>
          </section>
        </div>
      )}

      {selectedEntry && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedEntry(null);
            }
          }}
          className="fixed inset-0 z-10 flex items-center justify-center bg-[#173d35]/20 p-6"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="entry-title"
            className="w-full max-w-md rounded-[10px] border border-[#dfe3da] bg-white p-6 shadow-xl"
          >
            <h2
              id="entry-title"
              className="[font-family:'Inter-SemiBold',Helvetica] text-lg font-semibold text-[#252b29]"
            >
              {selectedEntry.title}
            </h2>
            <p className="mt-2 [font-family:'Inter-Regular',Helvetica] text-sm leading-[21px] text-[#707871]">
              {selectedEntry.description}
            </p>
            <p className="mt-3 [font-family:'Inter-Regular',Helvetica] text-xs leading-[18px] text-[#707871]">
              {selectedEntry.metadata}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="rounded-md bg-[#173d35] px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold text-white hover:bg-[#245448] cursor-pointer"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};