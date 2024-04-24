import * as d3 from "d3";
import { TCoinDataSet, TCoinRecord } from "./TCoinDataSet";

type TCoinRecordDto = {
  ["24h_vol"]?: string;
  date: string;
  market_cap?: string;
  price_usd?: string;
};

type TCoinDataSetDto = Record<string, Array<TCoinRecordDto>>;

export async function loadData(): Promise<TCoinDataSet> {
  const fn = d3.json;
  const file = "./coins.json";
  const parseDate = d3.utcParse("%d/%m/%Y");

  try {
    const response = (await fn(file)) as TCoinDataSetDto;
    const result: TCoinDataSet = {};
    for (const [key, value] of Object.entries(response)) {
      const coinRecords: TCoinRecord[] = value.map((r) => ({
        date: parseDate(r.date)!.getTime(),
        vol24: parseInt(r["24h_vol"] ?? "0"),
        market_cap: parseInt(r.market_cap ?? "0"),
        price_usd: parseInt(r.price_usd ?? "0")
      }));
      result[key] = coinRecords;
    }
    return result;
  } catch (e) {
    console.log("caught error", e);
    return {};
  }
}
