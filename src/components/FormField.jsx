/**
 * Componente genérico para campos del formulario
 * Soporta: text, email, tel, number, select, checkbox, textarea, file
 */
export function FormField({
  fieldKey,
  config,
  value,
  error,
  onChange,
  disabled = false,
}) {
  const handleChange = (e) => {
    let newValue;
    if (config.type === 'checkbox') {
      newValue = e.target.checked;
    } else if (config.type === 'file') {
      newValue = e.target.files[0] || null;
    } else {
      newValue = e.target.value;
    }
    onChange(fieldKey, newValue);
  };

  const isDisabled = disabled || config.disabled;

  const commonProps = {
    id: fieldKey,
    disabled: isDisabled,
    onChange: handleChange,
    className: `form-field__input ${error ? 'form-field__input--error' : ''}`,
  };

  // Renderizar según tipo de campo
  if (config.type === 'textarea') {
    return (
      <div className="form-field">
        <label htmlFor={fieldKey} className="form-field__label">
          {config.label}
          {config.required && <span className="form-field__required">*</span>}
        </label>
        <textarea
          {...commonProps}
          value={value || ''}
          rows="4"
          placeholder={`Ingrese ${config.label.toLowerCase()}`}
        />
        {error && <span className="form-field__error">{error}</span>}
      </div>
    );
  }

  if (config.type === 'select') {
    return (
      <div className="form-field">
        <label htmlFor={fieldKey} className="form-field__label">
          {config.label}
          {config.required && <span className="form-field__required">*</span>}
        </label>
        <select
          {...commonProps}
          value={value || ''}
        >
          <option value="">Seleccione una opción</option>
          {config.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <span className="form-field__error">{error}</span>}
      </div>
    );
  }

  if (config.type === 'checkbox') {
    return (
      <div className="form-field form-field--checkbox">
        <label htmlFor={fieldKey} className="form-field__label form-field__label--checkbox">
          <input
            {...commonProps}
            type="checkbox"
            checked={value || false}
          />
          <span>{config.label}</span>
        </label>
        {error && <span className="form-field__error">{error}</span>}
      </div>
    );
  }

  if (config.type === 'file') {
    const fileName = value?.name || '';
    return (
      <div className="form-field form-field--file">
        <label htmlFor={fieldKey} className="form-field__label">
          {config.label}
          {config.required && <span className="form-field__required">*</span>}
        </label>
        <div className="form-field__file-wrapper">
          <input
            {...commonProps}
            type="file"
            accept={config.accept}
          />
          {fileName && <span className="form-field__file-name">{fileName}</span>}
        </div>
        {error && <span className="form-field__error">{error}</span>}
      </div>
    );
  }

  // text, email, tel, number, etc.
  return (
    <div className="form-field">
      <label htmlFor={fieldKey} className="form-field__label">
        {config.label}
        {config.required && <span className="form-field__required">*</span>}
      </label>
      <input
        {...commonProps}
        type={config.type}
        value={value || ''}
        placeholder={`Ingrese ${config.label.toLowerCase()}`}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
