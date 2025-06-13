export type LimitationType = {
  files: number;
  canAddPassword: boolean;
  canAddPricing: boolean;
};

export type UserPlan = {
  planName: string;
};

export const PLAN_LIMITATIONS: Record<UserPlan, LimitationType> = {
  FREE: {
    files: 1,
    canAddPassword: false,
    canAddPricing: false,
  },
  IRON: {
    files: 10,
    canAddPassword: true,
    canAddPricing: false,
  },
  GOLD: {
    files: 1000,
    canAddPassword: true,
    canAddPricing: true,
  },
};

export const getLimitation = (plan?: string | null) => {
  //
  const limitation = PLAN_LIMITATIONS[plan as UserPlan];

  return limitation || PLAN_LIMITATIONS.FREE;
};
