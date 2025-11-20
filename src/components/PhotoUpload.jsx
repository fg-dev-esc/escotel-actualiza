import { Camera, Image, X } from "lucide-react";

export const PhotoUpload = ({ photoPreviews, onPhotoChange, onRemovePhoto }) => {
  return (
    <>
      <p>Agrega referencias visuales de tu vehículo y ubicación.</p>

      <div className="photo-input-wrapper photo-input-wrapper--margin">
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
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};