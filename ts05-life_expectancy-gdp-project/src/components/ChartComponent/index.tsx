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
import { IChartApi, createD3Chart, ALL_CONTINENTS, ChartState } from "./createD3Chart";
import { createTooltip } from "./createTooltip";

export default function ChartComponent() {
  const chartDivRef = useRef<HTMLDivElement>(null);
  const [chartApi, setChartApi] = useState<IChartApi>();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [chartState, setChartState] = useState(new ChartState());

  useEffect(() => {
    const chartContainer = chartDivRef.current;
    if (chartContainer) {
      (async () => {
        const data = await loadData();
        if (chartContainer.hasChildNodes()) chartContainer.innerHTML = "";
        const tooltipMethods = createTooltip(chartContainer);
        const chartApi$ = createD3Chart(data, tooltipMethods, setChartState);
        chartContainer.append(chartApi$.svg);
        setChartApi(chartApi$);
      })();
    }
  }, []);

  const handleStartToggle = (): void => {
    if (isRunning) {
      chartApi?.stop();
    } else {
      chartApi?.start();
    }
    setIsRunning(!isRunning);
  };

  const handleContinentFilterChange = (event: SelectChangeEvent) => {
    const newVal = event.target.value as string;
    chartApi?.setContinentFilter(newVal);
  };

  const handleSliderChange = (_e: Event, value: number | number[]) => {
    chartApi?.setYear(value as number);
  };

  return (
    <div>
      <Typography variant="h2" gutterBottom>
        Life Expectancy vs GDP visualization
      </Typography>
      <div style={{ display: "flex" }}>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={handleStartToggle}>Start / Stop</Button>
          <Button onClick={chartApi?.prev}>Prev</Button>
          <Button onClick={chartApi?.next}>Next</Button>
          <Button onClick={chartApi?.reset}>Reset</Button>
        </ButtonGroup>
        <div style={{ marginLeft: 10 }}>
          <Box sx={{ minWidth: 200 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="continent-select-label">Continent</InputLabel>
              <Select
                labelId="continent-select-label"
                id="continent-select"
                value={chartState.continentFilter}
                label="Continent"
                onChange={handleContinentFilterChange}
              >
                <MenuItem value={ALL_CONTINENTS}>All</MenuItem>
                <MenuItem value="africa">Africa</MenuItem>
                <MenuItem value="americas">Americas</MenuItem>
                <MenuItem value="asia">Asia</MenuItem>
                <MenuItem value="europe">Europe</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div style={{ marginLeft: 20, paddingTop: 10 }}>
          <Box sx={{ width: 300 }}>
            <Slider
              aria-label="Year"
              value={chartState.year}
              valueLabelDisplay="on"
              step={1}
              min={1800}
              max={2014}
              onChange={handleSliderChange}
            />
          </Box>
        </div>
      </div>
      <div style={{ marginTop: 10 }} ref={chartDivRef} />
    </div>
  );
}
