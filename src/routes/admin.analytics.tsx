import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { analyticsData } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const cards = [
    { label: "Total Users", value: "12,438", delta: "+8.2%" },
    { label: "Listings", value: "3,481", delta: "+12.1%" },
    { label: "Messages", value: "184k", delta: "+22.4%" },
    { label: "Reviews", value: "9,712", delta: "+5.7%" },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-card border border-border p-5">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-black mt-1">{c.value}</div>
            <div className="text-xs text-success font-medium mt-1">{c.delta}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Chart title="User Growth"><LineChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
          <Line type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
        </LineChart></Chart>
        <Chart title="Listing Growth"><LineChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
          <Line type="monotone" dataKey="listings" stroke="var(--color-success)" strokeWidth={2.5} dot={false} />
        </LineChart></Chart>
        <Chart title="Message Activity"><BarChart data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
          <Bar dataKey="messages" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
        </BarChart></Chart>
        <Chart title="Reports"><BarChart data={analyticsData.map(d => ({ ...d, reports: Math.round(d.users / 40) }))}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
          <Bar dataKey="reports" fill="var(--color-warning)" radius={[8, 8, 0, 0]} />
        </BarChart></Chart>
      </div>
    </div>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="font-semibold mb-4">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
