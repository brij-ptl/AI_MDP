import DashboardTopbar from "@/components/layout/DashboardTopbar";

export default function NotificationsPage() {
  return (
    <>
      <DashboardTopbar title="Notifications" />
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
          You're all caught up — no new notifications.
        </div>
      </div>
    </>
  );
}
