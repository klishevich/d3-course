import * as d3 from "d3";
import { ChartState } from "./ChartState";
import { TCoinDataSet, TCoinRecord } from "./TCoinDataSet";
import { IChartApi } from "./IChartApi";
import { dateFormatter } from "./dateFormatter";
import { ECurrency } from "./ECurrency";
import { EIndicator } from "./EIndicator";

export const DEFAULT_OPACITY = 0.7;
export const ALL_CONTINENTS = "all";

function calcMinMax(
  coinData: TCoinRecord[],
  indicator: EIndicator
): { xMin: number; xMax: number; yMin: number; yMax: number } {
  let xMin = Number.MAX_VALUE;
  let xMax = Number.MIN_VALUE;
  let yMin = Number.MAX_VALUE;
  let yMax = Number.MIN_VALUE;

  coinData.forEach((r) => {
    if (r.date) {
      const d = r.date;
      if (d < xMin) xMin = d;
      if (d > xMax) xMax = d;
      const val = r[indicator];
      if (val < yMin) yMin = val;
      if (val > yMax) yMax = val;
    }
  });

  return { xMin, xMax, yMin, yMax };
}

function updateXAxis(
  chartWidth: number,
  xAxisGroup: d3.Selection<SVGGElement, undefined, null, undefined>,
  xMin: number,
  xMax: number
): d3.ScaleLinear<number, number, never> {
  const xLinearScale = d3.scaleLinear([xMin, xMax], [0, chartWidth]);
  const xAxisCall = d3.axisBottom(xLinearScale).tickFormat((d) => dateFormatter(d as number));
  xAxisGroup.call(xAxisCall).selectAll("text").attr("text-anchor", "middle");
  return xLinearScale;
}

function updateYAxis(
  chartHeight: number,
  yAxisGroup: d3.Selection<SVGGElement, undefined, null, undefined>,
  yMin: number,
  yMax: number
): d3.ScaleLinear<number, number, never> {
  const yLinearScale = d3.scaleLinear().domain([yMin, yMax]).range([chartHeight, 0]);
  const yAxisCall = d3.axisLeft(yLinearScale).ticks(5);
  yAxisGroup.call(yAxisCall);
  return yLinearScale;
}

function updateLineChart(
  lineChartSelection: d3.Selection<SVGPathElement, undefined, null, undefined>,
  currencyData: TCoinRecord[],
  indicator: EIndicator,
  xLinearScale: d3.ScaleLinear<number, number, never>,
  yLinearScale: d3.ScaleLinear<number, number, never>
): void {
  const lineChart = d3
    .line()
    .x((d) => xLinearScale(d[0]))
    .y((d) => yLinearScale(d[1]));

  const dataForLineChart = currencyData.map((e) => [e.date, e[indicator]]) as [number, number][];

  lineChartSelection.datum(dataForLineChart).attr("d", lineChart);
}

function initializeChart(
  g: d3.Selection<SVGGElement, undefined, null, undefined>,
  data: TCoinDataSet,
  chartWidth: number,
  chartHeight: number
): {
  chartState: ChartState;
  xAxisGroupSelection: d3.Selection<SVGGElement, undefined, null, undefined>;
  yAxisGroupSelection: d3.Selection<SVGGElement, undefined, null, undefined>;
  lineChartSelection: d3.Selection<SVGPathElement, undefined, null, undefined>;
} {
  const currency = ECurrency.Bitcoin;
  const indicator = EIndicator.PriceUsd;

  const coinData = data[currency];

  const { xMin, xMax, yMin, yMax } = calcMinMax(coinData, indicator);

  const xAxisGroupSelection = g.append("g").attr("class", "xAxis").attr("transform", `translate(0, ${chartHeight})`);
  const xLinearScale = updateXAxis(chartWidth, xAxisGroupSelection, xMin, xMax);

  const yAxisGroupSelection = g.append("g").attr("class", "yAxis");
  const yLinearScale = updateYAxis(chartHeight, yAxisGroupSelection, yMin, yMax);

  const lineChartSelection = g
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5);
  updateLineChart(lineChartSelection, coinData, indicator, xLinearScale, yLinearScale);

  const chartState = new ChartState({
    indicator,
    currency,
    dateMin: xMin,
    dateMax: xMax,
    curDateMin: xMin,
    curDateMax: xMax,
    yMin,
    yMax
  });

  return { chartState, xAxisGroupSelection, yAxisGroupSelection, lineChartSelection };
}

export function createD3Chart(data: TCoinDataSet, width: number, setStateFn: (v: ChartState) => void): IChartApi {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = 600;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 60 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

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

  const res = initializeChart(g, data, CHART_WIDTH, CHART_HEIGHT);
  const { xAxisGroupSelection, yAxisGroupSelection, lineChartSelection } = res;
  let { chartState } = res;
  setStateFn(chartState);

  const onSetMinMax = (minDate: number, maxDate: number): void => {
    const { yMin, currency, indicator } = chartState;

    const coinData = data[currency].filter((v) => v.date > minDate && v.date < maxDate);
    const { yMax } = calcMinMax(coinData, chartState.indicator);
    const xLinearScale = updateXAxis(CHART_WIDTH, xAxisGroupSelection, minDate, maxDate);
    const yLinearScale = updateYAxis(CHART_HEIGHT, yAxisGroupSelection, yMin, yMax);
    
    updateLineChart(lineChartSelection, coinData, indicator, xLinearScale, yLinearScale);

    chartState = chartState.copy({ curDateMin: minDate, curDateMax: maxDate });
    setStateFn(chartState);
  };

  const onSelectCurrency = (currency: ECurrency) => {
    const { indicator } = chartState;

    const coinData = data[currency];
    const { xMin, xMax, yMin, yMax } = calcMinMax(coinData, chartState.indicator);
    const xLinearScale = updateXAxis(CHART_WIDTH, xAxisGroupSelection, xMin, xMax);
    const yLinearScale = updateYAxis(CHART_HEIGHT, yAxisGroupSelection, yMin, yMax);
    updateLineChart(lineChartSelection, coinData, indicator, xLinearScale, yLinearScale);

    chartState = chartState.copy({
      dateMin: xMin,
      dateMax: xMax,
      curDateMin: xMin,
      curDateMax: xMax,
      yMin,
      yMax,
      currency
    });
    setStateFn(chartState);
  };

  const onSelectIndicator = (indicator: EIndicator) => {
    const { currency } = chartState;

    const coinData = data[currency];
    const { xMin, xMax, yMin, yMax } = calcMinMax(coinData, indicator);
    const xLinearScale = updateXAxis(CHART_WIDTH, xAxisGroupSelection, xMin, xMax);
    const yLinearScale = updateYAxis(CHART_HEIGHT, yAxisGroupSelection, yMin, yMax);
    updateLineChart(lineChartSelection, coinData, indicator, xLinearScale, yLinearScale);

    chartState = chartState.copy({
      dateMin: xMin,
      dateMax: xMax,
      curDateMin: xMin,
      curDateMax: xMax,
      yMin,
      yMax,
      indicator
    });
    setStateFn(chartState);
  };

  return {
    svg: svg.node()!,
    selectCurrency: onSelectCurrency,
    selectIndicator: onSelectIndicator,
    setMinMax: onSetMinMax
  };
}
