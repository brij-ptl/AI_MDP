import DashboardSidebar from "@/components/layout/DashboardSidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <DashboardSidebar />
      <div className="flex-1 pb-24 lg:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
