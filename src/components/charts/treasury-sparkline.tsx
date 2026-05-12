"use client";

import { Line, LineChart } from "recharts";
import { useChartDimensions } from "@/components/charts/use-chart-dimensions";

type TreasurySparklineProps = {
  values: number[];
};

export function TreasurySparkline({ values }: TreasurySparklineProps) {
  const { ref, ready, width, height } =
    useChartDimensions<HTMLDivElement>();
  const data = values.map((value, index) => ({ index, value }));

  return (
    <div ref={ref} className="h-10 w-20 min-w-[80px] overflow-hidden">
      {!ready ? (
        <div className="h-full w-full animate-pulse rounded-full bg-white/[0.03]" />
      ) : null}
      {ready ? (
        <LineChart width={width} height={height} data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgba(125,211,252,0.75)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      ) : null}
    </div>
  );
}
