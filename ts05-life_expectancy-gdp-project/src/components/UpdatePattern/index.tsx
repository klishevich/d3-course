import React, { useEffect, useRef } from "react";
import { loadData } from "./loadData";
import { createD3Chart } from "./createD3Chart";
import { createTooltip } from "./createTooltip";

export default function UpdatePattern() {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadData();
        console.log("data", data);
        if (chartContainer.hasChildNodes()) chartContainer.innerHTML = "";
        const tooltipMethods = createTooltip(chartContainer);
        const chartSvg = createD3Chart(data, tooltipMethods);
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
