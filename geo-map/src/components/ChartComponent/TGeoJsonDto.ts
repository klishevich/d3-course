export type TGeoJsonFeatureCoordDto = [number, number];

export type TGeoJsonFeatureDto = {
  type: "Feature";
  geometry: {
    type: "MultiPolygon";
    coordinates: Array<Array<Array<TGeoJsonFeatureCoordDto>>>;
  };
  properties: { name: string };
  id: string;
};

export type TGeoJsonDto = {
  type: "FeatureCollection";
  features: TGeoJsonFeatureDto[];
};
