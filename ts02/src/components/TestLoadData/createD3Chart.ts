import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const svg = d3.create("svg").attr("width", 800).attr("height", 400);
  const circles = svg.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .attr("cx", (_d, i: number): number => 100 + 100 * i)
    .attr("cy", 250)
    .attr("r", (d) => 2 * d.age)
    .attr("fill", (d) => (d.name === "Andrew" ? "red" : "blue"));
  return svg.node()!;
}
