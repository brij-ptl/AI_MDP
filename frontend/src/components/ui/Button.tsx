import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
}

export default function Button({ href, variant = "primary", className, children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-r from-primary to-secondary text-bg shadow-glow hover:opacity-90",
    outline: "border border-primary text-primary hover:bg-primary hover:text-bg",
    ghost: "text-text hover:text-primary",
  };
  const classes = cn(base, variants[variant], className);

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
