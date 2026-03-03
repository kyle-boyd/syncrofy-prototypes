import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, useTheme } from '@mui/material';
import { BaseComponentProps } from '../../../types';

export interface InputProps extends Omit<MuiTextFieldProps, 'variant' | 'label'>, BaseComponentProps {
  /**
   * The label content
   */
  label?: string;
  /**
   * The variant to use
   */
  variant?: 'outlined' | 'filled' | 'standard';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium';
  /**
   * The value of the input
   */
  value?: string;
  /**
   * Callback fired when the value changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
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
   * The placeholder content
   */
  placeholder?: string;
  /**
   * Type of the input element
   */
  type?: string;
  /**
   * If true, the input will be multiline
   */
  multiline?: boolean;
  /**
   * Number of rows to display when multiline option is set
   */
  rows?: number;
}

/**
 * Custom error icon component - red circle with white x
 */
const ErrorIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: theme.palette.error.main,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '1',
        fontWeight: 700,
      }}
    >
      ×
    </Box>
  );
};

/**
 * Custom label component that formats required labels
 */
const FormLabel: React.FC<{ label: string; required?: boolean; disabled?: boolean }> = ({
  label,
  required,
  disabled,
}) => {
  const theme = useTheme();
  
  if (!required) {
    return <span>{label}</span>;
  }

  return (
    <span>
      <span style={{ fontWeight: 700, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary }}>
        {label}
      </span>
      {' '}
      <span style={{ fontWeight: 400, color: disabled ? theme.palette.text.disabled : theme.palette.text.secondary }}>
        (required)
      </span>
      {' '}
      <span style={{ fontWeight: 700, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary }}>
        *
      </span>
    </span>
  );
};

/**
 * Input component for text input fields
 * Extends MUI TextField with custom styling based on Figma design
 */
export const Input: React.FC<InputProps> = ({
  className,
  'data-testid': testId,
  label,
  required,
  error,
  helperText,
  disabled,
  ...props
}) => {
  const theme = useTheme();
  
  // Format label for required fields
  const formattedLabel = label ? (
    <FormLabel label={label} required={required} disabled={disabled} />
  ) : undefined;

  // Format helper text with error icon if error state
  const formattedHelperText = error && helperText ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '4px',
        fontSize: '14px',
        fontFamily: 'Geist, sans-serif',
        fontWeight: 400,
        lineHeight: '20px',
        color: theme.palette.error.main,
      }}
    >
      <ErrorIcon />
      <span>{helperText}</span>
    </Box>
  ) : helperText ? (
    <FormHelperText sx={{ marginTop: '4px', marginLeft: 0 }}>
      {helperText}
    </FormHelperText>
  ) : null;

  return (
    <Box sx={{ width: '100%' }}>
      {formattedLabel && (
        <Box
          component="label"
          sx={{
            display: 'block',
            fontSize: '14px',
            fontFamily: 'Geist, sans-serif',
            fontWeight: 700,
            color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
            marginBottom: '4px',
          }}
        >
          {formattedLabel}
        </Box>
      )}
      <MuiTextField
        className={className}
        data-testid={testId}
        label={undefined} // We're rendering label ourselves
        required={false} // Handle required indicator in custom label
        error={error}
        helperText={undefined} // We're rendering helper text ourselves
        disabled={disabled}
        {...props}
      />
      {formattedHelperText}
    </Box>
  );
};

