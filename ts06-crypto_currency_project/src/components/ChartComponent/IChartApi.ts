import { ECurrency } from "./ECurrency";
import { EIndicator } from "./EIndicator";

export interface IChartApi {
  setMinMax: (minDate: number, maxDate: number) => void;
  selectIndicator: (i: EIndicator) => void;
  selectCurrency: (c: ECurrency) => void;
  svg: SVGSVGElement;
}
