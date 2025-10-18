import React from "react";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { FIELD_CONTAINER_CLASS, FIELD_LABEL_CLASS, FIELD_INPUT_CLASS, FIELD_ERROR_CLASS } from "./fieldStyles";

export type FieldInputProps = {
  name: string;
  label?: string;
  type?: "text" | "textarea" | "password" | "number";
  value?: string | number;
  onValueChange?: (val: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  rows?: number; // for textarea
  required?: boolean;
  [key: string]: any;
};

function FieldInputRHF(props: FieldInputProps) {
  const {
    name,
    label,
    type = "text",
    value,
    onValueChange,
    placeholder,
    disabled,
    className = "",
    inputClassName = "",
    rows = 3,
    required = false,
    ...rest
  } = props;
  const methods = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Controller
      name={name}
      control={methods.control}
      render={({ field, fieldState: { error } }) => (
        <div className={`${FIELD_CONTAINER_CLASS} ${className}`}>
          {label && (
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor={name} className={`${FIELD_LABEL_CLASS} ${error ? "text-red-600" : ""}`}>{label}{required && " *"}</label>
              {error && (
                <span className="text-xs text-red-500 whitespace-nowrap">{error.message}</span>
              )}
            </div>
          )}
          <div className="relative mt-1">
            {type === "textarea" ? (
              <textarea
                {...field}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={`${FIELD_INPUT_CLASS} ${inputClassName} ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={value !== undefined ? value : field.value}
                onChange={(e) => {
                  field.onChange(e);
                  onValueChange?.(e.target.value);
                }}
                {...rest}
              />
            ) : type === "number" ? (
              <input
                {...field}
                type="number"
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={`${FIELD_INPUT_CLASS} ${inputClassName} ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={value !== undefined ? value : field.value}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(val);
                  onValueChange?.(val);
                }}
                {...rest}
              />
            ) : type === "password" ? (
              <>
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id={name}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`${FIELD_INPUT_CLASS} ${inputClassName} pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  value={value !== undefined ? value : field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    onValueChange?.(e.target.value);
                  }}
                  {...rest}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </>
            ) : (
              <input
                {...field}
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={`${FIELD_INPUT_CLASS} ${inputClassName} ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={value !== undefined ? value : field.value}
                onChange={(e) => {
                  field.onChange(e);
                  onValueChange?.(e.target.value);
                }}
                {...rest}
              />
            )}
          </div>
        </div>
      )}
    />
  );
}

function FieldInputControlled(props: FieldInputProps) {
  const { name, label, type = "text", value, onValueChange, placeholder, disabled, className = "", inputClassName = "", rows = 3, required = false, ...rest } = props;
  const renderInput = (fieldProps: any) =>
    type === "textarea" ? (
      <textarea {...fieldProps} className={`${FIELD_INPUT_CLASS} ${inputClassName}`} rows={rows} placeholder={placeholder} disabled={disabled} />
    ) : (
      <input {...fieldProps} type={type} className={`${FIELD_INPUT_CLASS} ${inputClassName}`} placeholder={placeholder} disabled={disabled} />
    );
  return (
    <div className={`${FIELD_CONTAINER_CLASS} ${className}`}>
      {label && <label htmlFor={name} className={FIELD_LABEL_CLASS}>{label}{required && " *"}</label>}
      {renderInput({
        name,
        value: value ?? "",
        onChange: (e: any) => {
          const val = type === "number" ? Number(e.target.value) : e.target.value;
          onValueChange?.(val);
        },
        ...rest,
      })}
    </div>
  );
}

export const FieldInput: React.FC<FieldInputProps> = (props) => {
  try {
    // If inside RHF context, render RHF version
    useFormContext();
    return <FieldInputRHF {...props} />;
  } catch {
    // Not in RHF context, render controlled version
    return <FieldInputControlled {...props} />;
  }
};

export default FieldInput;
