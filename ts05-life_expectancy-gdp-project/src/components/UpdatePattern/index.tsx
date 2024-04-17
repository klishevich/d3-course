import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import { loadData } from "./loadData";
import { IChartApi, createD3Chart } from "./createD3Chart";
import { createTooltip } from "./createTooltip";

export default function UpdatePattern() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [chartApi, setChartApi] = useState<IChartApi>();
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadData();
        console.log("data", data);
        if (chartContainer.hasChildNodes()) chartContainer.innerHTML = "";
        const tooltipMethods = createTooltip(chartContainer);
        const chartApi$ = createD3Chart(data, tooltipMethods);
        chartContainer.append(chartApi$.svg);
        setChartApi(chartApi$);
      })();
    }
  }, []);

  const handleToggle = (): void => {
    if (isRunning) {
      chartApi?.stop();
    } else {
      chartApi?.start();
    }
    setIsRunning(!isRunning);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Life Expectancy vs GDP visualization
      </Typography>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button onClick={handleToggle}>Start / Stop</Button>
        <Button onClick={chartApi?.prev}>Prev</Button>
        <Button onClick={chartApi?.next}>Next</Button>
        <Button onClick={chartApi?.reset}>Reset</Button>
      </ButtonGroup>
      <div style={{ marginTop: 10 }} ref={chartDivRef} />
    </div>
  );
}
