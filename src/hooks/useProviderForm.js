import { useState, useEffect, useCallback } from 'react';
import {
  getFieldsByPersonType,
  getInitialProviderData,
  PERSON_TYPES,
} from '../utils/providerConfig';

/**
 * Datos mock para demostración cuando falla la conexión al API
 */
const getMockProviderData = (personType) => {
  const baseData = {
    razonSocial: 'Servicios Generales XYZ S.A. de C.V.',
    rfc: 'SGX010101ABC',
    nombreComercial: 'Servicios XYZ',
    nombreVialidad: 'Avenida Paseo de la Reforma',
    noExterior: '505',
    noInterior: 'Piso 10',
    nombreColonia: 'Cuauhtémoc',
    cp: '06500',
    entidadFederativa: 'Ciudad de México',
    nombreMunicipio: 'Cuauhtémoc',
    contactoAdminNombre: 'Lic. Juan Pérez García',
    contactoAdminEmail: 'juan.perez@serviciosxyz.mx',
    contactoAdminTelefono: '(55) 5555-1234',
    contactoOperNombre: 'Ing. María López Rodríguez',
    contactoOperEmail: 'maria.lopez@serviciosxyz.mx',
    contactoOperTelefono: '(55) 5555-5678',
    regimenFiscalId: 'Régimen General',
    iva: 16,
    ivaRetenido: 0,
    isrRetenido: 0,
    archivoCSF: '',
    archivoCaratula: '',
    esProveedorInterno: false,
    esProveedorCritico: true,
    prioridad: 'Alta',
    comentarios: 'Proveedor confiable. Requiere supervisión periódica.',
  };

  if (personType === PERSON_TYPES.FISICA) {
    return {
      tipoPersona: 'Física',
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'García',
      ...baseData,
    };
  }

  return {
    tipoPersona: 'Moral',
    ...baseData,
  };
};

/**
 * Hook para gestionar el formulario de actualización de proveedores
 * @param {string} providerId - ID del proveedor a cargar
 * @returns {Object} Estado y métodos del formulario
 */
export const useProviderForm = (providerId) => {
  // Estado principal
  const [personType, setPersonType] = useState(PERSON_TYPES.MORAL);
  const [formData, setFormData] = useState(getInitialProviderData(PERSON_TYPES.MORAL));
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * Carga los datos del proveedor desde la API
   */
  useEffect(() => {
    const loadProviderData = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con tu endpoint real
        const apiUrl = `${import.meta.env.VITE_API_URL}/providers/${providerId}`;

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error al cargar datos: ${response.statusText}`);
        }

        const data = await response.json();

        // Determinar el tipo de persona basándose en los datos
        const detectedPersonType = data.tipoPersona === 'Física'
          ? PERSON_TYPES.FISICA
          : PERSON_TYPES.MORAL;

        setPersonType(detectedPersonType);
        setFormData(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error loading provider data:', error);
        setHasError(true);
        // Inicializar con datos vacíos pero con valores de ejemplo para demostración
        const personType = PERSON_TYPES.MORAL;
        const mockData = getMockProviderData(personType);
        setPersonType(personType);
        setFormData(mockData);
        setOriginalData(mockData);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      loadProviderData();
    }
  }, [providerId]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleFieldChange = useCallback((fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Limpiar errores del campo
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Valida el formulario
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    const fields = getFieldsByPersonType(personType);

    Object.entries(fields).forEach(([fieldKey, fieldConfig]) => {
      if (fieldConfig.required) {
        const value = formData[fieldKey];
        if (value === '' || value === null || value === undefined) {
          newErrors[fieldKey] = `${fieldConfig.label} es requerido`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [personType, formData]);

  /**
   * Envía los datos actualizados al servidor
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        setSending(true);
        setHasError(false);
        setSuccessMessage(null);

        // TODO: Reemplazar con tu endpoint real
        const apiUrl = `${import.meta.env.VITE_API_URL}/providers/${providerId}`;

        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar: ${response.statusText}`);
        }

        setSuccessMessage('Datos actualizados correctamente');
        setOriginalData(formData);
      } catch (error) {
        console.error('Error updating provider:', error);
        setHasError(true);
      } finally {
        setSending(false);
      }
    },
    [formData, personType, validateForm, providerId]
  );

  /**
   * Reinicia el formulario a los datos originales
   */
  const handleReset = useCallback(() => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
      setSuccessMessage(null);
    }
  }, [originalData]);

  /**
   * Verifica si hay cambios pendientes
   */
  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  return {
    personType,
    formData,
    loading,
    errors,
    sending,
    hasError,
    successMessage,
    hasChanges: hasChanges(),
    handleFieldChange,
    handleSubmit,
    handleReset,
    validateForm,
  };
};
