import { ECurrency } from "./ECurrency";
import { EIndicator } from "./EIndicator";

export class ChartState {
  public dateMin: number = Date.UTC(2010, 0, 1);
  public dateMax: number = Date.UTC(2025, 0, 1);
  public curDateMin: number = Date.UTC(2010, 0, 1);
  public curDateMax: number = Date.UTC(2025, 0, 1);
  public indicator: EIndicator = EIndicator.PriceUsd;
  public currency: ECurrency = ECurrency.Bitcoin;
}