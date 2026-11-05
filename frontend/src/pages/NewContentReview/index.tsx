import { ContentReviewSection } from "./ContentReviewSection";
import { WorkspaceNavigationSection } from "./WorkspaceNavigationSection";

export const NewContentReview = () => {
  return (
    <main className="flex min-h-screen items-start bg-[#f6f5ef] text-[#171717]">
      <WorkspaceNavigationSection />
      <ContentReviewSection />
    </main>
  );
};

export default NewContentReview;