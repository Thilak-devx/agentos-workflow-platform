"use client";

import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useChartDimensions } from "@/components/charts/use-chart-dimensions";
import { TreasuryAllocationSlice } from "@/features/treasury/types";

const COLORS = [
  "rgba(125,211,252,0.88)",
  "rgba(110,231,183,0.85)",
  "rgba(196,181,253,0.82)",
  "rgba(248,250,252,0.42)",
];

type TreasuryAllocationChartProps = {
  data: TreasuryAllocationSlice[];
};

export function TreasuryAllocationChart({
  data,
}: TreasuryAllocationChartProps) {
  const { ref, ready, width, height } =
    useChartDimensions<HTMLDivElement>();

  return (
    <div ref={ref} className="h-44 min-h-[120px] min-w-full overflow-hidden">
      {!ready ? (
        <div className="h-full w-full animate-pulse rounded-[22px] bg-white/[0.03]" />
      ) : null}
      {ready ? (
        <PieChart width={width} height={height}>
          <Pie
            data={data}
            dataKey="amountUsd"
            nameKey="label"
            innerRadius={42}
            outerRadius={68}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            paddingAngle={2}
            animationDuration={650}
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(8,12,22,0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              color: "white",
            }}
            formatter={(value) => [
              `$${Number(value ?? 0).toLocaleString()}`,
              "Allocated",
            ]}
          />
        </PieChart>
      ) : null}
    </div>
  );
}
