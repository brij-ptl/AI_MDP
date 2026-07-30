"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ScrollReveal({ children, className = "", id }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`reveal ${className}`}>
      {children}
    </section>
  );
}
