import * as d3 from "d3";
import { ICountryInfo, IYearInfo } from "./loadData";
import { ITooltipMethods } from "./createTooltip";

export interface IChartApi {
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setContinentFilter: (continent: string) => void;
  setYear: (year: number) => void;
  svg: SVGSVGElement;
}

export const DEFAULT_OPACITY = 0.7;
export const ALL_CONTINENTS = "all";

export class ChartState {
  public isRunning: boolean = false;
  public year: number = 1800;
  public continentFilter: string = ALL_CONTINENTS;
}

export function createD3Chart(
  data: IYearInfo[],
  tooptipMethods: ITooltipMethods,
  setStateFn: (v: ChartState) => void
): IChartApi {
  const SVG_WIDTH = 1200;
  const SVG_HEIGHT = 700;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 60 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
  const START_YEAR = 1800;
  const { mouseleave, mousemove, mouseover } = tooptipMethods;
  let currentContinentFilter = ALL_CONTINENTS;

  let currentStep = 0;
  let intervalToken: d3.Timer | undefined;

  const svg = d3
    .create("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("style", "border:1px solid lightgrey");

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  g.append("text")
    .attr("class", "x-axis-label")
    .attr("x", CHART_WIDTH / 2)
    .attr("y", SVG_HEIGHT - 20)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");

  g.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(CHART_HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy (Years)");

  const yearLabel = g
    .append("text")
    .attr("class", "x-axis-year-label")
    .attr("x", CHART_WIDTH)
    .attr("y", CHART_HEIGHT - 20)
    .attr("font-size", "60px")
    .attr("text-anchor", "end")
    .style("fill", "darkGrey");

  const xLogScale = d3.scaleLog([100, 150_000], [0, CHART_WIDTH]);
  const xAxisGroup = g.append("g").attr("class", "xAxis").attr("transform", `translate(0, ${CHART_HEIGHT})`);
  const xAxisCall = d3
    .axisBottom(xLogScale)
    .tickValues([400, 4_000, 40_000])
    .tickFormat((d) => `$ ${d.toLocaleString()}`);
  xAxisGroup.call(xAxisCall).selectAll("text").attr("text-anchor", "middle");

  const yLinearScale = d3.scaleLinear().domain([0, 90]).range([CHART_HEIGHT, 0]);
  const yAxisGroup = g.append("g").attr("class", "yAxis");
  const yAxisCall = d3.axisLeft(yLinearScale).ticks(5);
  yAxisGroup.call(yAxisCall);

  const continentList = ["africa", "asia", "americas", "europe"];
  const rangeList = ["RED", "ORANGE", "BLUE", "GREEN", "GREEN", "GREY"];
  const continentColorScale = d3.scaleOrdinal().domain(continentList).range(rangeList);

  const legend = g.append("g").attr("transform", `translate(${CHART_WIDTH - 10}, ${CHART_HEIGHT - 150})`);
  continentList.forEach((continent, index) => {
    const legendRow = legend.append("g").attr("transform", `translate(0, ${index * 20})`);

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", continentColorScale(continent) as string);

    legendRow
      .append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text(continent);
  });

  const updateStateFn = () => {
    const newState: ChartState = {
      isRunning: intervalToken !== undefined,
      year: currentStep + START_YEAR,
      continentFilter: currentContinentFilter
    };
    setStateFn(newState);
  };

  const updateInternalFn = (yearInfo: IYearInfo, continentFilter: string): void => {
    const { year, countries } = yearInfo;
    const filteredCountries =
      continentFilter !== ALL_CONTINENTS ? countries.filter((c) => c.continent === continentFilter) : countries;
    // JOIN new data with old elements
    const circles = g.selectAll("circle").data(filteredCountries, (d) => (d as ICountryInfo).country);

    // EXIT old element not present in new data
    circles.exit().remove();

    // UPDATE old elements present in new data
    circles
      .transition()
      .delay(100)
      .attr("cx", (d): number => xLogScale(d.income)!)
      .attr("cy", (d) => yLinearScale(d.life_exp))
      .attr("r", calcCircleRadius);

    // ENTER new elements present in new data
    circles
      .enter()
      .append("circle")
      .attr("cx", (d): number => xLogScale(d.income)!)
      .attr("cy", (d) => yLinearScale(d.life_exp))
      .attr("r", calcCircleRadius)
      .style("fill", (d) => continentColorScale(d.continent) as string)
      .style("opacity", DEFAULT_OPACITY)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    yearLabel.text(year);
  };

  const nextStepFn = (): void => {
    currentStep++;
    if (currentStep >= data.length) {
      currentStep = 0;
    }
    updateInternalFn(data[currentStep], currentContinentFilter);
    updateStateFn();
  };

  const startFn = (): void => {
    if (!intervalToken) {
      intervalToken = d3.interval(nextStepFn, 100);
    }
    updateStateFn();
  };

  const stopInternalFn = (): void => {
    if (intervalToken) {
      intervalToken.stop();
      intervalToken = undefined;
    }
  };

  const stopFn = (): void => {
    stopInternalFn();
    updateStateFn();
  };

  const resetFn = (): void => {
    stopInternalFn();
    currentStep = 0;
    currentContinentFilter = ALL_CONTINENTS;
    updateInternalFn(data[currentStep], currentContinentFilter);
    updateStateFn();
  };

  const prevStepFn = (): void => {
    currentStep--;
    if (currentStep < 0) {
      currentStep = data.length - 1;
    }
    updateInternalFn(data[currentStep], currentContinentFilter);
    updateStateFn();
  };

  const setContinentFilterFn = (val: string) => {
    currentContinentFilter = val;
    if (!intervalToken) {
      updateInternalFn(data[currentStep], currentContinentFilter);
    }
    updateStateFn();
  };

  const setYearFn = (year: number) => {
    currentStep = year - START_YEAR;
    if (!intervalToken) {
      updateInternalFn(data[currentStep], currentContinentFilter);
    }
    updateStateFn();
  };

  // Initial update
  updateInternalFn(data[currentStep], currentContinentFilter);

  return {
    svg: svg.node()!,
    next: nextStepFn,
    start: startFn,
    stop: stopFn,
    reset: resetFn,
    prev: prevStepFn,
    setContinentFilter: setContinentFilterFn,
    setYear: setYearFn
  };
}

function calcCircleRadius(d: ICountryInfo): number {
  return Math.sqrt(d.population) / 500;
}
