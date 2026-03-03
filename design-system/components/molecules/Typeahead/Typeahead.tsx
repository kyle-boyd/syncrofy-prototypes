import React from 'react';
import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@mui/material/Autocomplete';
import MuiTextField from '@mui/material/TextField';
import { BaseComponentProps } from '../../../types';

export interface TypeaheadOption {
  label: string;
  value: string | number;
}

export interface TypeaheadProps extends Omit<MuiAutocompleteProps<TypeaheadOption, false, false, false>, 'renderInput' | 'options' | 'multiple'>, BaseComponentProps {
  /**
   * Options to display
   */
  options: TypeaheadOption[];
  /**
   * The input value
   */
  value?: TypeaheadOption | null;
  /**
   * Callback fired when the value changes
   */
  onChange?: (event: React.SyntheticEvent, value: TypeaheadOption | null) => void;
  /**
   * The input value (for controlled input)
   */
  inputValue?: string;
  /**
   * Callback fired when the input value changes
   */
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  /**
   * The label of the input
   */
  label?: string;
  /**
   * The placeholder of the input
   */
  placeholder?: string;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
  /**
   * If true, multiple values can be selected
   */
  multiple?: boolean;
  /**
   * If true, the input is required
   */
  required?: boolean;
  /**
   * If true, the input will be in an error state
   */
  error?: boolean;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * If true, shows loading indicator
   */
  loading?: boolean;
}

/**
 * Typeahead component (Autocomplete) for text input with suggestions
 * Extends MUI Autocomplete with custom styling
 */
export const Typeahead: React.FC<TypeaheadProps> = ({
  className,
  'data-testid': testId,
  options,
  label,
  placeholder,
  error,
  helperText,
  required,
  ...props
}) => {
  const { multiple, ...restProps } = props;
  
  return (
    <MuiAutocomplete
      className={className}
      data-testid={testId}
      options={options}
      getOptionLabel={(option) => option.label || ''}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      {...restProps}
    />
  );
};

