import { DashboardSection } from "./DashboardSection";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f6f5ef] text-[#252b29]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader breadcrumb="Dashboard" />
        <DashboardSection />
      </div>
    </div>
  );
};

export default Dashboard;