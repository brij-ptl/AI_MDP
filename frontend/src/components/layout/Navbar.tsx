"use client";

import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Logo />
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/#modules">Diseases</Link>
          <Link href="/symptom-checker">AI Symptom Checker</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="nav-right">
          <ThemeToggle />
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    </header>
  );
}
