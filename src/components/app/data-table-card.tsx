import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type Column<T> = {
  key: keyof T;
  label: string;
  className?: string;
};

type DataTableRow = {
  id: string;
} & Record<string, string>;

type DataTableCardProps<T extends DataTableRow> = {
  title: string;
  columns: Array<Column<T>>;
  rows: T[];
  emptyTitle?: string;
  emptyCopy?: string;
};

function toneForValue(value: string) {
  const lowered = value.toLowerCase();
  if (lowered.includes("active") || lowered.includes("healthy"))
    return "emerald";
  if (lowered.includes("paused") || lowered.includes("monitored"))
    return "violet";
  return "cyan";
}

export function DataTableCard<T extends DataTableRow>({
  title,
  columns,
  rows,
  emptyTitle = "No records available",
  emptyCopy = "New platform activity will appear here as workflows, agents, and treasury events begin syncing.",
}: DataTableCardProps<T>) {
  return (
    <GlassCard className="min-w-0 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">
            Live analysis
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
        </div>
        <Badge variant="cyan">{rows.length} items</Badge>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-white/6 bg-white/[0.02]">
        <div
          role="region"
          aria-label={`${title} table`}
          className="max-h-[360px] overflow-auto overscroll-contain"
        >
          {rows.length ? (
            <table className="w-full min-w-[680px] border-separate border-spacing-y-2 p-2">
              <thead>
                <tr className="sticky top-0 z-[1]">
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={cn(
                        "bg-[#0a1019]/92 px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-white/34 backdrop-blur-xl",
                        column.className,
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="group">
                    {columns.map((column) => {
                      const cell = row[column.key];
                      const isStatusish =
                        column.label.toLowerCase().includes("status") ||
                        column.label.toLowerCase().includes("health") ||
                        column.label.toLowerCase().includes("sync");

                      return (
                        <td
                          key={String(column.key)}
                          className={cn(
                            "bg-white/[0.04] px-4 py-4 text-sm text-white/78 transition duration-200 group-hover:bg-white/[0.055] first:rounded-l-[18px] last:rounded-r-[18px]",
                            column.className,
                          )}
                        >
                          {isStatusish ? (
                            <Badge variant={toneForValue(cell)}>{cell}</Badge>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-5 py-10 text-center sm:px-8">
              <p className="text-sm font-medium text-white">{emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/44">
                {emptyCopy}
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
