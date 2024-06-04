import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import { loadData } from "./loadData";
import { createD3Chart } from "./createD3Chart";
import { ChartState } from "./ChartState";
import { IChartApi } from "./IChartApi";
import { ECurrency, currencyArray } from "./ECurrency";
import { EIndicator, indicatorArray } from "./EIndicator";
import { dateFormatter } from "./dateFormatter";

export default function ChartComponent() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [chartApi, setChartApi] = useState<IChartApi>();
  // const [chartState, setChartState] = useState(new ChartState());

  useEffect(() => {
    const chartDiv = chartDivRef.current;
    if (chartDiv) {
      (async () => {
        // const data = await loadData();
        if (chartDiv.hasChildNodes()) chartDiv.innerHTML = "";
        const width = chartDiv.offsetWidth;
        const chartApi$ = createD3Chart(width);
        chartDiv.append(chartApi$.svg);
        setChartApi(chartApi$);
      })();
    }
  }, []);

  const handleUpdate = () => {
    chartApi?.updateChart();
  };

  return (
    <div>
      <div style={{ marginLeft: 10, marginTop: 10 }}>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={handleUpdate}>Update</Button>
        </ButtonGroup>
      </div>
      <div style={{ marginTop: 10 }} ref={chartDivRef} />
    </div>
  );
}
