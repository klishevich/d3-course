import * as d3 from "d3";
import { ChartState } from "./ChartState";
import { TCoinDataSet, TCoinRecord } from "./TCoinDataSet";
import { IChartApi } from "./IChartApi";

export const DEFAULT_OPACITY = 0.7;
export const ALL_CONTINENTS = "all";

export function createD3Chart(data: TCoinDataSet, width: number, setStateFn: (v: ChartState) => void): IChartApi {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = 700;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 60 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
  const START_YEAR = 1800;

  const chartState = new ChartState();

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
    .text("Time");

  g.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(CHART_HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Price (USD)");

  const currencyData = data[chartState.currency];

  let xMin = Number.MAX_VALUE;
  let xMax = Number.MIN_VALUE;
  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;

  currencyData.forEach((r) => {
    if (r.date) {
      const date$ = r.date;
      if (date$ < xMin) xMin = date$;
      if (date$ > xMax) xMax = date$;
      const val = r[chartState.indicator];
      if (val < yMin) yMin = val;
      if (val > yMax) yMax = val;
    }
  });

  const xLinearScale = d3.scaleLinear([xMin, xMax], [0, CHART_WIDTH]);
  const xAxisGroup = g.append("g").attr("class", "xAxis").attr("transform", `translate(0, ${CHART_HEIGHT})`);
  const xAxisCall = d3.axisBottom(xLinearScale).tickFormat((d) => new Date(d as number).toLocaleDateString());
  xAxisGroup.call(xAxisCall).selectAll("text").attr("text-anchor", "middle");

  const yLinearScale = d3.scaleLinear().domain([yMin, yMax]).range([CHART_HEIGHT, 0]);
  const yAxisGroup = g.append("g").attr("class", "yAxis");
  const yAxisCall = d3.axisLeft(yLinearScale).ticks(5);
  yAxisGroup.call(yAxisCall);

  const lineChart = d3.line().x(d => xLinearScale(d[0])).y(d => yLinearScale(d[1]));
  const dataForLineChart = currencyData.map(e => [e.date, e.price_usd]) as [number, number][];

  g.append("path")
  .datum(dataForLineChart)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", lineChart)

  return {
    svg: svg.node()!,
    selectCurrency: () => {},
    selectIndicator: () => {},
    setMinMax: () => {}
  };
}
