import { BrandBenefitsSection } from "./BrandBenefitsSection";
import { SignInSection } from "./SignInSection";

export const Login = () => {
  return (
    <main className="flex min-h-screen w-full items-stretch bg-[#f6f5ef]">
      <BrandBenefitsSection />
      <SignInSection />
    </main>
  );
};

export default Login;