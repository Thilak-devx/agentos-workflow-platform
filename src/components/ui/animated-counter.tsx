"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  formatter?: (value: number) => string;
  className?: string;
};

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 650,
  formatter,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousTarget = useRef(value);

  useEffect(() => {
    let frameId = 0;
    const startValue = previousTarget.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * eased;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        previousTarget.current = value;
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, value]);

  const output = useMemo(() => {
    if (formatter) {
      return formatter(displayValue);
    }

    return `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
  }, [decimals, displayValue, formatter, prefix, suffix]);

  return <span className={className}>{output}</span>;
}
