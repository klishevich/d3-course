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
  const [chartState, setChartState] = useState(new ChartState());

  useEffect(() => {
    const chartDiv = chartDivRef.current;
    if (chartDiv) {
      (async () => {
        const data = await loadData();
        if (chartDiv.hasChildNodes()) chartDiv.innerHTML = "";
        const width = chartDiv.offsetWidth;
        const chartApi$ = createD3Chart(data, width, setChartState);
        chartDiv.append(chartApi$.svg);
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
      {/* <Typography variant="h2" gutterBottom>
        Crypto Line Chart
      </Typography> */}
      <div style={{ paddingTop: 20 }}>
        <Box sx={{ width: "100%" }}>
          <Slider
            getAriaLabel={(index) => (index === 0 ? "Min" : "Max")}
            value={[chartState.curDateMin, chartState.curDateMax]}
            valueLabelDisplay="auto"
            step={1}
            min={chartState.dateMin}
            max={chartState.dateMax}
            onChange={handleSliderChange}
            valueLabelFormat={(val) => <span>{dateFormatter(val)}</span>}
          />
        </Box>
      </div>
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
                {currencyArray.map((e) => (
                  <MenuItem key={e[1]} value={e[1]}>
                    {e[0]}
                  </MenuItem>
                ))}
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
                {indicatorArray.map((e) => (
                  <MenuItem key={e[1]} value={e[1]}>
                    {e[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div style={{ marginTop: 10 }} ref={chartDivRef} />
    </div>
  );
}
