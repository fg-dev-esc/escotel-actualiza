import { Check, Loader, AlertCircle } from "lucide-react";

export const SubmitButton = ({ onClick, disabled, isSending, isSent, hasError }) => {
  return (
    <button
      className={`primary-btn ${isSent ? "primary-btn--success" : ""} ${hasError ? "primary-btn--error" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isSent ? (
        <span className="btn-icon">
          <Check size={20} />
          Enviado
        </span>
      ) : isSending ? (
        <span className="btn-icon">
          <Loader size={20} className="btn-icon--spin" />
          Enviando datos…
        </span>
      ) : hasError ? (
        <span className="btn-icon">
          <AlertCircle size={20} />
          Error al enviar
        </span>
      ) : (
        "Enviar ubicación"
      )}
    </button>
  );
};