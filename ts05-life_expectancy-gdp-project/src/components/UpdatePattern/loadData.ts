import * as d3 from "d3";
import { isNotNullOrUndefined } from "../../utils/isNotNullOrUndefined";

interface ICountryInfoDto {
  continent: string;
  country: string;
  income?: number;
  life_exp?: number;
  population: number;
}

interface IYearInfoDto {
  countries: ICountryInfoDto[];
  year: string;
}

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

export async function loadData(): Promise<IYearInfo[]> {
  const fn = d3.json;
  const file = "./data.json";

  // const whiteListedCountries = ["India", "United States", "France", "Egypt"]

  try {
    const response = (await fn(file)) as IYearInfoDto[];
    const filteredAndParsed = response.map((d) => {
      const filteredCountries: ICountryInfo[] = d.countries.reduce((prev: ICountryInfo[], cur: ICountryInfoDto) => {
        if (isNotNullOrUndefined(cur.income) && isNotNullOrUndefined(cur.life_exp)) {
          prev.push({
            continent: cur.continent,
            country: cur.country,
            income: cur.income!,
            life_exp: cur.life_exp!,
            population: cur.population
          });
        }
        return prev;
      }, []);
      return {
        countries: filteredCountries,
        year: parseInt(d.year)
      };
    });
    return filteredAndParsed;
  } catch (e) {
    console.log("caught error", e);
    return [];
  }
}
