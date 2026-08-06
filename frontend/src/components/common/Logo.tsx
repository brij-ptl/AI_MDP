import Link from "next/link";
import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`logo select-none ${className || ''}`}>
      <svg 
        className="mark-svg" 
        viewBox="0 0 64 64" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crescent */}
        <path d="M32 4 C 12 4 4 20 4 32 C 4 48 16 60 32 60 C 20 60 8 48 8 32 C 8 20 18 8 32 4 Z" fill="currentColor" />
        
        {/* Dot */}
        <circle cx="38" cy="20" r="6" fill="currentColor" />
        
        {/* Leaf Outline */}
        <path d="M28 56 C 24 36 38 24 58 26 C 60 42 46 56 28 56 Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        
        {/* Leaf Vein */}
        <path d="M28 56 C 36 46 48 36 58 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      Nidaan+
    </Link>
  );
}
