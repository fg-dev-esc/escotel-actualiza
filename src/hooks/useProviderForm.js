import { useState, useEffect, useCallback } from 'react';
import {
  getFieldsByPersonType,
  getInitialProviderData,
  PERSON_TYPES,
} from '../utils/providerConfig';

/**
 * Mapea los datos del formulario al formato esperado por la API
 */
const mapFormDataToApiData = (formData) => {
  // Convertir strings vacíos a null para que coincidan con el payload esperado
  const getValue = (value) => {
    if (value === '' || value === undefined) return null;
    return value;
  };

  return {
    proveedorID: getValue(formData.proveedorID),
    tipoPersona: getValue(formData.tipoPersona),
    nombre: getValue(formData.nombre),
    apellidoPaterno: getValue(formData.apellidoPaterno),
    apellidoMaterno: getValue(formData.apellidoMaterno),
    razonSocial: getValue(formData.razonSocial),
    rfc: getValue(formData.rfc),
    nombreComercial: getValue(formData.nombreComercial),
    nombreVialidad: getValue(formData.nombreVialidad),
    noExterior: getValue(formData.noExterior),
    noInterior: getValue(formData.noInterior),
    nombreColonia: getValue(formData.nombreColonia),
    cp: getValue(formData.cp),
    entidadFederativa: getValue(formData.entidadFederativa),
    nombreMunicipio: getValue(formData.nombreMunicipio),
    // Mapear contacto administrativo a contacto general
    contactoNombre: getValue(formData.contactoAdminNombre),
    contactoEmail: getValue(formData.contactoAdminEmail),
    contactoTelefono1: getValue(formData.contactoAdminTelefono),
    // Mapear contacto operativo
    contactoOperaciones: getValue(formData.contactoOperNombre),
    emailOperaciones: getValue(formData.contactoOperEmail),
    telefonoOperaciones1: getValue(formData.contactoOperTelefono),
    telefonoOperaciones2: null,
    telefonoOperaciones3: null,
    regimenFiscalId: getValue(formData.regimenFiscalId),
    iva: getValue(formData.iva),
    ivaRetenido: getValue(formData.ivaRetenido),
    isrRetenido: getValue(formData.isrRetenido),
    constanciaSituacionF: getValue(formData.archivoCSF),
    caratulaEdoCta: getValue(formData.archivoCaratula),
    esProveedorInterno: formData.esProveedorInterno === true ? true : false,
    esProveedorCritico: formData.esProveedorCritico === true ? true : false,
    prioridad: getValue(formData.prioridad),
    comentarios: getValue(formData.comentarios),
  };
};

/**
 * Mapea los datos que vienen de la API al formato esperado por el formulario
 */
const mapApiDataToFormData = (apiData) => {
  return {
    tipoPersona: apiData.tipoPersona || 'Moral',
    nombre: apiData.nombre || '',
    apellidoPaterno: apiData.apellidoPaterno || '',
    apellidoMaterno: apiData.apellidoMaterno || '',
    razonSocial: apiData.razonSocial || '',
    rfc: apiData.rfc || '',
    nombreComercial: apiData.nombreComercial || '',
    nombreVialidad: apiData.nombreVialidad || '',
    noExterior: apiData.noExterior || '',
    noInterior: apiData.noInterior || '',
    nombreColonia: apiData.nombreColonia || '',
    cp: apiData.cp || '',
    entidadFederativa: apiData.entidadFederativa || '',
    nombreMunicipio: apiData.nombreMunicipio || '',
    // Contacto administrativo (mapear desde contacto general)
    contactoAdminNombre: apiData.contactoNombre || '',
    contactoAdminEmail: apiData.contactoEmail || '',
    contactoAdminTelefono: apiData.contactoTelefono1 || '',
    // Contacto operativo
    contactoOperNombre: apiData.contactoOperaciones || '',
    contactoOperEmail: apiData.emailOperaciones || '',
    contactoOperTelefono: apiData.telefonoOperaciones1 || '',
    regimenFiscalId: apiData.regimenFiscalId || '',
    iva: apiData.iva || 0,
    ivaRetenido: apiData.ivaRetenido || 0,
    isrRetenido: apiData.isrRetenido || 0,
    archivoCSF: apiData.constanciaSituacionF || '',
    archivoCaratula: apiData.caratulaEdoCta || '',
    esProveedorInterno: apiData.esProveedorInterno || false,
    esProveedorCritico: apiData.esProveedorCritico || false,
    prioridad: apiData.prioridad || '',
    comentarios: apiData.comentarios || '',
  };
};

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
        const apiUrl = `https://dev-sigsa.backend.escotel.mx/api/DatosProveedores/GetDatosProveedor/${providerId}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error al cargar datos: ${response.statusText}`);
        }

        const apiData = await response.json();

        // Mapear datos de la API al formato del formulario
        const mappedData = mapApiDataToFormData(apiData);

        // Determinar el tipo de persona basándose en los datos
        const detectedPersonType = mappedData.tipoPersona === 'Física'
          ? PERSON_TYPES.FISICA
          : PERSON_TYPES.MORAL;

        setPersonType(detectedPersonType);
        setFormData(mappedData);
        setOriginalData(mappedData);
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
   * Valida el formulario - solo valida campos mostrados
   */
  const validateForm = useCallback(() => {
    // No validar nada, solo permitir enviar lo que viene de la API
    setErrors({});
    return true;
  }, []);

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

        // Mapear datos del formulario al formato de la API
        const apiData = mapFormDataToApiData(formData);

        // Crear FormData para enviar como multipart/form-data
        const formDataToSend = new FormData();

        // Agregar proveedorId
        formDataToSend.append('proveedorId', providerId);

        // Agregar todos los campos mapeados de la API
        Object.entries(apiData).forEach(([key, value]) => {
          if (value !== undefined) {
            // Si es un archivo (objeto File), agregarlo directamente
            if (value instanceof File) {
              formDataToSend.append(key, value);
            } else {
              // Convertir null a cadena vacía, otros valores a string
              const stringValue = value === null ? '' : String(value);
              formDataToSend.append(key, stringValue);
            }
          }
        });

        const apiUrl = `https://dev-sigsa.backend.escotel.mx/api/DatosProveedores/Actualizar`;

        const response = await fetch(apiUrl, {
          method: 'PUT',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar: ${response.statusText}`);
        }

        setSuccessMessage('Datos actualizados correctamente');
        setOriginalData(formData);

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
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

  const showSuccess = Boolean(successMessage);

  return {
    personType,
    formData,
    loading,
    errors,
    sending,
    hasError,
    successMessage,
    showSuccess,
    hasChanges: hasChanges(),
    handleFieldChange,
    handleSubmit,
    handleReset,
    validateForm,
  };
};