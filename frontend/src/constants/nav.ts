export interface NavItem {
  label: string;
  href: string;
  icon: "home" | "user" | "stethoscope" | "camera" | "settings";
}

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Predict", href: "/prediction", icon: "stethoscope" },
  { label: "Scan", href: "/upload-report", icon: "camera" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Diseases", href: "/diseases" },
  { label: "AI Symptom Checker", href: "/symptom-checker" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
