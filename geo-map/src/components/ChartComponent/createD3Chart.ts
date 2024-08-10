import * as d3 from "d3";
import { ChartState } from "./ChartState";
import { TCoinRecord } from "./TCoinDataSet";
import { IChartApi } from "./IChartApi";
import { dateFormatter } from "./dateFormatter";
import { ECurrency } from "./ECurrency";
import { EIndicator } from "./EIndicator";
import { worldGeojson } from "./worldGeojson";
import { koreaGeoJson } from "./koreaGeoJson";
import { TGeoJsonDto } from "./TGeoJsonDto";

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
  data: TGeoJsonDto,
  chartWidth: number,
  chartHeight: number
): void {
  const width = chartWidth;
  const height = chartHeight;
  // Mercator Projection represents North as Up and South as Down
  const projection = d3.geoMercator();// geoEqualEarth();
  const bb = data;
  // projection.fitSize([width, height], bb);
  projection.fitExtent([[-width, -height], [2*width, 2*height]], bb);
  const currentScale = projection.scale();
  console.log('currentScale', currentScale);
  const currentCenter = projection.center();
  console.log('currentCenter', currentCenter);
  // projection.scale(currentScale * 0.95);
  const geoGenerator = d3.geoPath().projection(projection);

  g.append('g').selectAll('path').data(bb.features).join('path').attr('d', geoGenerator)
  .attr('fill', '#088')
  .attr('stroke', '#000');

  const zoomFn = d3.zoom()
  .on("zoom", () => {
    console.log('zooming');
    // @ts-ignore
    const currentZoomLevel: number = d3.zoomTransform(g).k;
    console.log('d3.zoomTransform(g).k', currentZoomLevel); // get current zoom state             
    // projection.scale(currentZoomLevel*2); // set scale and translate of projection.

    // // redraw the features
    // const geoGenerator = d3.geoPath().projection(projection);
    // g.append('g').selectAll('path').data(bb.features).join('path').attr('d', geoGenerator)
  })

  // @ts-ignore
  g.call(zoomFn);
  
  // return { chartState, xAxisGroupSelection, yAxisGroupSelection, lineChartSelection };
}

export function createD3Chart(width: number): IChartApi {
  const SVG_WIDTH = width;
  const SVG_HEIGHT = 600;
  const MARGIN = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

  const svg = d3
    .create("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("style", "border:1px solid lightgrey");

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  // g.append("text")
  //   .attr("class", "x-axis-label")
  //   .attr("x", CHART_WIDTH / 2)
  //   .attr("y", SVG_HEIGHT - 20)
  //   .attr("font-size", "20px")
  //   .attr("text-anchor", "middle")
  //   .text("Time");

  // g.append("text")
  //   .attr("class", "y-axis-label")
  //   .attr("x", -(CHART_HEIGHT / 2))
  //   .attr("y", -60)
  //   .attr("font-size", "20px")
  //   .attr("text-anchor", "middle")
  //   .attr("transform", "rotate(-90)")
  //   .text("Price (USD)");

  // const data: Array<TCoinRecord> = [
  //   {
  //     vol24: 907370,
  //     date: 100_000_000_000,
  //     market_cap: 210990735,
  //     price_usd: 0.00727824
  //   },
  //   {
  //     vol24: 1304130,
  //     date: 200_000_000_000,
  //     market_cap: 245920175,
  //     price_usd: 0.00848315
  //   },
  //   {
  //     vol24: 870794,
  //     date: 300_000_000_000,
  //     market_cap: 260645167,
  //     price_usd: 0.00844021
  //   }
  // ];

  const data = koreaGeoJson;

  const res = initializeChart(g, data, CHART_WIDTH, CHART_HEIGHT);

  const onUpdateChart = () => {
    console.log("onUpdateChart");
  };

  return {
    svg: svg.node()!,
    updateChart: onUpdateChart
  };
}
