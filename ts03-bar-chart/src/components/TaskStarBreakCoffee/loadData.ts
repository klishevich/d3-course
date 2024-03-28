import * as d3 from "d3";

interface IDataPointDto {
  month: string;
  revenue: string;
  profit: string;
}

export interface IDataPoint {
  month: string;
  revenue: number;
  profit: number;
}

export async function loadData(): Promise<IDataPoint[]> {
  const fn = d3.csv;
  const file = "./revenues.csv";

  const response = await fn(file, (data: IDataPointDto) => ({
    month: data.month,
    revenue: parseInt(data.revenue),
    profit: parseInt(data.profit)
  }));

  return response;
}
