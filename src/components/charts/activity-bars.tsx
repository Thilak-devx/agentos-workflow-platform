"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { useChartDimensions } from "@/components/charts/use-chart-dimensions";
import { cn } from "@/lib/utils";

type ActivityBar = {
  label: string;
  value: number;
};

type ActivityBarsProps = {
  data: ActivityBar[];
  className?: string;
};

export function ActivityBars({ data, className }: ActivityBarsProps) {
  const { ref, ready, width, height } =
    useChartDimensions<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-[120px] min-w-full overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-2.5 sm:p-3",
        "h-44 sm:h-48 lg:h-52",
        className,
      )}
    >
      {!ready ? (
        <div className="h-full w-full animate-pulse rounded-[22px] bg-white/[0.03]" />
      ) : null}
      {ready ? (
        <BarChart
          width={width}
          height={height}
          data={data}
          barCategoryGap={18}
          margin={{ top: 6, right: 8, bottom: 2, left: 8 }}
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 11 }}
            interval={0}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis hide width={0} domain={[0, 100]} />
          <Bar
            dataKey="value"
            radius={[18, 18, 18, 18]}
            animationDuration={700}
          >
            {data.map((item, index) => (
              <Cell
                key={item.label}
                fill={
                  index % 3 === 0
                    ? "rgba(125,211,252,0.9)"
                    : index % 3 === 1
                      ? "rgba(110,231,183,0.82)"
                      : "rgba(196,181,253,0.8)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      ) : null}
    </div>
  );
}
