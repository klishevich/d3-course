import * as d3 from "d3";
import { IDataPoint } from "./loadData";

export function createD3Chart(data: IDataPoint[]): SVGSVGElement {
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 60 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
  let isRevenue = true;

  const svg = d3
    .create("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("style", "border:1px solid black");

  const g = svg.append("g").attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  g.append("text")
    .attr("class", "x-axis-label")
    .attr("x", CHART_WIDTH / 2)
    .attr("y", SVG_HEIGHT - 20)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Star Break Coffee Financial Indicators");

  const yLabel = g
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(CHART_HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

  const xBarChartBandScale = d3.scaleBand().range([0, CHART_WIDTH]).paddingInner(0.3).paddingOuter(0.2);
  const yLinearScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);
  const xAxisGroup = g.append("g").attr("class", "xAxis").attr("transform", `translate(0, ${CHART_HEIGHT})`);
  const yAxisGroup = g.append("g").attr("class", "yAxis");
  updateFunction(data, isRevenue);

  d3.interval(() => {
    console.log("d3 interval");
    const newData = isRevenue ? data : data.slice(1);
    updateFunction(newData, isRevenue);
    isRevenue = !isRevenue;
  }, 5000);
  return svg.node()!;

  function updateFunction(newData: IDataPoint[], isRevenue: boolean): void {
    const indicator = isRevenue ? "revenue" : "profit";
    const monthArray = newData.map((e) => e.month);
    xBarChartBandScale.domain(monthArray);
    const yDomainMax = d3.max(newData, (d: IDataPoint) => d[indicator])!;
    yLinearScale.domain([0, yDomainMax]);

    const xAxisCall = d3.axisBottom(xBarChartBandScale);
    xAxisGroup.transition().duration(750).call(xAxisCall).selectAll("text").attr("text-anchor", "middle");

    const yAxisCall = d3
      .axisLeft(yLinearScale)
      .ticks(5)
      .tickFormat((d) => `$ ${d.toLocaleString()}`);
    yAxisGroup.transition().duration(750).call(yAxisCall);

    // JOIN new data with old elements
    const rects = g.selectAll("rect").data(newData, d => (d as IDataPoint).month);
    console.log(111, "rects", JSON.stringify(rects));

    // EXIT old element not present in new data
    rects
      .exit()
      .attr("fill", "#FF6F61")
      // .transition().duration(750)
      .attr("height", 0)
      .attr("y", yLinearScale(0))
      .remove();
    console.log(112, "rects", JSON.stringify(rects));

    // UPDATE old elements present in new data
    rects
      // .transition().duration(750)
      .attr("x", (d): number => xBarChartBandScale(d.month)!)
      .attr("y", (d) => yLinearScale(d[indicator]))
      .attr("width", xBarChartBandScale.bandwidth)
      .attr("height", (d) => yLinearScale(0) - yLinearScale(d[indicator]));
    // console.log(113, "rects", JSON.stringify(rects));

    // ENTER new elements present in new data
    rects
      .enter()
      .append("rect")
      .attr("x", (d): number => xBarChartBandScale(d.month)!)
      .attr("y", yLinearScale(0))
      .attr("width", xBarChartBandScale.bandwidth)
      .attr("height", 0)
      .attr("fill", "#FF6F61")
      .attr("fill-opacity", "0")
      .transition()
      .duration(1000)
      .attr("y", (d) => yLinearScale(d[indicator]))
      .attr("height", (d) => yLinearScale(0) - yLinearScale(d[indicator]))
      .attr("fill-opacity", "1");

    console.log(114, "rects", JSON.stringify(rects));

    yLabel.text(`${isRevenue ? "Revenue" : "Profit"} (USD)`);
  }
}
