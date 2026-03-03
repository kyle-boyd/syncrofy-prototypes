import React from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { BaseComponentProps } from '../../../types';

export interface SearchProps extends Omit<TextFieldProps, 'type'>, BaseComponentProps {
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
   * Callback fired when the search is performed (on Enter key or icon click)
   */
  onSearch?: (value: string) => void;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
  /**
   * If true, the input is required
   */
  required?: boolean;
  /**
   * The placeholder content
   */
  placeholder?: string;
  /**
   * If true, shows the search icon
   */
  showSearchIcon?: boolean;
}

/**
 * Search component for search input fields with icon
 * Extends MUI TextField with search-specific features
 */
export const Search: React.FC<SearchProps> = ({
  className,
  'data-testid': testId,
  onSearch,
  showSearchIcon = true,
  onKeyDown,
  ...props
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch && props.value) {
      onSearch(props.value as string);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <MuiTextField
      className={className}
      data-testid={testId}
      type="search"
      InputProps={{
        startAdornment: showSearchIcon ? (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ) : undefined,
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

