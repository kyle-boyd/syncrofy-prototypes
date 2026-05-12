import { Select as MuiSelect, MenuItem } from '@mui/material';
import type { SelectProps as MuiSelectProps } from '@mui/material';

export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectProps = Omit<MuiSelectProps, 'children'> & {
  options?: SelectOption[];
  children?: React.ReactNode;
};

export function Select({ options, children, size = 'small', sx, MenuProps, ...rest }: SelectProps) {
  return (
    <MuiSelect
      size={size}
      sx={{ fontSize: 13, minWidth: 110, ...sx }}
      MenuProps={{
        ...MenuProps,
        slotProps: {
          ...MenuProps?.slotProps,
          paper: {
            ...(MenuProps?.slotProps?.paper as object | undefined),
            sx: {
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              '& .MuiList-root': {
                px: 0.75,
                py: 0.75,
              },
              '& .MuiMenuItem-root': {
                borderRadius: 1.5,
                mx: 0,
                my: 0.25,
              },
              ...((MenuProps?.slotProps?.paper as { sx?: object } | undefined)?.sx),
            },
          },
        },
      }}
      {...rest}
    >
      {options
        ? options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
              {opt.label}
            </MenuItem>
          ))
        : children}
    </MuiSelect>
  );
}
