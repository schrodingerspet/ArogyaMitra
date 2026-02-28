import { cloneElement, isValidElement } from "react";

export default function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  children,
  className = "",
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": describedBy,
        "aria-invalid": Boolean(error) || undefined,
      })
    : children;

  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span aria-hidden="true" style={{ color: "var(--danger)" }}>*</span> : null}
      </label>
      {control}
      {hint ? <p id={hintId} className="field-hint">{hint}</p> : null}
      {error ? <p id={errId} className="field-error" role="alert">{error}</p> : null}
    </div>
  );
}
