import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from '@mui/material';

export interface FormSelectOption<T extends string | number = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface FormSelectProps<T extends string | number = string>
  extends Omit<SelectProps<T>, 'onChange' | 'variant'> {
  label?: string;
  options: FormSelectOption<T>[];
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  onChange?: (value: T) => void;
}

export function FormSelect<T extends string | number = string>({
  label,
  options,
  helperText,
  errorText,
  onChange,
  fullWidth = true,
  size = 'small',
  value,
  ...rest
}: FormSelectProps<T>) {
  const labelId = React.useId();
  const hasError = Boolean(errorText);

  return (
    <FormControl fullWidth={fullWidth} size={size} error={hasError}>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select<T>
        labelId={label ? labelId : undefined}
        label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value as T)}
        {...rest}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {(errorText || helperText) && <FormHelperText>{errorText ?? helperText}</FormHelperText>}
    </FormControl>
  );
}

export default FormSelect;
