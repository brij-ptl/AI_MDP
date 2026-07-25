"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { PUBLIC_NAV_LINKS } from "@/constants/nav";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-2xl border-b border-white/10 transition-all duration-300">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-white/80 transition-all duration-300 hover:text-white",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button href="/login" variant="primary">Sign In</Button>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl lg:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted hover:text-primary" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Button href="/login" variant="primary" className="flex-1">Sign In</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
