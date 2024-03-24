import * as d3 from "d3";
import { IDataPoint } from "./IDataPoint";

export async function loadAndParseData(
  filepath: string,
  abortSignal: AbortSignal,
): Promise<IDataPoint[]> {
  const res = await fetch(filepath, { signal: abortSignal });
  const resText = await res.text();
  const resParsed = d3.csvParse(resText) as Array<{
    date: string;
    close: string;
  }>;
  const resFormatted = resParsed.map((e) => ({
    date: d3.timeParse("%Y-%m-%d")(e.date) as Date,
    close: parseFloat(e.close),
  }));
  return resFormatted;
  //   let response = await d3.csv(filepath, function (data) {
  //     const date = d3.timeParse("%Y-%m-%d")(data.date);

  //     if (date === null) {
  //       throw new Error(`Invalid date ${data.date}`);
  //     }

  //     return {
  //       date: date,
  //       close: parseFloat(data.close),
  //     };
  //   });
}
