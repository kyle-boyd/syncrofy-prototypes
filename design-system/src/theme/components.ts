import { ThemeOptions } from '@mui/material/styles';

/**
 * Component default props and style overrides
 */
export const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: false,
    },
    styleOverrides: ((theme: any) => ({
      root: {
        fontFamily: 'Geist, sans-serif',
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 500,
        textTransform: 'none',
        transition: 'background 0.15s, color 0.15s, border 0.15s, box-shadow 0.15s',
        fontSize: '0.9375rem',
      },
      contained: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[1], // use elevation-1
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: theme.shadows[1],
        },
        '&:active': {
          backgroundColor: theme.palette.primary.dark,
          boxShadow: theme.shadows[1],
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.grey[300],
          color: theme.palette.text.disabled,
          boxShadow: theme.shadows[1],
        }
      },
      outlined: {
        border: `1.5px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        backgroundColor: 'transparent',
        boxShadow: theme.shadows[1], // use elevation-1
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.dark,
          color: theme.palette.primary.dark,
          boxShadow: theme.shadows[1],
        },
        '&:active': {
          backgroundColor: theme.palette.action.selected,
          boxShadow: theme.shadows[1],
        },
        '&.Mui-disabled': {
          borderColor: theme.palette.grey[300],
          color: theme.palette.text.disabled,
          boxShadow: theme.shadows[1],
        },
      },
      text: {
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.primary.dark,
        },
        '&:active': {
          backgroundColor: theme.palette.action.selected,
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        }
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: '1.05rem',
      },
    })) as any,
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: ((theme: any) => ({
      root: {
        borderRadius: 8,
        backgroundColor: theme.palette.background.default,
        fontSize: '14px',
        fontFamily: 'Geist, sans-serif',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.grey[600],
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: '1.5px',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.error.main,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.background.default,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[300],
          },
        },
      },
      notchedOutline: {
        borderColor: theme.palette.grey[400],
        borderWidth: '1px',
      },
      input: {
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: '20px',
        '&::placeholder': {
          color: theme.palette.text.disabled,
          opacity: 1,
        },
      },
    })) as any,
  },
  MuiInputLabel: {
    styleOverrides: ((theme: any) => ({
      root: {
        fontSize: '14px',
        fontFamily: 'Geist, sans-serif',
        fontWeight: 700,
        color: theme.palette.text.primary,
        marginBottom: '4px',
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
        '&.Mui-error': {
          color: theme.palette.text.primary,
        },
      },
      outlined: {
        transform: 'translate(0, 0) scale(1)',
        position: 'static',
        marginBottom: '4px',
      },
      shrink: {
        transform: 'translate(0, 0) scale(1)',
        position: 'static',
      },
    })) as any,
  },
  MuiFormHelperText: {
    styleOverrides: ((theme: any) => ({
      root: {
        marginTop: '4px',
        marginLeft: 0,
        fontSize: '14px',
        fontFamily: 'Geist, sans-serif',
        fontWeight: 400,
        lineHeight: '20px',
        '&.Mui-error': {
          color: theme.palette.error.main,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
      },
    })) as any,
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      elevation0: {
        backgroundColor: '#FAFCFC',
      },
      elevation1: {
        backgroundColor: '#FAFCFC',
      },
      elevation2: {
        backgroundColor: '#FFFFFF',
      },
      elevation3: {
        backgroundColor: '#FFFFFF',
      },
      elevation4: {
        backgroundColor: '#FFFFFF',
      },
      elevation5: {
        backgroundColor: '#FFFFFF',
      },
      elevation6: {
        backgroundColor: '#FFFFFF',
      },
      elevation7: {
        backgroundColor: '#FFFFFF',
      },
      elevation8: {
        backgroundColor: '#FFFFFF',
      },
      elevation9: {
        backgroundColor: '#FFFFFF',
      },
      elevation10: {
        backgroundColor: '#FFFFFF',
      },
      elevation11: {
        backgroundColor: '#FFFFFF',
      },
      elevation12: {
        backgroundColor: '#FFFFFF',
      },
      elevation13: {
        backgroundColor: '#FFFFFF',
      },
      elevation14: {
        backgroundColor: '#FFFFFF',
      },
      elevation15: {
        backgroundColor: '#FFFFFF',
      },
      elevation16: {
        backgroundColor: '#FFFFFF',
      },
      elevation17: {
        backgroundColor: '#FFFFFF',
      },
      elevation18: {
        backgroundColor: '#FFFFFF',
      },
      elevation19: {
        backgroundColor: '#FFFFFF',
      },
      elevation20: {
        backgroundColor: '#FFFFFF',
      },
      elevation21: {
        backgroundColor: '#FFFFFF',
      },
      elevation22: {
        backgroundColor: '#FFFFFF',
      },
      elevation23: {
        backgroundColor: '#FFFFFF',
      },
      elevation24: {
        backgroundColor: '#FFFFFF',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: '100px',
        fontFamily: 'Geist, sans-serif',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
  },
};

