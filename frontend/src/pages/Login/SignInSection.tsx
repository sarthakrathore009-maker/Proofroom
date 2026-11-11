import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearTourState, startProductTour } from "../../components/ProductTour";
import {
  PERSONAS,
  firstRouteForRole,
  saveCurrentUser,
  type UserRole,
} from "../../lib/roles";

// Screenshot ke exact icons (Eye-off, White Checkmark, aur White Right Arrow)
const vector3 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23707871' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'/><line x1='1' y1='1' x2='23' y2='23'/></svg>";
const vector4 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='20 6 9 17 4 12'/></svg>";
const vector5 =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><line x1='5' y1='12' x2='19' y2='12'/><polyline points='12 5 19 12 12 19'/></svg>";

const roleCardCopy: Record<UserRole, string> = {
  admin: "Brand Vault & Rules",
  creator: "Submit & Revise Content",
  reviewer: "Audit & Approve Releases",
};

export const SignInSection = () => {
  const demoPassword = "password123";
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const demoEmail = PERSONAS[selectedRole].email;
  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const completeLogin = (role: UserRole) => {
    saveCurrentUser(role);
    clearTourState();
    startProductTour();
    navigate(firstRouteForRole(role));
  };

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(PERSONAS[role].email);
    setPassword(demoPassword);
    setError("");
  };

  const handleDemoLogin = (role: UserRole) => {
    selectRole(role);
    completeLogin(role);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const matchedRole = (Object.keys(PERSONAS) as UserRole[]).find(
      (candidate) => PERSONAS[candidate].email === normalizedEmail
    );
    if (matchedRole && password === demoPassword) {
      setError("");
      completeLogin(matchedRole);
      return;
    }
    if (password === demoPassword && Object.values(PERSONAS).some((p) => p.email === normalizedEmail)) {
      setError("");
      completeLogin(selectedRole);
      return;
    }
    // Allow Sign in with currently selected role when demo password matches prefilled email
    if (password === demoPassword && normalizedEmail === PERSONAS[selectedRole].email) {
      setError("");
      completeLogin(selectedRole);
      return;
    }
    setError("Please use the official demo credentials provided.");
  };

  return (
    <div className="items-center justify-between pt-11 pb-8 px-16 flex-1 self-stretch grow flex flex-col relative">
      <div className="flex items-start justify-end relative self-stretch w-full flex-[0_0_auto]">
        <a
          className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]"
          href="mailto:support@proofroom.co"
        >
          Need a hand? Contact us ↗
        </a>
      </div>
      <form
        className="w-[400px] items-start gap-[26px] flex-[0_0_auto] flex flex-col relative"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <h1 className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-[32px] tracking-[-1.00px] leading-[normal]">
            Welcome to Proofroom
          </h1>
          <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-sm leading-[21px] relative tracking-[0]">
            Sign in to your workspace.
            <br />
            Your next confident review starts here.
          </p>
        </div>
        <div className="self-stretch rounded-md border border-[#dce6de] bg-[#f0f5f1] p-3.5">
          <p className="mb-3 text-xs font-medium leading-[18px] text-[#173d35]">
            ⚡ Quick Demo: Select a role to sign in with pre-filled credentials
          </p>
          <div className="mb-2 flex gap-1.5" aria-label="Select demo role">
            {(Object.keys(PERSONAS) as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                aria-pressed={selectedRole === role}
                onClick={() => selectRole(role)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${selectedRole === role ? "bg-[#173d35] text-white" : "bg-white text-[#707871]"}`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PERSONAS) as UserRole[]).map((role) => {
              const persona = PERSONAS[role];
              const selected = role === selectedRole;
              return (
                <button
                  key={role}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleDemoLogin(role)}
                  className={`rounded-md border px-2.5 py-2 text-left ${selected ? "border-[#173d35] bg-[#173d35] text-white" : "border-[#dce6de] bg-white text-[#173d35]"}`}
                >
                  <span className="block text-[11px] font-semibold">
                    Demo Login as {role[0].toUpperCase() + role.slice(1)}
                  </span>
                  <span className={`mt-1 block text-[10px] ${selected ? "text-[#dce6de]" : "text-[#707871]"}`}>
                    {persona.name} — {roleCardCopy[role]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className="self-stretch rounded-md border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-xs font-medium leading-[18px] text-[#b91c1c]"
          >
            {error}
          </div>
        )}
        <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <label
              className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]"
              htmlFor="work-email"
            >
              Work email
            </label>
            <input
              className="h-12 px-3.5 py-0 relative self-stretch w-full bg-white rounded-md overflow-hidden border border-solid border-[#dfe3da] [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-sm leading-[21px] whitespace-nowrap tracking-[0]"
              id="work-email"
              name="email"
              placeholder={PERSONAS[selectedRole].email}
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <label
              className="self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#252b29] text-xs leading-[18px] relative tracking-[0]"
              htmlFor="input-1"
            >
              Password
            </label>
            <div className="justify-between flex h-12 items-center px-3.5 py-0 relative self-stretch w-full bg-white rounded-md overflow-hidden border border-solid border-[#dfe3da]">
              <input
                className="flex-1 min-w-0 [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-sm leading-[21px] whitespace-nowrap relative tracking-[0] [background:transparent] border-[none] p-0 outline-none"
                id="input-1"
                name="password"
                placeholder="••••••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="relative w-[17px] h-[17px] shrink-0 border-0 bg-transparent p-0 cursor-pointer"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                <img
                  className="absolute w-[94.61%] h-[94.61%] top-[5.39%] left-[5.39%]"
                  alt=""
                  src={vector3}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
          <label className="inline-flex items-center gap-2 relative flex-[0_0_auto] cursor-pointer">
            <span className="flex w-[15px] h-[15px] items-center justify-center relative bg-[#173d35] rounded-[3px] overflow-hidden">
              <input
                className="absolute w-[15px] h-[15px] opacity-0 cursor-pointer"
                type="checkbox"
                name="keepSignedIn"
                checked={keepSignedIn}
                onChange={(event) => setKeepSignedIn(event.target.checked)}
              />
              <span
                className={`relative w-[11px] h-[11px] ${
                  keepSignedIn ? "block" : "hidden"
                }`}
              >
                <img
                  className="absolute w-[87.88%] h-[79.55%] top-[20.45%] left-[12.12%]"
                  alt=""
                  src={vector4}
                />
              </span>
            </span>
            <span className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#252b29] text-xs leading-[18px] whitespace-nowrap relative tracking-[0]">
              Keep me signed in
            </span>
          </label>
          <Link
            className="w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#173d35] text-xs leading-[18px] whitespace-nowrap relative tracking-[0] border-0 bg-transparent p-0 cursor-pointer"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <button
          className="flex h-12 items-center justify-center gap-2.5 relative self-stretch w-full bg-[#173d35] rounded-md overflow-hidden border-0 cursor-pointer"
          type="submit"
        >
          <span className="w-fit [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-sm leading-[21px] whitespace-nowrap relative tracking-[0]">
            Sign in
          </span>
          <span className="relative w-4 h-4">
            <img
              className="absolute w-[82.30%] h-[82.30%] top-[17.70%] left-[17.70%]"
              alt=""
              src={vector5}
            />
          </span>
        </button>
        <div
          className="relative self-stretch w-full h-px bg-[#dfe3da]"
          role="separator"
        />
        <p className="self-stretch [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-xs leading-[18px] relative tracking-[0]">
          New to your team? Ask your workspace owner for access.
        </p>
      </form>
      <footer className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
        <span className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]">
          © 2026 Proofroom
        </span>
        <a
          className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]"
          href="/privacy"
        >
          Privacy
        </a>
        <a
          className="w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#707871] text-[11px] leading-[16.5px] whitespace-nowrap relative tracking-[0]"
          href="/terms"
        >
          Terms
        </a>
      </footer>
    </div>
  );
};
