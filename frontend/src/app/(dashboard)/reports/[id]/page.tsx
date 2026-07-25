import DashboardTopbar from "@/components/layout/DashboardTopbar";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <DashboardTopbar title={`Report #${id}`} />
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="text-sm text-muted">Report details will render here once predictions are stored via the backend Reports service.</p>
        </div>
      </div>
    </>
  );
}
