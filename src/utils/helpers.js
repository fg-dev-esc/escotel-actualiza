export const meterFormatter = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

export const reverseGeocodeParams = (coords) =>
  new URLSearchParams({
    format: "jsonv2",
    lat: coords.lat,
    lon: coords.lng,
    addressdetails: "1",
    zoom: "19",
  });

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatAccuracy = (accuracy) =>
  accuracy ? `${meterFormatter.format(accuracy)} m` : "-";