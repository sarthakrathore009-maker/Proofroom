import type { UserRole } from "../lib/roles";

type AccessVariant = "unlocked" | "locked";

type RoleAccessPillProps = {
  variant: AccessVariant;
  message: string;
  className?: string;
};

export function RoleAccessPill({ variant, message, className = "" }: RoleAccessPillProps) {
  const unlocked = variant === "unlocked";
  return (
    <div
      role="status"
      className={`inline-flex max-w-full items-start gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium leading-[15px] ${
        unlocked
          ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
          : "border-[#e5e7eb] bg-[#f3f4f6] text-[#6b7280]"
      } ${className}`}
    >
      <span className="whitespace-pre-wrap">{message}</span>
    </div>
  );
}

export const brandVaultAccessMessage = (role: UserRole): { variant: AccessVariant; message: string } => {
  if (role === "admin") {
    return {
      variant: "unlocked",
      message:
        "🔓 Unlocked for Admin: Full access to add, edit & verify Brand Vault rules and facts.",
    };
  }
  if (role === "creator") {
    return {
      variant: "locked",
      message:
        "🔒 Locked for Creator (View-Only) • Open for Admin to add or edit Brand Vault rules.",
    };
  }
  return {
    variant: "locked",
    message:
      "🔒 Locked for Reviewer (View-Only) • Open for Admin to add or edit Brand Vault rules.",
  };
};

export const contentSubmitAccessMessage = (
  role: UserRole
): { variant: AccessVariant; message: string } => {
  if (role === "creator") {
    return {
      variant: "unlocked",
      message:
        "🔓 Unlocked for Creator: Full access to submit content, run Pre-Flight checks, revise drafts & request exceptions.",
    };
  }
  if (role === "admin") {
    return {
      variant: "locked",
      message:
        "🔒 Locked for Admin (View-Only) • Open for Creator to submit drafts and edit content.",
    };
  }
  return {
    variant: "locked",
    message:
      "🔒 Locked for Reviewer (View-Only) • Open for Creator to submit drafts and edit content.",
  };
};

export const approvalAccessMessage = (
  role: UserRole
): { variant: AccessVariant; message: string } => {
  if (role === "reviewer") {
    return {
      variant: "unlocked",
      message:
        "🔓 Unlocked for Reviewer: Full access to audit Proof Cards, approve/reject content, and issue & download the Release Passport.",
    };
  }
  if (role === "creator") {
    return {
      variant: "locked",
      message:
        "🔒 Locked for Creator (View-Only) • Open for Reviewer to approve content and download the Release Passport.",
    };
  }
  return {
    variant: "locked",
    message:
      "🔒 Locked for Admin (View-Only) • Open for Reviewer to approve content and download the Release Passport.",
  };
};

export const creatorActionLockNote = (role: UserRole): string => {
  if (role === "admin") return "Locked for Admin • Open for Creator";
  if (role === "reviewer") return "Locked for Reviewer • Open for Creator";
  return "Unlocked for Creator";
};

export const reviewerActionLockNote = (role: UserRole): string => {
  if (role === "admin") return "Locked for Admin • Open for Reviewer";
  if (role === "creator") return "Locked for Creator • Open for Reviewer";
  return "Unlocked for Reviewer";
};

export const adminActionLockNote = (role: UserRole): string => {
  if (role === "creator") return "Locked for Creator • Open for Admin";
  if (role === "reviewer") return "Locked for Reviewer • Open for Admin";
  return "Unlocked for Admin";
};
