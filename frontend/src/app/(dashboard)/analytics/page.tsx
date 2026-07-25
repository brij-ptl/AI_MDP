"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardTopbar from "@/components/layout/DashboardTopbar";

const data = [
  { month: "Jan", risk: 0 }, { month: "Feb", risk: 0 }, { month: "Mar", risk: 0 },
  { month: "Apr", risk: 0 }, { month: "May", risk: 0 }, { month: "Jun", risk: 0 },
];

export default function AnalyticsPage() {
  return (
    <>
      <DashboardTopbar title="Health Analytics" />
      <div className="p-6 lg:p-10">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="mb-4 font-semibold">Average risk score trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
                <XAxis dataKey="month" stroke="rgb(var(--color-muted))" />
                <YAxis stroke="rgb(var(--color-muted))" />
                <Tooltip contentStyle={{ background: "rgb(var(--color-surface))", border: "1px solid rgb(var(--color-border))" }} />
                <Line type="monotone" dataKey="risk" stroke="rgb(var(--color-primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-muted">Run predictions regularly to build your personal risk trendline.</p>
        </div>
      </div>
    </>
  );
}
