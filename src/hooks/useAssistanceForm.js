import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";

import { useGeolocation } from "./useGeolocation";
import { usePhotoManager } from "./usePhotoManager";
import { useReverseGeocode } from "./useReverseGeocode";

import { API_URL } from "../utils/constants";
import { sleep } from "../utils/helpers";

export const useAssistanceForm = () => {
  const { id: asistenciaID } = useParams();
  const [sending, setSending] = useState(false);
  const [sentPayload, setSentPayload] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [hasManualAdjust, setHasManualAdjust] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const geo = useGeolocation();
  const photos = usePhotoManager();
  const address = useReverseGeocode(geo.location);

  useEffect(() => {
    console.log("asistenciaID:", asistenciaID);
  }, [asistenciaID]);

  useEffect(() => {
    geo.requestLocation(address.resetAddressFields);
  }, []);

  useEffect(() => () => mapRef.current?.remove(), []);

  useEffect(() => {
    if (!mapContainerRef.current || !geo.location) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: geo.location,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      markerRef.current = L.marker(geo.location, { draggable: true, autoPan: true }).addTo(mapRef.current);
      markerRef.current.on("dragend", () => {
        if (!markerRef.current) return;
        const { lat, lng } = markerRef.current.getLatLng();
        console.log("Marcador arrastrado a:", { lat, lng });
        geo.setLocation({ lat, lng });
        setHasManualAdjust(true);
        geo.setStatusLabel("Ubicación ajustada manualmente.");
        address.resetAddressFields();
      });
    } else {
      mapRef.current.setView(geo.location, mapRef.current.getZoom() ?? 16);
      markerRef.current?.setLatLng(geo.location);
    }
  }, [geo.location]);

  const handleSend = useCallback(async () => {
    if (!geo.location || !asistenciaID) return;
    setSending(true);
    geo.setStatusLabel("Compartiendo ubicación con la central…");
    await sleep(1200);

    const payloadData = {
      asistenciaID: asistenciaID,
      direccionCompleta: address.fullAddress,
      lat: geo.location.lat.toFixed(6),
      lng: geo.location.lng.toFixed(6),
      calle: address.street.trim(),
      numero: address.streetNumber.trim(),
      estado: address.estado,
      municipio: address.municipio,
      cp: address.cp,
      fotos: photos.photoFiles.map(f => ({
        nombre: f.name,
        tipo: f.type,
        tamaño: f.size
      }))
    };

    console.log("Enviando a:", API_URL);
    console.log("Payload:", payloadData);

    const formData = new FormData();
    formData.append("asistenciaID", asistenciaID);
    formData.append("direccionCompleta", address.fullAddress);
    formData.append("lat", geo.location.lat.toFixed(6));
    formData.append("lng", geo.location.lng.toFixed(6));
    formData.append("calle", address.street.trim());
    formData.append("numero", address.streetNumber.trim());
    formData.append("estado", address.estado);
    formData.append("municipio", address.municipio);
    formData.append("cp", address.cp);

    photos.photoFiles.forEach((file) => {
      formData.append("fotos", file);
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      console.log("Respuesta del servidor - Status:", response.status);

      setSentPayload(payloadData);
      setHasError(false);
      geo.setStatusLabel("Ubicación enviada");
    } catch (err) {
      console.error("Error al enviar:", err.message);
      geo.setError("Error al enviar la ubicación. Intenta nuevamente.");
      geo.setStatusLabel("Error al enviar");
      setHasError(true);
    } finally {
      setSending(false);
    }
  }, [geo, address, photos, asistenciaID]);

  return {
    asistenciaID,
    sending,
    sentPayload,
    hasError,
    geo,
    photos,
    address,
    mapContainerRef,
    mapRef,
    markerRef,
    handleSend,
  };
};
