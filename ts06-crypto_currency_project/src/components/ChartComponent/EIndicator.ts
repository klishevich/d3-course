export enum EIndicator {
  PriceUsd = "price_usd",
  MarketCap = "market_cap"
}

export const indicatorArray = Object.entries(EIndicator);
console.log('indicatorArray', indicatorArray)