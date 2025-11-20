import { FormField } from './FormField';

/**
 * Componente que agrupa campos de una sección del formulario
 * Soporta subsecciones para agrupar campos relacionados
 */
export function FormSection({
  sectionKey,
  sectionConfig,
  formData,
  errors,
  onChange,
  disabled = false,
}) {
  // Agrupar campos por subsección si existen
  const hasSubsections = sectionConfig.fields.some((field) => field.subsection);

  if (hasSubsections) {
    const groupedBySubsection = {};
    sectionConfig.fields.forEach((field) => {
      const subsection = field.subsection || 'main';
      if (!groupedBySubsection[subsection]) {
        groupedBySubsection[subsection] = [];
      }
      groupedBySubsection[subsection].push(field);
    });

    return (
      <section className="form-section">
        <div className="form-section__heading">
          <h3 className="form-section__title">{sectionConfig.title}</h3>
        </div>

        <div className="form-section__subsections">
          {Object.entries(groupedBySubsection).map(([subsectionKey, fields]) => (
            <div key={subsectionKey} className="form-subsection">
              {subsectionKey !== 'main' && (
                <h4 className="form-subsection__title">
                  {subsectionKey === 'admin'
                    ? 'Contacto Administrativo'
                    : subsectionKey === 'operativo'
                    ? 'Contacto Operativo'
                    : subsectionKey}
                </h4>
              )}
              <div className="form-subsection__grid">
                {fields.map((field) => (
                  <FormField
                    key={field.key}
                    fieldKey={field.key}
                    config={field}
                    value={formData[field.key]}
                    error={errors[field.key]}
                    onChange={onChange}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Renderizado normal sin subsecciones
  return (
    <section className="form-section">
      <div className="form-section__heading">
        <h3 className="form-section__title">{sectionConfig.title}</h3>
      </div>

      <div className="form-section__grid">
        {sectionConfig.fields.map((field) => (
          <FormField
            key={field.key}
            fieldKey={field.key}
            config={field}
            value={formData[field.key]}
            error={errors[field.key]}
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}
