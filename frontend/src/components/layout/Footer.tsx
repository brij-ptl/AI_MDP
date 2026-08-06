"use client";

import Link from "next/link";
import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Logo />
          <p>Nidaan+ is a clinical-grade AI-powered multi-disease prediction and triage platform. Informational only, not a substitute for professional medical advice.</p>
          <div className="foot-socials">
            <a href="#">X</a><a href="#">in</a><a href="#">gh</a><a href="#">st</a>
          </div>
        </div>
        <div className="foot-col">
          <h4>Product</h4>
          <ul>
            <li><Link href="/#modules">Diseases</Link></li>
            <li><Link href="/symptom-checker">Symptom Checker</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/api-docs">API Docs</Link></li>
            <li><Link href="/docs">Documentation</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <ul>
            <li><Link href="/privacy-policy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/cookies">Cookies</Link></li>
            <li><Link href="/support">Support</Link></li>
            <li><Link href="/status">Status</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-news">
        <div>
          <h4>Subscribe to our newsletter</h4>
          <p>Get clinical AI updates and preventative health insights.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
      <div className="foot-bottom">
        © {new Date().getFullYear()} Nidaan+. Built to medical-grade AI compliance specifications.
      </div>
    </footer>
  );
}
