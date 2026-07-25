"use client";

import Link from "next/link";
import Logo from "@/components/common/Logo";
import Container from "@/components/ui/Container";

import { Twitter, Linkedin, Github, Activity } from "lucide-react";
 
 const cols = [
   { 
     title: "Product", 
     links: [
       ["Diseases", "/diseases"], 
       ["Symptom Checker", "/symptom-checker"], 
       ["Pricing", "/pricing"], 
       ["API Docs", "/api"], 
       ["Documentation", "/docs"]
     ] 
   },
   { 
     title: "Company", 
     links: [
       ["About", "/about"], 
       ["Careers", "/careers"],
       ["Blog", "/blog"], 
       ["Contact", "/contact"], 
       ["FAQ", "/faq"]
     ] 
   },
   { 
     title: "Legal & Support", 
     links: [
       ["Privacy Policy", "/privacy-policy"], 
       ["Terms of Service", "/terms"], 
       ["Cookie Policy", "/cookies"],
       ["Support Center", "/support"],
       ["System Status", "/status"]
     ] 
   },
 ];
 
 export default function Footer() {
   return (
     <footer className="border-t border-border bg-surface/40">
       <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
         <div className="lg:col-span-2 space-y-6">
           <Logo />
           <p className="max-w-xs text-sm leading-relaxed text-muted">
             Nidaan+ is a clinical-grade AI-powered multi-disease prediction and triage platform. Informational only, not a substitute for professional medical advice.
           </p>
           <div className="flex items-center gap-4 text-muted">
             <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Twitter"><Twitter size={18} /></a>
             <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="LinkedIn"><Linkedin size={18} /></a>
             <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="GitHub"><Github size={18} /></a>
             <a href="#" className="hover:text-primary transition-colors duration-200" aria-label="Status"><Activity size={18} /></a>
           </div>
         </div>
 
         {cols.map((col) => (
           <div key={col.title} className="space-y-4">
             <h4 className="text-xs font-semibold uppercase tracking-wider text-text">{col.title}</h4>
             <ul className="space-y-2.5">
               {col.links.map(([label, href]) => (
                 <li key={href}>
                   <Link href={href} className="text-sm text-muted hover:text-primary transition-colors duration-200 inline-block hover:underline underline-offset-4 decoration-primary/40">
                     {label}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
         ))}
 
         <div className="col-span-1 md:col-span-2 lg:col-span-5 border-t border-border/60 pt-8 mt-4">
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center">
             <div>
               <h4 className="text-sm font-semibold text-text">Subscribe to our newsletter</h4>
               <p className="text-xs text-muted mt-1">Get clinical AI updates and preventative health insights.</p>
             </div>
             <form className="flex gap-2 w-full max-w-md md:ml-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-1 min-w-0 rounded-xl border border-border bg-bg/50 px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                 required
               />
               <button 
                 type="submit" 
                 className="rounded-xl bg-primary hover:bg-primary-light px-5 py-2 text-sm font-semibold text-bg transition-all duration-200"
               >
                 Subscribe
               </button>
             </form>
           </div>
         </div>
       </Container>
 
       <div className="border-t border-border py-6 text-center text-xs text-muted">
         © {new Date().getFullYear()} Nidaan+. Built to medical-grade AI compliance specifications.
       </div>
     </footer>
   );
 }
