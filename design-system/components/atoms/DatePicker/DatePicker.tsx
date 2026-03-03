import React from 'react';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { BaseComponentProps } from '../../../types';

export interface DatePickerProps extends Omit<MuiDatePickerProps<any>, 'renderInput'>, BaseComponentProps {
  /**
   * The selected date
   */
  value?: Date | null;
  /**
   * Callback fired when the date changes
   */
  onChange?: (value: Date | null) => void;
  /**
   * The label of the input
   */
  label?: string;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
  /**
   * If true, the input is required
   */
  required?: boolean;
  /**
   * Error message to display
   */
  error?: boolean;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
}

/**
 * DatePicker component for selecting dates
 * Extends MUI X DatePicker with custom styling
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiDatePicker
      className={className}
      slotProps={{
        textField: {
          'data-testid': testId,
        } as any,
      }}
      {...props}
    />
  );
};

