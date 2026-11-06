import { ContentReviewSection } from "./ContentReviewSection";
import { Sidebar } from "../../components/Sidebar";
import { TopHeader } from "../../components/TopHeader";

export const NewContentReview = () => {
  return (
    <div className="flex min-h-screen w-full items-stretch bg-[#f6f5ef] text-[#252b29]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader breadcrumb="Reviews / New review" />
        <ContentReviewSection />
      </div>
    </div>
  );
};

export default NewContentReview;