import { useProviderForm } from '../hooks/useProviderForm';
import { getFieldsBySectionAndPersonType } from '../utils/providerConfig';
import { FormSection } from './FormSection';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

/**
 * Componente principal del formulario de actualización de proveedores
 */
export function ProviderForm({ providerId }) {
  const {
    personType,
    formData,
    loading,
    errors,
    sending,
    hasError,
    successMessage,
    showSuccess,
    hasChanges,
    handleFieldChange,
    handleSubmit,
    handleReset,
  } = useProviderForm(providerId);

  const sections = getFieldsBySectionAndPersonType(personType);

  if (loading) {
    return (
      <div className="provider-form provider-form--loading">
        <div className="form-loader">
          <Loader className="form-loader__icon spin" size={40} />
          <p className="form-loader__text">Cargando datos del proveedor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-form">
      <form onSubmit={handleSubmit} className="provider-form__form">
        {/* Secciones del formulario */}
        <div className="provider-form__sections">
          {Object.entries(sections).map(([sectionKey, sectionConfig]) => (
            <FormSection
              key={sectionKey}
              sectionKey={sectionKey}
              sectionConfig={sectionConfig}
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              disabled={sending}
            />
          ))}
        </div>

        {/* Botones de acción */}
        <div className="provider-form__actions">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || sending}
            className="provider-form__btn provider-form__btn--reset"
          >
            Cancelar cambios
          </button>
          <button
            type="submit"
            disabled={sending || !hasChanges || showSuccess}
            className={`provider-form__btn provider-form__btn--submit ${
              showSuccess ? 'provider-form__btn--success' : ''
            }`}
          >
            {sending ? (
              <>
                <Loader size={18} className="spin" />
                <span>Guardando...</span>
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle size={18} />
                <span>Guardado correctamente</span>
              </>
            ) : (
              <span>Guardar cambios</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
