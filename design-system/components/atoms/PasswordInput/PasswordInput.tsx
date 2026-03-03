import React, { useState } from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { BaseComponentProps } from '../../../types';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type'>, BaseComponentProps {
  /**
   * The label content
   */
  label?: string;
  /**
   * The value of the input
   */
  value?: string;
  /**
   * Callback fired when the value changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
   * If true, password visibility toggle is shown
   */
  showVisibilityToggle?: boolean;
}

/**
 * PasswordInput component for password fields with visibility toggle
 * Extends MUI TextField with password-specific features
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  className,
  'data-testid': testId,
  showVisibilityToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <MuiTextField
      className={className}
      data-testid={testId}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: showVisibilityToggle ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};

