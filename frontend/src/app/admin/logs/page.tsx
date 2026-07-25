export default function LogsAdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">System Logs</h1>
      <p className="mt-2 text-sm text-muted">Audit trail of admin actions and system events.</p>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
        No data yet — connect the logs admin service to populate this view.
      </div>
    </div>
  );
}
