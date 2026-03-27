import { useState, useEffect } from 'react';
import { Plus, ArrowUpDown } from 'lucide-react';
import { getClient } from '../lib/api-client';

type SortField = 'title' | 'status' | 'created_at';
type SortDir = 'asc' | 'desc';

export default function DataPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    const params: Record<string, any> = { limit: 100 };
    if (tagFilter.trim()) params.tags = [tagFilter.trim()];

    getClient()
      .queryBreadcrumbs(params)
      .then((data: any) => {
        setItems(Array.isArray(data) ? data : data?.breadcrumbs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tagFilter]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getStatus = (item: any): string => {
    const statusTag = (item.tags || []).find((t: string) => t.startsWith('status:'));
    return statusTag ? statusTag.replace('status:', '') : 'none';
  };

  const sorted = [...items].sort((a, b) => {
    let aVal: string, bVal: string;
    if (sortField === 'title') {
      aVal = (a.title || '').toLowerCase();
      bVal = (b.title || '').toLowerCase();
    } else if (sortField === 'status') {
      aVal = getStatus(a);
      bVal = getStatus(b);
    } else {
      aVal = a.created_at || '';
      bVal = b.created_at || '';
    }
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleNew = async () => {
    try {
      await getClient().createBreadcrumb({
        title: 'New Item',
        type: 'item',
        tags: ['status:pending'],
      });
      setLoading(true);
      const data = await getClient().queryBreadcrumbs({ limit: 100 });
      setItems(Array.isArray(data) ? data : (data as any)?.breadcrumbs || []);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Data</h2>
        <div className="flex items-center gap-2">
          <input
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Filter by tag..."
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm"
          >
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto pb-20 md:pb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {(['title', 'status', 'created_at'] as SortField[]).map((field) => (
                <th
                  key={field}
                  onClick={() => toggleSort(field)}
                  className="text-left px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {field === 'created_at' ? 'Created' : field.charAt(0).toUpperCase() + field.slice(1)}
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No items found.
                </td>
              </tr>
            )}
            {sorted.map((item, i) => (
              <tr key={item.breadcrumb_id || i} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 text-foreground">{item.title || 'Untitled'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={getStatus(item)} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    none: 'bg-muted text-muted-foreground',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.none}`}>
      {status}
    </span>
  );
}
