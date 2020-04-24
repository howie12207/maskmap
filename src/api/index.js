import { get } from "@/utils/request.js";

export const apiPharmacies = () =>
  get(
    "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json?fbclid=IwAR3iWfFZ0I2d1h7GywkWypN4gOJaGNMATajaR58qY2wwtlC9b9LVaiaJNMc"
  );
