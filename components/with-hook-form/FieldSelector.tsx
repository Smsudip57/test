import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { POPOVER_CONTAINER_CLASS, FIELD_CONTAINER_CLASS, FIELD_LABEL_CLASS, FIELD_ERROR_CLASS } from "./fieldStyles";

export type FieldSelectorOption = {
  label: string;
  value: string | number;
};

export type FieldSelectorProps = {
  name: string;
  label?: string;
  options: FieldSelectorOption[];
  value?: string | number;
  onSelect?: (val: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectClassName?: string;
  [key: string]: any;
};

function FieldSelectorRHF(props: FieldSelectorProps) {
  const {
    name,
    label,
    options,
    value,
    onSelect,
    placeholder = "Select...",
    disabled = false,
    required = false,
    className = "",
    selectClassName = "",
    ...rest
  } = props;
  const { control } = useFormContext();
  // Error handling
  const errorMsg = (control?._formState?.errors?.[name]?.message) as string | undefined;
  return (
    <div className={`${FIELD_CONTAINER_CLASS} ${className}`}>
      {label && (
        <div className="flex items-center gap-2 mb-1">
          <Label htmlFor={name} className={`${FIELD_LABEL_CLASS} ${errorMsg ? "text-red-600" : ""}`}>
            {label}
            {required && " *"}
          </Label>
          {errorMsg && (
            <span className="text-xs text-red-500 whitespace-nowrap">{errorMsg}</span>
          )}
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={value !== undefined ? String(value) : (field.value ? String(field.value) : undefined)}
            onValueChange={(val: string) => {
              field.onChange(val);
              onSelect?.(val);
            }}
            disabled={disabled}
          >
            <SelectTrigger className={selectClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

function FieldSelectorControlled(props: FieldSelectorProps) {
  const {
    name,
    label,
    options,
    value,
    onSelect,
    placeholder = "Select...",
    disabled = false,
    required = false,
    className = "",
    selectClassName = "",
    ...rest
  } = props;
  return (
    <div className={`${FIELD_CONTAINER_CLASS} ${className}`}>
      {label && (
        <Label htmlFor={name} className={FIELD_LABEL_CLASS}>
          {label}
          {required && " *"}
        </Label>
      )}
      <Select
        value={value !== undefined ? String(value) : undefined}
        onValueChange={(val: string) => {
          onSelect?.(val);
        }}
        disabled={disabled}
      >
        <SelectTrigger className={selectClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const FieldSelector: React.FC<FieldSelectorProps> = (props) => {
  try {
    useFormContext();
    return <FieldSelectorRHF {...props} />;
  } catch {
    return <FieldSelectorControlled {...props} />;
  }
};

export default FieldSelector;
