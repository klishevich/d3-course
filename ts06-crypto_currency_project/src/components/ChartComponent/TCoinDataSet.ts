export type TCoinDataSet = Record<string, Array<TCoinRecord>>;

export type TCoinRecord = {
  vol24: number;
  date: number;
  market_cap: number;
  price_usd: number;
};
