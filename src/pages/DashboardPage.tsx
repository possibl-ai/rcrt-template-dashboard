import { useState, useEffect } from 'react';
import { Package, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { getClient } from '../lib/api-client';

interface StatCard {
  label: string;
  value: number;
  icon: typeof Package;
  color: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClient()
      .queryBreadcrumbs({ limit: 50 })
      .then((data: any) => {
        setItems(Array.isArray(data) ? data : data?.breadcrumbs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = items.length;
  const active = items.filter((i) => i.tags?.includes('status:active')).length;
  const pending = items.filter((i) => i.tags?.includes('status:pending')).length;
  const completed = items.filter((i) => i.tags?.includes('status:completed')).length;

  const stats: StatCard[] = [
    { label: 'Total Items', value: total, icon: Package, color: 'text-primary' },
    { label: 'Active', value: active, icon: Activity, color: 'text-emerald-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-blue-500' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-6 pb-20 md:pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border p-4 bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn('w-4 h-4', stat.color)} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {loading ? '—' : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Activity</h3>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          )}
          <div className="space-y-2">
            {items.slice(0, 10).map((item, i) => (
              <div
                key={item.breadcrumb_id || i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{item.title || 'Untitled'}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {item.type || 'item'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
