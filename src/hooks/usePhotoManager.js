import { useCallback, useState } from "react";

export const usePhotoManager = () => {
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  const handlePhotoChange = useCallback((event) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    console.log("Fotos cargadas:", newFiles.map(f => ({
      nombre: f.name,
      tipo: f.type,
      tamaño: f.size
    })));

    setPhotoFiles(prev => [...prev, ...newFiles]);
    setPhotoPreviews(prev => [...prev, ...newPreviews]);

    event.target.value = "";
  }, []);

  const handleRemovePhoto = useCallback((index) => {
    setPhotoPreviews(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
    setPhotoFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  return {
    photoFiles,
    photoPreviews,
    handlePhotoChange,
    handleRemovePhoto,
  };
};