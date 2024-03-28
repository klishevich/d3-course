import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 120 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
  const svg = d3
    .create("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("style", "border:1px solid black");

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  // X Label
  g.append("text")
    .attr("class", "x-axis-label")
    .attr("x", CHART_WIDTH / 2)
    .attr("y", SVG_HEIGHT - 20)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("The worlds tallest buildings");

  // Y label
  g.append("text")
  .attr("class", "y-axis-label")
  .attr("x", - (CHART_HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Height (m)");

  const yDomainMax = d3.max(data, (d: IDataPoint) => d.height)!;
  const yLinearScale = d3.scaleLinear().domain([0, yDomainMax]).range([CHART_HEIGHT, 0]);

  const buildingsArray = data.map((e) => e.name);
  const xBarChartBandScale = d3
    .scaleBand()
    .domain(buildingsArray)
    .range([0, CHART_WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const xAxisCall = d3.axisBottom(xBarChartBandScale);
  g.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0, ${CHART_HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", 10)
    .attr("x", -6)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  const yAxisCall = d3
    .axisLeft(yLinearScale)
    .ticks(5)
    .tickFormat((d) => `${d} m`);
  g.append("g").attr("class", "yAxis").call(yAxisCall);

  const rects = g.selectAll("rect").data(data);
  rects
    .enter()
    .append("rect")
    .attr("x", (d): number => xBarChartBandScale(d.name)!)
    .attr("y", (d) => yLinearScale(d.height)) // Return Y value on the screen
    .attr("width", xBarChartBandScale.bandwidth)
    .attr("height", (d) => yLinearScale(0) - yLinearScale(d.height)) // Calculates the bar height
    .attr("stroke", "black")
    .attr("fill", "darkgrey")
    .style("stroke-width", 2);
  return svg.node()!;
}
