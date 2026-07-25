export interface Plan {
  id: string;
  name: string;
  price: number; // INR
  period: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  predictionsLimit: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    period: "month",
    tagline: "For individuals trying AI screening",
    predictionsLimit: "20 predictions / month",
    features: [
      "20 disease predictions / month",
      "AI Symptom Checker access",
      "Downloadable PDF reports",
      "Email support",
    ],
  },
  {
    id: "care-plus",
    name: "Care+",
    price: 149,
    period: "month",
    tagline: "Best for regular health monitoring",
    predictionsLimit: "Unlimited predictions",
    highlighted: true,
    features: [
      "Unlimited disease predictions",
      "OCR medical report upload",
      "Explainable AI (SHAP) insights",
      "Priority email + chat support",
      "Health analytics dashboard",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: 399,
    period: "3 months",
    tagline: "Whole family, one plan",
    predictionsLimit: "Unlimited · up to 4 members",
    features: [
      "Everything in Care+",
      "Up to 4 family member profiles",
      "Shared health history vault",
      "Specialist recommendation engine",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 999,
    period: "year",
    tagline: "Maximum savings, year-round care",
    predictionsLimit: "Unlimited predictions",
    features: [
      "Everything in Care+",
      "2 months free vs monthly billing",
      "Early access to new disease modules",
      "Dedicated support line",
    ],
  },
];

export const FREE_TRIAL_LIMIT = 2;
