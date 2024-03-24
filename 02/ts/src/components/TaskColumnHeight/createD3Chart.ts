import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const svg = d3.create("svg").attr("width", 800).attr("height", 400);
  const circles = svg.selectAll("circle").data(data);

  circles
    .enter()
    .append("rect")
    .attr("x", (_d, i: number): number => 50 * i)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", (d) => d.height)
    .attr("stroke", "black")
    .attr("fill", "darkgrey");
  return svg.node()!;
}
