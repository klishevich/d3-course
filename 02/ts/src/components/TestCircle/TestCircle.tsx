import React, { useEffect, useRef, useState } from "react";
import { createD3Chart } from "./createD3Chart";

export default function TestCircle() {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer && !chartContainer.hasChildNodes()) {
      const chartSvg = createD3Chart();
      chartContainer.append(chartSvg);
    }
  }, []);
  return (
    <div style={{ margin: 20 }}>
      <div>Test Circle</div>
      <div ref={chartDivRef} />
    </div>
  );
}
