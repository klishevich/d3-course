import React, { useEffect, useRef } from "react";
import { loadData } from "./loadData";
import { createD3Chart } from "./createD3Chart";

export default function UpdatePattern() {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadData();
        console.log("data", data);
        const chartSvg = createD3Chart(data);
        if (chartContainer.hasChildNodes()) chartContainer.innerHTML = "";
        chartContainer.append(chartSvg);
      })();
    }
  }, []);
  return (
    <div>
      <div ref={chartDivRef} />
    </div>
  );
}
