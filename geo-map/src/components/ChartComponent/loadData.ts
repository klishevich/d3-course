import * as d3 from "d3";
import { TGeoJsonDto } from "./TGeoJsonDto";

export async function loadData(): Promise<TGeoJsonDto> {
  const fn = d3.json;
  const file = "./world.geojson";

  try {
    const response = (await fn(file)) as TGeoJsonDto;
    return response;
  } catch (e) {
    console.log("caught error", e);
    return {
      type: "FeatureCollection",
      features: []
    };
  }
}
