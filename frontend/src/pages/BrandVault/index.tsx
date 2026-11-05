import { BrandVaultSection } from "./BrandVaultSection";
import { NavigationSidebarSection } from "./NavigationSidebarSection";

export const BrandVault = () => {
  return (
    <main className="flex min-h-screen items-start bg-[#f6f5ef] text-[#171717]">
      <NavigationSidebarSection />
      <BrandVaultSection />
    </main>
  );
};

export default BrandVault;