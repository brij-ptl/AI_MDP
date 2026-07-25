export default function DashboardAdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Platform-wide KPIs: active users, predictions run, revenue, and model health.</p>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
        No data yet — connect the dashboard admin service to populate this view.
      </div>
    </div>
  );
}
