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

export default function ChartComponent() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [chartApi, setChartApi] = useState<IChartApi>();
  const [chartState, setChartState] = useState(new ChartState());

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadData();
        console.log('data', data);
        if (chartContainer.hasChildNodes()) chartContainer.innerHTML = "";
        const width = chartContainer.offsetWidth;
        const chartApi$ = createD3Chart(data, width, setChartState);
        chartContainer.append(chartApi$.svg);
        setChartApi(chartApi$);
      })();
    }
  }, []);


  const handleCurrencyChange = (event: SelectChangeEvent) => {
    const newVal = event.target.value as ECurrency;
    chartApi?.selectCurrency(newVal);
  };

  const handleIndicatorChange = (event: SelectChangeEvent) => {
    const newVal = event.target.value as EIndicator;
    chartApi?.selectIndicator(newVal);
  };

  const handleSliderChange = (_e: Event, value: number | number[]) => {
    const [min, max] = value as number[];
    chartApi?.setMinMax(min, max);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Crypto Line Chart
      </Typography>
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: 10 }}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={chartState.currency}
                label="Currency"
                onChange={handleCurrencyChange}
              >
                {currencyArray.map(e => <MenuItem key={e[1]} value={e[1]}>`${e[0]}`</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div style={{ marginLeft: 10 }}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="indicator-select-label">Indicator</InputLabel>
              <Select
                labelId="indicator-select-label"
                id="indicator-select"
                value={chartState.indicator}
                label="Indicator"
                onChange={handleIndicatorChange}
              >
                {indicatorArray.map(e => <MenuItem key={e[1]} value={e[1]}>`${e[0]}`</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div style={{ marginLeft: 20, paddingTop: 10 }}>
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Period"
              value={[chartState.dateMin, chartState.dateMax]}
              valueLabelDisplay="on"
              step={1}
              min={chartState.dateMin}
              max={chartState.dateMax}
              onChange={handleSliderChange}
            />
          </Box>
        </div>
      </div>
      <div style={{ marginTop: 10 }} ref={chartDivRef} />
    </div>
  );
}
