import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Componente de Select personalizado sin limitaciones del navegador
 */
export function CustomSelect({
  fieldKey,
  label,
  value,
  options,
  onChange,
  required,
  error,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedLabel = value ? options.find(opt => opt.value === value)?.label || value : '';

  // Cerrar el dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(fieldKey, optionValue);
    setIsOpen(false);
  };

  const isDisabled = disabled;

  return (
    <div className="form-field">
      <label htmlFor={fieldKey} className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>

      <div className="custom-select" ref={containerRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          className={`custom-select__button ${error ? 'custom-select__button--error' : ''} ${isOpen ? 'custom-select__button--open' : ''}`}
          disabled={isDisabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="custom-select__value">
            {selectedLabel || 'Seleccione una opción'}
          </span>
          <ChevronDown size={18} className="custom-select__icon" />
        </button>

        {isOpen && (
          <div className="custom-select__dropdown">
            <ul className="custom-select__list">
              {options.map((option) => (
                <li key={option.value || option}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value || option)}
                    className={`custom-select__option ${
                      value === (option.value || option) ? 'custom-select__option--selected' : ''
                    }`}
                  >
                    {option.label || option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
