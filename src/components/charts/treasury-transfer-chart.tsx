"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartDimensions } from "@/components/charts/use-chart-dimensions";
import { TreasuryTransferPoint } from "@/features/treasury/types";

type TreasuryTransferChartProps = {
  data: TreasuryTransferPoint[];
};

export function TreasuryTransferChart({ data }: TreasuryTransferChartProps) {
  const { ref, ready, width, height } =
    useChartDimensions<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="h-64 min-h-[120px] min-w-full overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-3 sm:p-4"
    >
      {!ready ? (
        <div className="h-full w-full animate-pulse rounded-[22px] bg-white/[0.03]" />
      ) : null}
      {ready ? (
        <AreaChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="treasuryVolumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(110,231,183,0.35)" />
              <stop offset="100%" stopColor="rgba(110,231,183,0.02)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={42}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
            tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
          />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.12)" }}
            contentStyle={{
              background: "rgba(8,12,22,0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              color: "white",
            }}
            formatter={(value, name) =>
              name === "volumeUsd"
                ? [`$${Number(value ?? 0).toLocaleString()}`, "Volume"]
                : [Number(value ?? 0), "Transfers"]
            }
          />
          <Area
            type="monotone"
            dataKey="volumeUsd"
            stroke="rgba(110,231,183,0.85)"
            strokeWidth={2}
            fill="url(#treasuryVolumeFill)"
            animationDuration={700}
          />
          <Line
            type="monotone"
            dataKey="transfers"
            stroke="rgba(147,231,255,0.72)"
            strokeWidth={1.8}
            dot={false}
            animationDuration={820}
          />
        </AreaChart>
      ) : null}
    </div>
  );
}
