import React, { useEffect, useRef, useState } from "react";
import { loadAndParseData } from "./loadAndParseData";
import { createD3Chart } from "./createD3Chart";
import { getGuid } from "../utils/uuidv4";

export default function LinePlot() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [guid] = useState(getGuid());

  useEffect(() => {
    const controller = new AbortController();
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadAndParseData("./aapl.csv", controller.signal);
        const chartSvg = createD3Chart(data);
        chartContainer.append(chartSvg);
      })();
    }
    return () => controller.abort();
  }, []);
  return (
    <div style={{ margin: 20 }}>
      <div>Line Chart Div</div>
      <div id={guid} ref={chartDivRef} />
    </div>
  );
}
