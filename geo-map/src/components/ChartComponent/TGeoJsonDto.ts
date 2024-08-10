export type TGeoJsonFeatureCoordDto = [number, number];

export type TGeoJsonFeatureDto = {
  type: "Feature";
  geometry:
    | {
        type: "MultiPolygon";
        coordinates: Array<Array<Array<TGeoJsonFeatureCoordDto>>>;
      }
    | {
        type: "Polygon";
        coordinates: Array<Array<TGeoJsonFeatureCoordDto>>;
      };
  properties: { name: string, base_year?: string, name_eng?: string, code?: string };
  id?: string;
};

export type TGeoJsonDto = {
  type: "FeatureCollection";
  features: TGeoJsonFeatureDto[];
  name?: string;
  crs?: unknown;
};
