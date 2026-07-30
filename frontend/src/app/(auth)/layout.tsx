import Link from "next/link";
//import ThemeToggle from "@/components/common/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative bg-bg">
      <Link href="/" className="back-home">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      {children}
    </div>
  );
}
