import { DashboardSection } from "./DashboardSection";
import { SidebarNavigationSection } from "./SidebarNavigationSection";

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen items-start bg-[#f6f5ef] text-[#20201e]">
      <SidebarNavigationSection />
      <DashboardSection />
    </div>
  );
};

export default Dashboard;