import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiRequest } from "../../lib/api";
import { useWorkspaceData, type BrandVaultData } from "../../context/WorkspaceDataContext";
import { getCurrentUser } from "../../lib/roles";
import { RoleAccessPill, brandVaultAccessMessage, adminActionLockNote } from "../../components/RoleAccessPill";

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

type BrandVaultResponse = BrandVaultData;

const formatVaultDate = (dateValue?: string) => {
  if (!dateValue) return "recently";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "recently";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapVaultData = (data: BrandVaultResponse): Category[] => [
  {
    title: "Brand Guidelines",
    description: "How DemoBrand Co. looks, sounds and shows up.",
    entries: data.rules
      .filter((rule) => !rule.category?.toLowerCase().includes("terminology"))
      .map((rule) => ({
        title: rule.title,
        description: rule.description ?? "",
        metadata: `${rule.rule_code} · ${rule.version || "v1.0"} · Approved by ${rule.approved_by || "Elena Ruiz"}`,
        icon: rule.category?.toLowerCase().includes("visual") ? vectorPalette : vectorBook,
      })),
  },
  {
    title: "Approved Facts and Claims",
    description: "Evidence-led statements your team can use.",
    entries: data.facts.map((fact) => ({
      title: fact.title,
      description: fact.claim_statement || fact.description || "",
      metadata: `${fact.fact_code} · ${fact.version || "v1.0"} · Approved by ${fact.approved_by || "Nina Patel"}`,
      icon: vectorDoc,
    })),
  },
  {
    title: "Terminology",
    description: "Consistent language, down to the last word.",
    entries: data.rules
      .filter((rule) => rule.category?.toLowerCase().includes("terminology"))
      .map((rule) => ({
        title: rule.title,
        description: rule.description ?? "",
        metadata: `${rule.rule_code} · ${rule.version || "v1.0"} · Approved by ${rule.approved_by || "Elena Ruiz"}`,
        textIcon: "Aa",
      })),
  },
  {
    title: "Brand Logos and Assets",
    description: "Ready-to-use, approved brand essentials.",
    entries: data.assets.map((asset) => ({
      title: asset.title,
      description: asset.description ?? "",
      metadata: `${asset.asset_code} · ${asset.version || "v1.0"} · Updated ${formatVaultDate(asset.updated_at)}`,
      textIcon: "a.",
    })),
  },
];

export const BrandVaultSection = () => {
  const user = getCurrentUser();
  const isAdmin = user.role === "admin";
  const vaultAccess = brandVaultAccessMessage(user.role);
  const vaultLockNote = adminActionLockNote(user.role);
  const { brandVaultData, isInitialLoaded, ensureInitialLoad, refreshWorkspaceAfterActivity } =
    useWorkspaceData();
  const [query, setQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entryType, setEntryType] = useState<"rule" | "fact" | "asset">("rule");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [entryCategory, setEntryCategory] = useState("Terminology");
  const [entryCode, setEntryCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isInitialLoaded) {
      void ensureInitialLoad();
    }
  }, [ensureInitialLoad, isInitialLoaded]);

  const vaultCategories = useMemo(
    () => (brandVaultData ? mapVaultData(brandVaultData) : []),
    [brandVaultData]
  );
  const loading = !isInitialLoaded && !brandVaultData;

  const latestUpdatedAt = useMemo(
    () =>
      vaultCategories
        .flatMap((category) => category.entries)
        .map((entry) => entry.metadata.match(/Updated (.+)$/)?.[1])
        .filter((date): date is string => Boolean(date))
        .pop(),
    [vaultCategories]
  );

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return vaultCategories;
    }

    return vaultCategories
      .map((category) => ({
        ...category,
        entries: category.entries.filter((entry) =>
          `${category.title} ${category.description} ${entry.title} ${entry.description} ${entry.metadata}`
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.entries.length > 0);
  }, [query, vaultCategories]);

  const openAddDialog = (
    type: "rule" | "fact" | "asset" = "rule",
    category = "Brand Guidelines"
  ) => {
    setEntryType(type);
    setEntryCategory(category);
    setEntryTitle("");
    setEntryDescription("");
    setEntryCode("");
    setShowAddDialog(true);
  };

  const handleEntryTypeChange = (type: "rule" | "fact" | "asset") => {
    setEntryType(type);
    setEntryCategory(
      type === "fact"
        ? "Approved Facts and Claims"
        : type === "asset"
          ? "Brand Logos and Assets"
          : "Brand Guidelines"
    );
  };

  const handleAddEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryTitle.trim() || !entryDescription.trim()) return;

    setIsSubmitting(true);
    try {
      await apiRequest<Record<string, string>>(`/api/brand-vault/${
        entryCategory === "Approved Facts and Claims" || entryType === "fact"
          ? "facts"
          : entryCategory === "Brand Logos and Assets" || entryType === "asset"
            ? "assets"
            : "rules"
      }`, {
        method: "POST",
        body:
          entryType === "rule"
            ? {
                rule_code: entryCode,
                category: entryCategory,
                title: entryTitle,
                description: entryDescription,
                approved_by: "Elena Ruiz",
              }
            : entryType === "fact"
              ? {
                fact_code: entryCode,
                title: entryTitle,
                claim_statement: entryDescription,
                category: "Product claim",
                approved_by: "Nina Patel",
              }
              : {
                asset_code: entryCode,
                title: entryTitle,
                description: entryDescription,
              },
      });
      await refreshWorkspaceAfterActivity();
      setShowAddDialog(false);
    } catch (error) {
      console.error("Unable to add Brand Vault entry", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-start relative flex-1 grow bg-[#f8f9f6]">
      <div
        data-tour="brand-vault-management"
        className="gap-7 pt-[34px] pb-9 px-10 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
      >
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
              data-tour="add-entry-btn"
              disabled={!isAdmin}
              title={isAdmin ? "Add a Brand Vault entry" : vaultLockNote}
              onClick={() => openAddDialog()}
              className={`all-unset box-border inline-flex h-10 items-center justify-center gap-2 px-4 py-0 relative flex-[0_0_auto] rounded-md overflow-hidden border border-solid ${isAdmin ? "bg-[#173d35] hover:bg-[#245448] cursor-pointer" : "bg-[#e5e7eb] text-[#707871] cursor-not-allowed"}`}
            >
              <div className="relative w-4 h-4">
                <img
                  className="absolute w-[82.29%] h-[82.29%] top-[17.71%] left-[17.71%]"
                  alt=""
                  src={vectorPlus}
                />
              </div>
              <span className={`${isAdmin ? "text-white" : "text-[#707871]"} text-[13px] leading-[normal] relative w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold tracking-[0]`}>
                {isAdmin ? "Add entry" : "🔒 Add entry"}
              </span>
            </button>
          </div>
          <RoleAccessPill variant={vaultAccess.variant} message={vaultAccess.message} />
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-sm leading-[21px] relative tracking-[0]">
            Approved knowledge for DemoBrand Co. Every review starts with the sources
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
                {loading
                  ? "Loading…"
                  : `${vaultCategories.reduce((total, category) => total + category.entries.length, 0)} approved entries`}
              </div>
            </div>
            <p className="w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
              Last updated {latestUpdatedAt ?? "—"}
            </p>
          </div>
        </div>
        <div data-tour="brand-vault-grid" className="relative self-stretch w-full flex-[0_0_auto]">
        {loading ? (
          <div className="flex min-h-32 w-full items-center justify-center rounded-[10px] border border-[#dfe3da] bg-white text-sm text-[#707871]">
            Loading Brand Vault…
          </div>
        ) : (
        <div className="grid grid-cols-2 items-stretch gap-5 relative self-stretch w-full flex-[0_0_auto]">
          {filteredCategories.map((category, categoryIndex) => (
            <section
              key={category.title}
              aria-labelledby={`category-${categoryIndex}`}
              className="flex min-h-[260px] flex-col items-start relative flex-1 grow bg-white rounded-[10px] overflow-hidden border border-solid border-[#dfe3da]"
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
                    disabled={!isAdmin}
                    title={isAdmin ? "Add a Brand Vault entry" : vaultLockNote}
                    onClick={() =>
                      openAddDialog(
                        category.title === "Approved Facts and Claims"
                          ? "fact"
                          : category.title === "Brand Logos and Assets"
                            ? "asset"
                            : "rule",
                        category.title === "Brand Guidelines"
                          ? "Brand Guidelines"
                          : category.title === "Terminology"
                            ? "Terminology"
                            : category.title === "Approved Facts and Claims"
                              ? "Approved Facts and Claims"
                              : "Brand Logos and Assets"
                      )
                    }
                    className={`w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-xs leading-[18px] whitespace-nowrap relative tracking-[0] ${isAdmin ? "text-[#173d35] hover:underline cursor-pointer" : "text-[#707871] cursor-not-allowed"}`}
                  >
                    {isAdmin ? "+ Add" : "🔒 Add"}
                  </button>
                </div>
                <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
                  {category.description}
                </p>
              </div>
              {category.entries.length === 0 ? (
                <div className="flex min-h-[110px] w-full flex-1 items-center justify-center border-t border-[#dfe3da] px-[22px] py-6 text-center text-xs leading-[18px] text-[#707871]">
                  No entries in this section yet. Click + Add to create one.
                </div>
              ) : category.entries.map((entry) => (
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
        )}
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
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-entry-title"
            onSubmit={handleAddEntry}
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
            <div className="mt-5 flex flex-col gap-3">
              <select value={entryType} onChange={(event) => handleEntryTypeChange(event.target.value as "rule" | "fact" | "asset")} className="rounded-md border border-[#dfe3da] px-3 py-2 text-xs text-[#252b29]">
                <option value="rule">Rule</option>
                <option value="fact">Fact</option>
                <option value="asset">Asset</option>
              </select>
              <select
                value={entryCategory}
                onChange={(event) => {
                  const category = event.target.value;
                  setEntryCategory(category);
                  if (category === "Approved Facts and Claims") setEntryType("fact");
                  if (category === "Brand Logos and Assets") setEntryType("asset");
                  if (category === "Brand Guidelines" || category === "Voice & Tone" || category === "Terminology") {
                    setEntryType("rule");
                  }
                }}
                className="rounded-md border border-[#dfe3da] px-3 py-2 text-xs text-[#252b29]"
              >
                <option>Brand Guidelines</option>
                <option>Voice &amp; Tone</option>
                <option>Terminology</option>
                <option>Approved Facts and Claims</option>
                <option>Brand Logos and Assets</option>
              </select>
              <input value={entryCode} onChange={(event) => setEntryCode(event.target.value)} placeholder="Code (optional)" className="rounded-md border border-[#dfe3da] px-3 py-2 text-xs text-[#252b29]" />
              <input required value={entryTitle} onChange={(event) => setEntryTitle(event.target.value)} placeholder="Title" className="rounded-md border border-[#dfe3da] px-3 py-2 text-xs text-[#252b29]" />
              <textarea required value={entryDescription} onChange={(event) => setEntryDescription(event.target.value)} placeholder={entryType === "fact" ? "Claim statement" : "Description"} className="min-h-20 rounded-md border border-[#dfe3da] px-3 py-2 text-xs text-[#252b29]" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="rounded-md border border-[#dfe3da] px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold text-[#173d35] hover:bg-[#f8f9f6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-[#173d35] px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold text-white hover:bg-[#245448] cursor-pointer"
              >
                {isSubmitting ? "Saving…" : "Continue"}
              </button>
            </div>
          </form>
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
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={!isAdmin}
                title={isAdmin ? "Edit this entry" : vaultLockNote}
                className={`rounded-md border px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold ${isAdmin ? "border-[#173d35] text-[#173d35]" : "cursor-not-allowed border-[#e5e7eb] text-[#707871]"}`}
              >
                {isAdmin ? "Edit" : "🔒 Edit"}
              </button>
              <button
                type="button"
                disabled={!isAdmin}
                title={isAdmin ? "Delete this entry" : vaultLockNote}
                className={`rounded-md border px-4 py-2 [font-family:'Inter-SemiBold',Helvetica] text-xs font-semibold ${isAdmin ? "border-[#b91c1c] text-[#b91c1c]" : "cursor-not-allowed border-[#e5e7eb] text-[#707871]"}`}
              >
                {isAdmin ? "Delete" : "🔒 Delete"}
              </button>
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