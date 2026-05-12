"use client";

import { useEffect, useRef, useState } from "react";

type ChartDimensions = {
  width: number;
  height: number;
};

const MIN_READY_DIMENSION = 24;

export function useChartDimensions<T extends HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const node = ref.current;
    if (!node) return;
    let frameId = 0;

    const updateDimensions = () => {
      const rect = node.getBoundingClientRect();
      const nextWidth = Math.round(rect.width);
      const nextHeight = Math.round(rect.height);

      setDimensions((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : {
              width: nextWidth > 0 ? nextWidth : 0,
              height: nextHeight > 0 ? nextHeight : 0,
            },
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateDimensions);
    };

    scheduleUpdate();

    const observer = new ResizeObserver(() => {
      scheduleUpdate();
    });

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return {
    ref,
    mounted,
    width: dimensions.width,
    height: dimensions.height,
    ready:
      mounted &&
      dimensions.width >= MIN_READY_DIMENSION &&
      dimensions.height >= MIN_READY_DIMENSION,
  };
}
