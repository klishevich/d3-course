import React, { useEffect, useRef } from "react";
import setupD3 from "./setupD3";

export default function LinePlot() {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootDiv = chartDivRef.current;
    if (rootDiv && !rootDiv.hasChildNodes()) {
      setupD3(chartDivRef.current);
    }
  });
  return (
    <div style={{ margin: 20 }}>
      <div>Line Chart Div</div>
      <div ref={chartDivRef} />
    </div>
  );
}
