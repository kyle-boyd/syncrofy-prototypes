import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiTextField from '@mui/material/TextField';
import { Badge } from '@/components/atoms/Badge';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Tag } from '@/components/atoms/Tag';
import { IconButton } from '@/components/atoms/IconButton';
import { BaseComponentProps } from '@/types';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

// ---------------------------------------------------------------------------
// Display-only data cell components (for use in column.render)
// ---------------------------------------------------------------------------

/**
 * TextCell - Display-only text with optional primary/secondary variant and bold
 */
export interface TextCellProps extends BaseComponentProps {
  /**
   * The text to display
   */
  value: string;
  /**
   * Text color variant
   */
  variant?: 'primary' | 'secondary';
  /**
   * If true, text is bold
   */
  bold?: boolean;
  /**
   * If true, text does not wrap (truncates with ellipsis)
   */
  noWrap?: boolean;
}

export const TextCell: React.FC<TextCellProps> = ({
  className,
  'data-testid': testId,
  value,
  variant = 'primary',
  bold = false,
  noWrap = false,
}) => {
  return (
    <Typography
      className={className}
      data-testid={testId}
      variant="body2"
      sx={{
        fontSize: '14px',
        fontWeight: bold ? 600 : 400,
        color: variant === 'secondary' ? 'text.secondary' : 'text.primary',
        ...(noWrap && { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
      }}
    >
      {value}
    </Typography>
  );
};

/**
 * NumberCell - Display-only numeric value, right-aligned
 */
export interface NumberCellProps extends BaseComponentProps {
  /**
   * The numeric value to display
   */
  value: number | string;
  /**
   * Optional formatter (e.g. locale or decimals)
   */
  format?: (n: number) => string;
}

export const NumberCell: React.FC<NumberCellProps> = ({
  className,
  'data-testid': testId,
  value,
  format,
}) => {
  const num = typeof value === 'string' ? Number(value) : value;
  const display = format && typeof num === 'number' && !Number.isNaN(num) ? format(num) : String(value);
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{ width: '100%', textAlign: 'right' }}
    >
      <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary' }}>
        {display}
      </Typography>
    </Box>
  );
};

export type BadgeCellVariant = 'inbound' | 'outbound' | 'success' | 'failed' | 'unknown';

/**
 * BadgeCell - Small circular icon + colored label (e.g. Direction, Status)
 */
export interface BadgeCellProps extends BaseComponentProps {
  /**
   * Label text (e.g. "Inbound", "Success")
   */
  label: string;
  /**
   * Visual variant; maps to palette colors
   */
  variant: BadgeCellVariant;
  /**
   * Optional custom icon; otherwise derived from variant
   */
  icon?: ReactNode;
}

const BADGE_ICONS: Record<BadgeCellVariant, ReactNode> = {
  inbound: <ArrowForwardIcon sx={{ fontSize: 16 }} />,
  outbound: <ArrowBackIcon sx={{ fontSize: 16 }} />,
  success: <CheckIcon sx={{ fontSize: 16 }} />,
  failed: <CloseIcon sx={{ fontSize: 16 }} />,
  unknown: <HelpOutlineIcon sx={{ fontSize: 16 }} />,
};

type BadgeColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
const BADGE_COLORS: Record<BadgeCellVariant, BadgeColor> = {
  inbound: 'info',
  outbound: 'warning',
  success: 'success',
  failed: 'error',
  unknown: 'default',
};

export const BadgeCell: React.FC<BadgeCellProps> = ({
  className,
  'data-testid': testId,
  label,
  variant,
  icon,
}) => {
  const badgeColor = BADGE_COLORS[variant];
  const iconNode = icon ?? BADGE_ICONS[variant];
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Badge color={badgeColor} variant="dot">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {iconNode}
        </Box>
      </Badge>
      <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary' }}>
        {label}
      </Typography>
    </Box>
  );
};


/**
 * TwoLineCell - Primary (bold) + secondary line; no border (read-only)
 */
export interface TwoLineCellProps extends BaseComponentProps {
  /**
   * Primary line (e.g. time)
   */
  primary: string;
  /**
   * Secondary line (e.g. date)
   */
  secondary?: string;
}

export const TwoLineCell: React.FC<TwoLineCellProps> = ({
  className,
  'data-testid': testId,
  primary,
  secondary,
}) => {
  return (
    <Box className={className} data-testid={testId} sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'text.primary',
          lineHeight: 1.5,
        }}
      >
        {primary}
      </Typography>
      {secondary != null && secondary !== '' && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {secondary}
        </Typography>
      )}
    </Box>
  );
};

/**
 * EmptyCell - Placeholder for missing data (e.g. "—")
 */
export interface EmptyCellProps extends BaseComponentProps {
  /**
   * Placeholder when value is empty (default "—")
   */
  placeholder?: string;
}

export const EmptyCell: React.FC<EmptyCellProps> = ({
  className,
  'data-testid': testId,
  placeholder = '—',
}) => {
  return (
    <Typography
      className={className}
      data-testid={testId}
      variant="body2"
      sx={{ fontSize: '14px', color: 'text.secondary' }}
    >
      {placeholder}
    </Typography>
  );
};

// ---------------------------------------------------------------------------
// Editable / compound cells
// ---------------------------------------------------------------------------

/**
 * TextInputCell - Editable text cell with underline style
 */
export interface TextInputCellProps extends BaseComponentProps {
  /**
   * The value of the input
   */
  value?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Callback fired when the value changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
}

export const TextInputCell: React.FC<TextInputCellProps> = ({
  className,
  'data-testid': testId,
  value,
  placeholder = 'Text',
  onChange,
  disabled = false,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        width: '100%',
        position: 'relative',
        padding: '8px 0',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      <MuiTextField
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        variant="standard"
        fullWidth
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          '& .MuiInputBase-root': {
            '&::before': {
              display: 'none',
            },
            '&::after': {
              display: 'none',
            },
          },
          '& .MuiInputBase-input': {
            padding: 0,
            fontSize: '14px',
            color: 'text.primary',
            '&::placeholder': {
              color: 'text.secondary',
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
};

/**
 * NumberStepperCell - Numeric input with increment/decrement controls
 */
export interface NumberStepperCellProps extends BaseComponentProps {
  /**
   * The numeric value
   */
  value?: number;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Callback fired when the value changes
   */
  onChange?: (value: number) => void;
  /**
   * If true, the input is disabled
   */
  disabled?: boolean;
}

export const NumberStepperCell: React.FC<NumberStepperCellProps> = ({
  className,
  'data-testid': testId,
  value = 0,
  min,
  max,
  onChange,
  disabled = false,
}) => {
  const handleIncrement = () => {
    if (disabled) return;
    const newValue = value + 1;
    if (max === undefined || newValue <= max) {
      onChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;
    const newValue = value - 1;
    if (min === undefined || newValue >= min) {
      onChange?.(newValue);
    }
  };

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          textAlign: 'center',
          fontSize: '14px',
          color: 'text.primary',
          padding: '8px 0',
        }}
      >
        {value}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          marginLeft: '8px',
        }}
      >
        <IconButton
          size="small"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          sx={{
            padding: '2px',
            minWidth: 'auto',
            height: 'auto',
            color: 'success.main',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-disabled': {
              color: 'action.disabled',
            },
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: '16px' }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && value <= min)}
          sx={{
            padding: '2px',
            minWidth: 'auto',
            height: 'auto',
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-disabled': {
              color: 'action.disabled',
            },
          }}
        >
          <ArrowDownwardIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

/**
 * LabelCell - Cell with primary and secondary text
 */
export interface LabelCellProps extends BaseComponentProps {
  /**
   * Primary label text
   */
  label: string;
  /**
   * Secondary text
   */
  secondaryText?: string;
}

export const LabelCell: React.FC<LabelCellProps> = ({
  className,
  'data-testid': testId,
  label,
  secondaryText,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '8px 0',
        width: '100%',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'text.primary',
          lineHeight: 1.5,
        }}
      >
        {label}
      </Typography>
      {secondaryText && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '12px',
            fontWeight: 400,
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {secondaryText}
        </Typography>
      )}
    </Box>
  );
};

/**
 * TagCell - Single informational tag cell
 */
export interface TagCellProps extends BaseComponentProps {
  /**
   * The label text for the tag
   */
  label: string;
  /**
   * The variant of the tag
   */
  variant?: 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary';
  /**
   * If true, hides the icon
   */
  hideIcon?: boolean;
}

export const TagCell: React.FC<TagCellProps> = ({
  className,
  'data-testid': testId,
  label,
  variant = 'info',
  hideIcon = false,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        width: '100%',
      }}
    >
      <Tag label={label} variant={variant} size="small" hideIcon={hideIcon} />
    </Box>
  );
};

/**
 * TagsCell - Multiple tags display cell
 */
export interface TagsCellProps extends BaseComponentProps {
  /**
   * Array of tag labels
   */
  tags: string[];
  /**
   * The variant for all tags
   */
  variant?: 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary';
  /**
   * Maximum number of tags to display
   */
  maxTags?: number;
}

export const TagsCell: React.FC<TagsCellProps> = ({
  className,
  'data-testid': testId,
  tags,
  variant = 'neutral',
  maxTags,
}) => {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px 0',
        width: '100%',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      {displayTags.map((tag, index) => (
        <Tag key={index} label={tag} variant={variant} size="small" hideIcon />
      ))}
    </Box>
  );
};

/**
 * CheckboxCell - Checkbox for row selection
 */
export interface CheckboxCellProps extends BaseComponentProps {
  /**
   * If true, the checkbox is checked
   */
  checked?: boolean;
  /**
   * If true, the checkbox is indeterminate
   */
  indeterminate?: boolean;
  /**
   * If true, the checkbox is disabled
   */
  disabled?: boolean;
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const CheckboxCell: React.FC<CheckboxCellProps> = ({
  className,
  'data-testid': testId,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        width: '100%',
      }}
    >
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={onChange}
        size="medium"
      />
    </Box>
  );
};

/**
 * ActionIconsCell - Cell with action icons (radio, delete, more options)
 */
export interface ActionIconsCellProps extends BaseComponentProps {
  /**
   * Number of radio button icons to show (0-2)
   */
  radioCount?: 0 | 1 | 2;
  /**
   * If true, shows delete icon
   */
  showDelete?: boolean;
  /**
   * If true, shows more options icon
   */
  showMore?: boolean;
  /**
   * Callback fired when radio is clicked
   */
  onRadioClick?: (event: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  /**
   * Callback fired when delete is clicked
   */
  onDeleteClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when more options is clicked
   */
  onMoreClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If true, the actions are disabled
   */
  disabled?: boolean;
}

export const ActionIconsCell: React.FC<ActionIconsCellProps> = ({
  className,
  'data-testid': testId,
  radioCount = 2,
  showDelete = true,
  showMore = true,
  onRadioClick,
  onDeleteClick,
  onMoreClick,
  disabled = false,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
        padding: '8px 0',
        width: '100%',
      }}
    >
      {Array.from({ length: radioCount }).map((_, index) => (
        <IconButton
          key={index}
          size="small"
          onClick={(e) => onRadioClick?.(e, index)}
          disabled={disabled}
          sx={{
            padding: '4px',
            minWidth: 'auto',
            height: 'auto',
          }}
        >
          <RadioButtonUncheckedIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      ))}
      {showDelete && (
        <IconButton
          size="small"
          onClick={onDeleteClick}
          disabled={disabled}
          sx={{
            padding: '4px',
            minWidth: 'auto',
            height: 'auto',
          }}
        >
          <DeleteIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      )}
      {showMore && (
        <IconButton
          size="small"
          onClick={onMoreClick}
          disabled={disabled}
          sx={{
            padding: '4px',
            minWidth: 'auto',
            height: 'auto',
          }}
        >
          <MoreVertIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      )}
    </Box>
  );
};


