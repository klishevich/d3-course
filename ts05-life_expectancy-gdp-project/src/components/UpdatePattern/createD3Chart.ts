import * as d3 from "d3";
import { ICountryInfo, IYearInfo } from "./loadData";

export function createD3Chart(data: IYearInfo[]): SVGSVGElement {
  const SVG_WIDTH = 1200;
  const SVG_HEIGHT = 800;
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 60 };
  const CHART_WIDTH = SVG_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const CHART_HEIGHT = SVG_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

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
    .text("GDP Per Capita ($)");

  g.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -(CHART_HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy (Years)");

  const yearLabel = g
    .append("text")
    .attr("class", "x-axis-year-label")
    .attr("x", CHART_WIDTH)
    .attr("y", CHART_HEIGHT - 20)
    .attr("font-size", "60px")
    .attr("text-anchor", "end")
    .style("fill", "darkGrey");

  const xLogScale = d3.scaleLog([100, 150_000], [0, CHART_WIDTH]);
  const xAxisGroup = g.append("g").attr("class", "xAxis").attr("transform", `translate(0, ${CHART_HEIGHT})`);
  const xAxisCall = d3
    .axisBottom(xLogScale)
    .tickValues([400, 4_000, 40_000])
    .tickFormat((d) => `$ ${d.toLocaleString()}`);
  xAxisGroup.call(xAxisCall).selectAll("text").attr("text-anchor", "middle");

  const yLinearScale = d3.scaleLinear().domain([0, 90]).range([CHART_HEIGHT, 0]);
  const yAxisGroup = g.append("g").attr("class", "yAxis");
  const yAxisCall = d3.axisLeft(yLinearScale).ticks(5);
  yAxisGroup.call(yAxisCall);

  const continentList = ["africa", "asia", "americas", "europe"];
  const rangeList = ["RED", "ORANGE", "BLUE", "GREEN", "GREEN", "GREY"];
  const continentColorScale = d3.scaleOrdinal().domain(continentList).range(rangeList);

  const legend = g.append("g").attr("transform", `translate(${CHART_WIDTH - 10}, ${CHART_HEIGHT - 150})`);
  continentList.forEach((continent, index) => {
    const legendRow = legend.append("g").attr("transform", `translate(0, ${index * 20})`);

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", continentColorScale(continent) as string);

    legendRow
      .append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text(continent);
  });

  let index = 0;
  updateFunction(data[index]);

  const intervalToken = d3.interval(() => {
    console.log("d3 interval");
    index++;
    if (index >= data.length) {
      intervalToken.stop();
      return;
    }
    updateFunction(data[index]);
  }, 100);
  return svg.node()!;

  function updateFunction(yearInfo: IYearInfo): void {
    const { year, countries } = yearInfo;
    // JOIN new data with old elements
    const circles = g.selectAll("circle").data(countries, (d) => (d as ICountryInfo).country);

    // EXIT old element not present in new data
    circles.exit().remove();

    // UPDATE old elements present in new data
    circles
      .transition()
      .delay(100)
      .attr("cx", (d): number => xLogScale(d.income)!)
      .attr("cy", (d) => yLinearScale(d.life_exp))
      .attr("r", calcCircleRadius);

    // ENTER new elements present in new data
    circles
      .enter()
      .append("circle")
      .attr("cx", (d): number => xLogScale(d.income)!)
      .attr("cy", (d) => yLinearScale(d.life_exp))
      .attr("r", calcCircleRadius)
      .style("fill", (d) => continentColorScale(d.continent) as string)
      .style("opacity", 0.7);

    yearLabel.text(year);
  }
}

function calcCircleRadius(d: ICountryInfo): number {
  return Math.sqrt(d.population) / 500;
}
