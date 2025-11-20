import { MapPin, RotateCw, Camera, Image } from "lucide-react";

export const MapSection = ({
  location,
  onRequestLocation,
  mapContainerRef,
  mapRef,
  markerRef,
  photoPreviews,
  onPhotoChange,
  onRemovePhoto
}) => {
  const handleCenter = () => {
    if (location && mapRef.current) {
      mapRef.current.setView(location, 17);
    }
  };

  return (
    <div>
      <div className="section-heading">
        <p className="eyebrow">Ubica tu vehículo</p>
        <h2>Ajusta el pin en el mapa</h2>
      </div>

      <div
        ref={mapContainerRef}
        className="map-view"
        role="application"
        aria-label="Mapa interactivo para confirmar ubicación"
      />

      <div className="map-floating">
        <p>Si el marcador no coincide, arrástralo hasta el punto exacto.</p>

        <div className="button-group">
          <button
            className="btn"
            onClick={handleCenter}
            disabled={!location}
          >
            <MapPin size={14} />
            Centrar
          </button>
          <button
            className="btn btn--small"
            onClick={onRequestLocation}
            disabled={false}
          >
            <RotateCw size={14} />
            Reintentar GPS
          </button>
        </div>

        {/* <p>Agrega referencias visuales de tu vehículo y ubicación.</p> */}

        <div className="button-group">
          <input
            id="camera-input"
            type="file"
            className="photo-input"
            accept="image/*"
            capture="environment"
            onChange={onPhotoChange}
            multiple
          />
          <label htmlFor="camera-input" className="photo-label">
            <div className="photo-label div">
              <Camera size={14} />
              Tomar foto
            </div>
          </label>

          <input
            id="gallery-input"
            type="file"
            className="photo-input"
            accept="image/*"
            onChange={onPhotoChange}
            multiple
          />
          <label htmlFor="gallery-input" className="photo-label">
            <div className="photo-label div">
              <Image size={14} />
              Galería
            </div>
          </label>
        </div>

        {photoPreviews.length > 0 && (
          <div className="photo-preview-grid">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="photo-preview-item">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                />
                <button
                  className="photo-remove-btn"
                  onClick={() => onRemovePhoto(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};