import Link from "next/link";
//import ThemeToggle from "@/components/common/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-radial px-4 py-12">
      <div className="w-full max-w-[850px]">

        <div className="flex items-center gap-4">
          {/* <ThemeToggle /> */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
