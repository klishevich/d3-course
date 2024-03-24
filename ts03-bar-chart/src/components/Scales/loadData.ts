import * as d3 from "d3";

interface IDataPointDto {
  name: string;
  height: string;
}

export interface IDataPoint {
  name: string;
  height: number;
}

export async function loadDataJSON(): Promise<IDataPoint[]> {
  const fn = d3.json;
  const file = "./buildings.json";

  try {
    const response = (await fn(file)) as IDataPointDto[];
    const parsed = response.map((d) => ({
      name: d.name,
      height: parseInt(d.height),
    }));
    return parsed;
  } catch (e) {
    console.log("caught error", e);
    return [];
  }
}
