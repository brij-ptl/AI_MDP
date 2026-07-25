"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, Stethoscope, Camera, Settings } from "lucide-react";
import { MOBILE_NAV_ITEMS, NavItem } from "@/constants/nav";

const ICONS: Record<NavItem["icon"], React.ElementType> = {
  home: Home,
  user: User,
  stethoscope: Stethoscope,
  camera: Camera,
  settings: Settings,
};

/** Bottom app-style navigation with a sliding "magic indicator" — adapted from the reference mobile nav for logged-in dashboard views. */
export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const activeIndex = Math.max(
    0,
    MOBILE_NAV_ITEMS.findIndex((item) => pathname?.startsWith(item.href))
  );
  const [hovered, setHovered] = useState<number | null>(null);
  const idx = hovered ?? activeIndex;

  return (
    <nav className="mobile-nav lg:hidden">
      <ul>
        {MOBILE_NAV_ITEMS.map((item, i) => {
          const Icon = ICONS[item.icon];
          const active = i === idx;
          return (
            <li key={item.href} className={active ? "active" : ""}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <span className="icon"><Icon size={20} /></span>
                <span className="label">{item.label}</span>
              </a>
            </li>
          );
        })}
        <div
          className="indicator"
          style={{ transform: `translateX(${idx * 100}%)` }}
        />
      </ul>
    </nav>
  );
}
