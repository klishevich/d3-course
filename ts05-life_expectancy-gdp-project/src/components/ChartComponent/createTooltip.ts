import * as d3 from "d3";
import { ICountryInfo } from "./loadData";
import { DEFAULT_OPACITY } from "./createD3Chart";

export interface ITooltipMethods {
  mouseover: (_e: any, c: ICountryInfo) => void;
  mousemove: (_e: any, c: ICountryInfo) => void;
  mouseleave: (_e: any, c: ICountryInfo) => void;
}

interface IMouseEventData {
  pageX: number;
  pageY: number;
  srcElement: SVGSVGElement;
}

const populationFormatterFn = d3.format(",.5r");

export function createTooltip(div: HTMLDivElement): ITooltipMethods {
  // create a tooltip
  const tooltip = d3
    .select(div)
    .append("div")
    .style("opacity", 1)
    .style("display", "none")
    .attr("class", "tooltip")
    .style("background-color", "lightgrey")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  const mouseover = function (e: IMouseEventData, d: ICountryInfo) {
    tooltip.style("display", "block");
    d3.select(e.srcElement).style("stroke", "black").style("opacity", 1);
  };
  const mousemove = function (e: IMouseEventData, d: ICountryInfo) {
    tooltip
      .html(
        `${d.country}, GDP $${d.income}, LifeExp ${Math.round(d.life_exp)}, Population ${populationFormatterFn(d.population)}`
      )
      .style("left", e.pageX + 5 + "px")
      .style("top", e.pageY + 5 + "px");
  };
  const mouseleave = function (e: IMouseEventData, d: ICountryInfo) {
    tooltip.style("display", "none");
    d3.select(e.srcElement).style("stroke", "none").style("opacity", DEFAULT_OPACITY);
  };

  return {
    mouseover,
    mousemove,
    mouseleave
  };
}
