import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
  const svg = d3
    .create("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("style", "border:1px solid black");

  const g = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  const yDomain = d3.extent(data, (d: IDataPoint) => d.height) as [
    number,
    number,
  ];
  const yLinearScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([0, CHART_HEIGHT]);

  const buildingsArray = data.map((e) => e.name);
  const xBarChartBandScale = d3
    .scaleBand()
    .domain(buildingsArray)
    .range([0, CHART_WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const rects = g.selectAll("rect").data(data);
  rects
    .enter()
    .append("rect")
    .attr("x", (d): number => xBarChartBandScale(d.name)!)
    .attr("y", 0)
    .attr("width", xBarChartBandScale.bandwidth)
    .attr("height", (d) => yLinearScale(d.height))
    .attr("stroke", "black")
    .attr("fill", "darkgrey")
    .style("stroke-width", 2);
  return svg.node()!;
}
