import * as d3 from "d3";

export function createD3Chart(): SVGSVGElement {
  const data = [25, 20, 10, 12, 15];

  const svg = d3.create("svg").attr("width", 800).attr("height", 400);
  const circles = svg.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .attr("cx", (_d: number, i: number): number => 100 + 100 * i)
    .attr("cy", 250)
    .attr("r", (r: number) => r)
    .attr("fill", "red");
  return svg.node()!;
}
