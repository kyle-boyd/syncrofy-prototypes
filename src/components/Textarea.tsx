import { TextField, TextFieldProps } from '@mui/material';

export type TextareaProps = Omit<TextFieldProps, 'multiline' | 'select'> & {
  minRows?: number;
  maxRows?: number;
};

export function Textarea({ minRows = 3, maxRows = 10, fullWidth = true, size = 'small', ...rest }: TextareaProps) {
  return <TextField multiline minRows={minRows} maxRows={maxRows} fullWidth={fullWidth} size={size} {...rest} />;
}

export default Textarea;
