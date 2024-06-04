import { ECurrency } from "./ECurrency";
import { EIndicator } from "./EIndicator";

export class ChartState {
  public dateMin: number = Date.UTC(2010, 0, 1);
  public dateMax: number = Date.UTC(2025, 0, 1);
  public curDateMin: number = Date.UTC(2010, 0, 1);
  public curDateMax: number = Date.UTC(2025, 0, 1);
  public yMin: number = 0;
  public yMax: number = 100;
  public indicator: EIndicator = EIndicator.PriceUsd;
  public currency: ECurrency = ECurrency.Bitcoin;

  constructor(state: Partial<ChartState> = {}) {
    this.updateProperties(this, state, this);
  }

  public copy(update: Partial<ChartState> = {}): ChartState {
    const newState = new ChartState();
    this.updateProperties(this, update, newState);
    return newState;
  }

  private updateProperties(currentState: ChartState, update: Partial<ChartState>, newState: ChartState) {
    newState.dateMin = update.dateMin ?? currentState.dateMin;
    newState.dateMax = update.dateMax ?? currentState.dateMax;
    newState.curDateMin = update.curDateMin ?? currentState.curDateMin;
    newState.curDateMax = update.curDateMax ?? currentState.curDateMax;
    newState.indicator = update.indicator ?? currentState.indicator;
    newState.currency = update.currency ?? currentState.currency;
    newState.yMin = update.yMin ?? currentState.yMin;
    newState.yMax = update.yMax ?? currentState.yMax;
  }
}
