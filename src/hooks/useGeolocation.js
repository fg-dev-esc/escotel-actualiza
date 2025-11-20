import { useCallback, useState } from "react";
import { defaultCoords } from "../utils/constants";

export const useGeolocation = () => {
  const [location, setLocationState] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [statusLabel, setStatusLabel] = useState("Solicitando permiso de ubicación…");
  const [error, setError] = useState("");

  const setLocation = useCallback((newLocation) => {
    setLocationState(newLocation);
  }, []);

  const requestLocation = useCallback((resetAddressFields) => {
    setError("");
    setStatusLabel("Buscando ubicación precisa…");

    if (!navigator.geolocation) {
      setError("Tu dispositivo no comparte ubicación automáticamente.");
      setLocationState(defaultCoords);
      setAccuracy(null);
      setStatusLabel("Ajusta manualmente la ubicación.");
      resetAddressFields?.();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: meters } = position.coords;
        setLocationState({ lat: latitude, lng: longitude });
        setAccuracy(meters);
        setStatusLabel("Detectada automáticamente.");
        resetAddressFields?.();
      },
      () => {
        setError("No pudimos obtener tu señal GPS. Ajusta el pin manualmente.");
        setLocationState(defaultCoords);
        setAccuracy(null);
        setStatusLabel("Ajusta manualmente.");
        resetAddressFields?.();
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  return {
    location,
    setLocation,
    accuracy,
    setAccuracy,
    statusLabel,
    setStatusLabel,
    error,
    setError,
    requestLocation,
  };
};