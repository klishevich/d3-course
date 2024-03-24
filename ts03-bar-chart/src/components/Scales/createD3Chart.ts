import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const WIDTH = 600;
  const svg = d3.create("svg").attr("width", WIDTH).attr("height", 400);
  const circles = svg.selectAll("circle").data(data);

  const yDomain = d3.extent(data, (d: IDataPoint) => d.height) as [
    number,
    number,
  ];
  const yLinearScale = d3.scaleLinear().domain(yDomain).range([0, 400]);
  console.log("yLinearScale.invert(800)", yLinearScale.invert(390));

  const yLogScale = d3
    .scaleLog()
    .domain([10, d3.max(data, (d: IDataPoint) => d.height) as number])
    .range([0, 400])
    .base(10);

  const yTimeScale = d3
    .scaleTime()
    .domain([Date.UTC(2024, 0, 1), Date.UTC(2024, 1, 1)])
    .range([0, 100]);
  console.log(
    "yTimeScale(Date.UTC(2024, 0, 7))",
    yTimeScale(Date.UTC(2024, 0, 7)),
  );
  console.log(
    "yTimeScale.invert(70).toUTCString()",
    yTimeScale.invert(70).toUTCString(),
  );

  const domainList = ["AFRICA", "EUROPE", "AMERICA", "ASIA"];
  const rangeList = ["RED", "GREEN", "BLUE", "ORANGE", "GREEN"];
  const yOrdinalScale = d3.scaleOrdinal().domain(domainList).range(rangeList);
  console.log("yOrdinalScale(AFRICA)", yOrdinalScale("AFRICA"));
  console.log("yOrdinalScale(ASIA)", yOrdinalScale("ASIA"));
  console.log("yOrdinalScale(ASIA2)", yOrdinalScale("ASIA2"));
  console.log("yOrdinalScale(ASIA22)", yOrdinalScale("ASIA22"));

  const buildingsArray = data.map((e) => e.name);
  console.log("buildingsArray", buildingsArray);
  const xBarChartBandScale = d3
    .scaleBand()
    .domain(buildingsArray)
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);
  // console.log('xBarChartBandScale(AFRICA)', xBarChartBandScale('AFRICA'));
  // console.log('xBarChartBandScale(AMERICA)', xBarChartBandScale('AMERICA'));
  // console.log('xBarChartBandScale(AMERICA2)', xBarChartBandScale('AMERICA2'));
  // console.log('xBarChartBandScale.bandwidth()', xBarChartBandScale.bandwidth());
  const width = xBarChartBandScale.bandwidth;

  circles
    .enter()
    .append("rect")
    .attr("x", (d): number => xBarChartBandScale(d.name)!)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", (d) => yLogScale(d.height))
    .attr("stroke", "black")
    .attr("fill", "darkgrey")
    .style("stroke-width", 2) 
  return svg.node()!;
}
