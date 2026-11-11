export type UserRole = "admin" | "creator" | "reviewer";

export type UserPersona = {
  role: UserRole;
  name: string;
  title: string;
  initials: string;
  email: string;
  badgeDescription: string;
};

export const PERSONAS: Record<UserRole, UserPersona> = {
  admin: {
    role: "admin",
    name: "Maya Lewis",
    title: "Brand Governance Admin",
    initials: "ML",
    email: "admin.maya@proofroom.co",
    badgeDescription: "Manage Brand Vault, rules, facts & workspace governance",
  },
  creator: {
    role: "creator",
    name: "Oliver Chen",
    title: "Content Creator",
    initials: "OC",
    email: "creator.oliver@proofroom.co",
    badgeDescription: "Submit drafts, run AI Pre-Flight reviews & revise copy",
  },
  reviewer: {
    role: "reviewer",
    name: "Nina Patel",
    title: "Lead Brand Reviewer",
    initials: "NP",
    email: "reviewer.nina@proofroom.co",
    badgeDescription: "Verify Proof Cards, comment & issue Release Passports",
  },
};

export const ACTIVE_ROLE_KEY = "proofroom_active_role";
export const USER_KEY = "proofroom_user";

export const getCurrentUser = (): UserPersona => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser) as Partial<UserPersona>;
      if (parsed.role && PERSONAS[parsed.role]) {
        return { ...PERSONAS[parsed.role], ...parsed };
      }
    } catch (error) {
      console.error("Unable to read stored Proofroom user", error);
    }
  }

  const storedRole = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
  return storedRole && PERSONAS[storedRole] ? PERSONAS[storedRole] : PERSONAS.admin;
};

export const saveCurrentUser = (role: UserRole) => {
  const persona = PERSONAS[role];
  localStorage.setItem(ACTIVE_ROLE_KEY, role);
  localStorage.setItem(USER_KEY, JSON.stringify(persona));
  return persona;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(ACTIVE_ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};

export const firstRouteForRole = (role: UserRole): string => {
  if (role === "creator") return "/new-review";
  if (role === "reviewer") return "/reviews";
  return "/dashboard";
};
