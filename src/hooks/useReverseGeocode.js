import { useCallback, useEffect, useState } from "react";
import { NOMINATIM_API } from "../utils/constants";
import { reverseGeocodeParams } from "../utils/helpers";

export const useReverseGeocode = (location) => {
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [cp, setCp] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  const resetAddressFields = useCallback(() => {
    setStreet("");
    setStreetNumber("");
    setAddressError("");
    setShouldFetch(true);
  }, []);

  const handleStreetChange = useCallback((event) => {
    setStreet(event.target.value);
    setShouldFetch(false);
  }, []);

  const handleStreetNumberChange = useCallback((event) => {
    setStreetNumber(event.target.value);
    setShouldFetch(false);
  }, []);

  useEffect(() => {
    if (!location || !shouldFetch) return;

    console.log("Disparando reverse geocode para:", location);

    let cancelled = false;
    const controller = new AbortController();

    const fetchAddress = async () => {
      setAddressLoading(true);
      setAddressError("");
      try {
        const endpoint = `${NOMINATIM_API}?${reverseGeocodeParams(location)}`;
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Reverse geocode failed");
        }

        const data = await response.json();
        if (cancelled) return;

        const addr = data.address || {};
        const inferredStreet = addr.road || addr.pedestrian || addr.path || addr.suburb || data.name || "";
        const inferredNumber = addr.house_number || "";

        console.log("Dirección obtenida:", {
          direccionCompleta: data.display_name,
          estado: addr.state,
          municipio: addr.municipality || addr.county || addr.city,
          cp: addr.postcode,
          calle: inferredStreet,
          numero: inferredNumber
        });

        setFullAddress(data.display_name || "");
        setEstado(addr.state || "");
        setMunicipio(addr.municipality || addr.county || addr.city || "");
        setCp(addr.postcode || "");
        setStreet(inferredStreet);
        setStreetNumber(inferredNumber);
      } catch (err) {
        if (cancelled || err.name === "AbortError") return;
        setAddressError("No pudimos autocompletar la calle. Edítala manualmente.");
      } finally {
        if (!cancelled) {
          setAddressLoading(false);
        }
      }
    };

    fetchAddress();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [location, shouldFetch]);

  return {
    street,
    setStreet,
    streetNumber,
    setStreetNumber,
    fullAddress,
    estado,
    municipio,
    cp,
    addressLoading,
    addressError,
    resetAddressFields,
    handleStreetChange,
    handleStreetNumberChange,
  };
};
