import * as d3 from "d3";

export interface ICountryInfo {
  continent: string;
  country: string;
  income: number;
  life_exp: number;
  population: number;
}

export interface IYearInfo {
  countries: ICountryInfo[];
  year: number;
}

type TCoinRecordDto = {
  ['24h_vol']?: string;
  date: string;
  market_cap?: string;
  price_usd?: string;
}

export type TCoinRecord = {
  vol24: number;
  date: Date;
  marketCap: number;
  priceUsd: number;
}

type TCoinDataSetDto = Record<string, Array<TCoinRecordDto>>;

type TCoinDataSet = Record<string, Array<TCoinRecord>>;

export async function loadData(): Promise<TCoinDataSet> {
  const fn = d3.json;
  const file = "./coins.json";
  const parseDate = d3.utcParse("%d/%m/%Y");

  try {
    const response = (await fn(file)) as TCoinDataSetDto;
    const result: TCoinDataSet = {};
    for (const [key, value] of Object.entries(response)) {
      const coinRecords: TCoinRecord[] = value.map(r => ({
        date: parseDate(r.date)!,
        vol24: parseInt(r['24h_vol'] ?? '0'),
        marketCap: parseInt(r.market_cap ?? '0'),
        priceUsd: parseInt(r.price_usd ?? '0'),
      }))
      result[key] = coinRecords;
    }
    return result;
  } catch (e) {
    console.log("caught error", e);
    return {};
  }
}
