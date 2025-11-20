/**
 * Configuración de campos de formulario para proveedores
 * Define estructura, tipos y condicionalidades de campos
 */

export const PERSON_TYPES = {
  FISICA: 'fisica',
  MORAL: 'moral',
};

/**
 * Configuración de campos compartidos entre ambos tipos
 */
const SHARED_FIELDS = {
  razonSocial: {
    label: 'Razón Social',
    type: 'text',
    required: true,
    section: 'basicInfo',
  },
  rfc: {
    label: 'RFC',
    type: 'text',
    required: true,
    section: 'basicInfo',
  },
  nombreComercial: {
    label: 'Nombre comercial',
    type: 'text',
    required: false,
    section: 'basicInfo',
  },
  // Domicilio Fiscal
  nombreVialidad: {
    label: 'Nombre de la vialidad',
    type: 'text',
    required: false,
    section: 'address',
  },
  noExterior: {
    label: 'Número exterior',
    type: 'text',
    required: false,
    section: 'address',
  },
  noInterior: {
    label: 'Número interior',
    type: 'text',
    required: false,
    section: 'address',
  },
  nombreColonia: {
    label: 'Colonia',
    type: 'text',
    required: false,
    section: 'address',
  },
  cp: {
    label: 'Código Postal',
    type: 'text',
    required: false,
    section: 'address',
  },
  entidadFederativa: {
    label: 'Entidad Federativa',
    type: 'select',
    required: false,
    section: 'address',
    options: [
      'Aguascalientes',
      'Baja California',
      'Baja California Sur',
      'Campeche',
      'Chiapas',
      'Chihuahua',
      'Ciudad de México',
      'Coahuila',
      'Colima',
      'Durango',
      'Guanajuato',
      'Guerrero',
      'Hidalgo',
      'Jalisco',
      'Michoacán',
      'Morelos',
      'Nayarit',
      'Nuevo León',
      'Oaxaca',
      'Puebla',
      'Querétaro',
      'Quintana Roo',
      'San Luis Potosí',
      'Sinaloa',
      'Sonora',
      'Tabasco',
      'Tamaulipas',
      'Tlaxcala',
      'Veracruz',
      'Yucatán',
      'Zacatecas',
    ],
  },
  nombreMunicipio: {
    label: 'Municipio',
    type: 'text',
    required: false,
    section: 'address',
  },
  // Datos de Contacto - Administrativo
  contactoAdminNombre: {
    label: 'Nombre (Administrativo)',
    type: 'text',
    required: false,
    section: 'contact',
    subsection: 'admin',
  },
  contactoAdminEmail: {
    label: 'Email (Administrativo)',
    type: 'email',
    required: false,
    section: 'contact',
    subsection: 'admin',
  },
  contactoAdminTelefono: {
    label: 'Teléfono (Administrativo)',
    type: 'tel',
    required: false,
    section: 'contact',
    subsection: 'admin',
  },
  // Datos de Contacto - Operativo
  contactoOperNombre: {
    label: 'Nombre (Operativo)',
    type: 'text',
    required: false,
    section: 'contact',
    subsection: 'operativo',
  },
  contactoOperEmail: {
    label: 'Email (Operativo)',
    type: 'email',
    required: false,
    section: 'contact',
    subsection: 'operativo',
  },
  contactoOperTelefono: {
    label: 'Teléfono (Operativo)',
    type: 'tel',
    required: false,
    section: 'contact',
    subsection: 'operativo',
  },
  // Información Fiscal
  regimenFiscalId: {
    label: 'Régimen Fiscal',
    type: 'select',
    required: false,
    section: 'fiscal',
    options: [
      'Régimen General',
      'Personas Físicas',
      'Pequeño Contribuyente',
      'Otros',
    ],
  },
  iva: {
    label: 'IVA',
    type: 'number',
    required: false,
    section: 'fiscal',
  },
  ivaRetenido: {
    label: 'IVA retenido',
    type: 'number',
    required: false,
    section: 'fiscal',
  },
  isrRetenido: {
    label: 'ISR retenido',
    type: 'number',
    required: false,
    section: 'fiscal',
  },
  archivoCSF: {
    label: 'Comprobante de Situación Fiscal (CSF)',
    type: 'file',
    required: false,
    section: 'fiscal',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  archivoCaratula: {
    label: 'Carátula RFC',
    type: 'file',
    required: false,
    section: 'fiscal',
    accept: '.pdf,.jpg,.jpeg,.png',
  },
  // Configuración
  esProveedorInterno: {
    label: 'Proveedor interno',
    type: 'checkbox',
    required: false,
    section: 'config',
  },
  esProveedorCritico: {
    label: 'Proveedor Crítico',
    type: 'checkbox',
    required: false,
    section: 'config',
  },
  prioridad: {
    label: 'Prioridad',
    type: 'select',
    required: false,
    section: 'config',
    options: ['Baja', 'Media', 'Alta'],
  },
  // Observaciones
  comentarios: {
    label: 'Comentarios',
    type: 'textarea',
    required: false,
    section: 'observations',
  },
};

/**
 * Campos específicos para Persona Física
 */
export const PERSONA_FISICA_FIELDS = {
  tipoPersona: {
    label: 'Tipo de persona',
    type: 'text',
    required: true,
    section: 'basicInfo',
    disabled: true,
    value: 'Física',
  },
  nombre: {
    label: 'Nombre',
    type: 'text',
    required: true,
    section: 'basicInfo',
  },
  apellidoPaterno: {
    label: 'Apellido paterno',
    type: 'text',
    required: true,
    section: 'basicInfo',
  },
  apellidoMaterno: {
    label: 'Apellido materno',
    type: 'text',
    required: false,
    section: 'basicInfo',
  },
  ...SHARED_FIELDS,
};

/**
 * Campos específicos para Persona Moral
 */
export const PERSONA_MORAL_FIELDS = {
  tipoPersona: {
    label: 'Tipo de persona',
    type: 'text',
    required: true,
    section: 'basicInfo',
    disabled: true,
    value: 'Moral',
  },
  ...SHARED_FIELDS,
};

/**
 * Orden de secciones y campos dentro de cada sección
 */
export const SECTION_ORDER = {
  basicInfo: {
    title: 'Información Básica',
    order: 1,
  },
  address: {
    title: 'Domicilio Fiscal',
    order: 2,
  },
  contact: {
    title: 'Datos de Contacto',
    order: 3,
  },
  fiscal: {
    title: 'Información Fiscal',
    order: 4,
  },
  config: {
    title: 'Configuración',
    order: 5,
  },
  observations: {
    title: 'Observaciones',
    order: 6,
  },
};

/**
 * Obtiene los campos según el tipo de persona
 */
export const getFieldsByPersonType = (personType) => {
  return personType === PERSON_TYPES.FISICA
    ? PERSONA_FISICA_FIELDS
    : PERSONA_MORAL_FIELDS;
};

/**
 * Obtiene los campos ordenados por sección
 */
export const getFieldsBySectionAndPersonType = (personType) => {
  const allFields = getFieldsByPersonType(personType);
  const grouped = {};

  // Agrupar campos por sección
  Object.entries(allFields).forEach(([fieldKey, fieldConfig]) => {
    const section = fieldConfig.section;
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push({ key: fieldKey, ...fieldConfig });
  });

  // Retornar ordenado por SECTION_ORDER
  return Object.entries(SECTION_ORDER)
    .sort(([, a], [, b]) => a.order - b.order)
    .reduce((acc, [sectionKey, sectionConfig]) => {
      if (grouped[sectionKey]) {
        acc[sectionKey] = {
          ...sectionConfig,
          fields: grouped[sectionKey],
        };
      }
      return acc;
    }, {});
};

/**
 * Estructura inicial de datos para un proveedor
 */
export const getInitialProviderData = (personType) => {
  const fields = getFieldsByPersonType(personType);
  const initialData = {};

  Object.entries(fields).forEach(([key, config]) => {
    if (config.type === 'checkbox') {
      initialData[key] = false;
    } else if (config.type === 'number') {
      initialData[key] = 0;
    } else if (config.value !== undefined) {
      initialData[key] = config.value;
    } else {
      initialData[key] = '';
    }
  });

  return initialData;
};
