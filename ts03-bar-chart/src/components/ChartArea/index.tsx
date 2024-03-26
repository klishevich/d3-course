import React, { useEffect, useRef, useState } from "react";
import { loadDataJSON } from "./loadData";
import { createD3Chart } from "./createD3Chart";

export default function ChartArea() {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadDataJSON();
        console.log("data", data);
        const chartSvg = createD3Chart(data);
        if (chartContainer.hasChildNodes()) {
          chartContainer.innerHTML = "";
        }
        chartContainer.append(chartSvg);
      })();
    }
  }, []);
  return (
    <div>
      <h2>Chart Area</h2>
      <div ref={chartDivRef} />
    </div>
  );
}
