import * as d3 from "d3";

interface IDataPointDto {
  name: string;
  age: string;
}

export interface IDataPoint {
  name: string;
  age: number;
}

export async function loadDataCsvTsv(): Promise<IDataPoint[]> {
  const fn = d3.csv;
  const file = "./ages.csv";
  // const fn = d3.tsv;
  // const file = "./ages.tsv";

  const response = await fn(file, (data: IDataPointDto) => ({
    name: data.name,
    age: parseInt(data.age),
  }));

  return response;
}

export async function loadDataJSON(): Promise<IDataPoint[]> {
  const fn = d3.json;
  const file = "./ages.json";
  // const file = "./age.json";

  try {
    const response = (await fn(file)) as IDataPointDto[];
    const parsed = response.map((d) => ({
      name: d.name,
      age: parseInt(d.age),
    }));
    return parsed;
  } catch (e) {
    console.log("caught error", e);
    return [];
  }
}
