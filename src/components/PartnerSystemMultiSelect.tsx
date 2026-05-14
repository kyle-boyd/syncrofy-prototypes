import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  Popover,
  TextField,
  InputAdornment,
  Typography,
  Checkbox,
  Divider,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface PartnerSystemOption {
  value: string;
  label: string;
}

export interface PartnerSystemSections {
  linesOfBusiness: PartnerSystemOption[];
  partners: PartnerSystemOption[];
  systems: PartnerSystemOption[];
  uncategorized: PartnerSystemOption[];
}

export const DEFAULT_PARTNER_SYSTEM_SECTIONS: PartnerSystemSections = {
  linesOfBusiness: [
    { value: 'lob_finance', label: 'Finance' },
    { value: 'lob_logistics', label: 'Logistics' },
    { value: 'lob_manufacturing', label: 'Manufacturing' },
    { value: 'lob_retail', label: 'Retail' },
    { value: 'lob_healthcare', label: 'Healthcare' },
    { value: 'lob_energy', label: 'Energy' },
    { value: 'lob_technology', label: 'Technology' },
  ],
  partners: [
    { value: 'jd', label: 'John Deere' },
    { value: 'anderson', label: 'Anderson & Sons' },
    { value: 'summit', label: 'Summit Energy Partners' },
    { value: 'acme', label: 'Acme Corp' },
    { value: 'goldman', label: 'Goldman Sachs' },
    { value: 'fidelity', label: 'Fidelity' },
  ],
  systems: [
    { value: 'sap', label: 'SAP Krishna' },
    { value: 'aws', label: 'AWS S3' },
    { value: 'mainframe', label: 'Mainframe' },
    { value: 'core_banking', label: 'Core Banking System' },
    { value: 'trade_settlement', label: 'Trade Settlement Platform' },
  ],
  uncategorized: [
    { value: '1234', label: '1234' },
    { value: 'coe_test', label: 'COE_Test_Internal_System' },
    { value: 'unnamed_sftp', label: 'sftp.unnamed-host.com' },
  ],
};

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  sections?: PartnerSystemSections;
  width?: number | string;
  placeholder?: string;
}

const filterOptions = (options: PartnerSystemOption[], q: string) => {
  if (!q) return options;
  const lower = q.toLowerCase();
  return options.filter((o) => o.label.toLowerCase().includes(lower));
};

const PartnerSystemMultiSelect: React.FC<Props> = ({
  value,
  onChange,
  sections = DEFAULT_PARTNER_SYSTEM_SECTIONS,
  width = 240,
  placeholder = 'Select Partner or System',
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => ({
      linesOfBusiness: filterOptions(sections.linesOfBusiness, query),
      partners: filterOptions(sections.partners, query),
      systems: filterOptions(sections.systems, query),
      uncategorized: filterOptions(sections.uncategorized, query),
    }),
    [sections, query],
  );

  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  const toggleAll = (options: PartnerSystemOption[]) => {
    const optionValues = options.map((o) => o.value);
    const allSelected = optionValues.every((v) => value.includes(v));
    if (allSelected) {
      onChange(value.filter((v) => !optionValues.includes(v)));
    } else {
      const next = new Set(value);
      optionValues.forEach((v) => next.add(v));
      onChange(Array.from(next));
    }
  };

  const isAllSelected = (options: PartnerSystemOption[]) =>
    options.length > 0 && options.every((o) => value.includes(o.value));

  const allOptions = useMemo(
    () => [
      ...sections.linesOfBusiness,
      ...sections.partners,
      ...sections.systems,
      ...sections.uncategorized,
    ],
    [sections],
  );

  const triggerLabel = (() => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const found = allOptions.find((o) => o.value === value[0]);
      return found?.label ?? '1 selected';
    }
    return `${value.length} selected`;
  })();

  return (
    <>
      <Button
        ref={anchorRef}
        variant="outlined"
        color="inherit"
        onClick={() => setOpen(true)}
        endIcon={<ExpandMoreIcon />}
        sx={{
          width,
          height: 40,
          justifyContent: 'space-between',
          textTransform: 'none',
          fontWeight: 400,
          fontSize: 14,
          color: value.length === 0 ? 'text.secondary' : 'text.primary',
          borderColor: 'rgba(0,0,0,0.23)',
          bgcolor: 'background.paper',
          '&:hover': { borderColor: 'text.primary', bgcolor: 'background.paper' },
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            flex: 1,
          }}
        >
          {triggerLabel}
        </Box>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              maxHeight: 480,
              mt: 0.5,
              borderRadius: '8px',
              boxShadow: 3,
            },
          },
        }}
      >
        <Box sx={{ p: 1.5, pb: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ maxHeight: 400, overflowY: 'auto', pb: 1 }}>
          {/* Lines of Business — chip toggle style */}
          {filtered.linesOfBusiness.length > 0 && (
            <Box sx={{ px: 1.5, pb: 1 }}>
              <SectionHeader
                title="Lines of Business"
                allSelected={isAllSelected(filtered.linesOfBusiness)}
                onToggleAll={() => toggleAll(filtered.linesOfBusiness)}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {filtered.linesOfBusiness.map((o) => {
                  const selected = value.includes(o.value);
                  return (
                    <Box
                      key={o.value}
                      onClick={() => toggle(o.value)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.25,
                        py: 0.375,
                        borderRadius: 999,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500,
                        userSelect: 'none',
                        bgcolor: selected ? '#0F6B7A' : '#E6F2F4',
                        color: selected ? '#FFFFFF' : '#0F6B7A',
                        border: '1px solid',
                        borderColor: selected ? '#0F6B7A' : '#CFE4E8',
                        '&:hover': {
                          bgcolor: selected ? '#0B5662' : '#D4E8EC',
                        },
                      }}
                    >
                      {selected && <CheckIcon sx={{ fontSize: 14 }} />}
                      {o.label}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {filtered.linesOfBusiness.length > 0 &&
            (filtered.partners.length > 0 ||
              filtered.systems.length > 0 ||
              filtered.uncategorized.length > 0) && <Divider sx={{ my: 0.5 }} />}

          <CheckboxSection
            title="Partners"
            options={filtered.partners}
            selected={value}
            onToggle={toggle}
            allSelected={isAllSelected(filtered.partners)}
            onToggleAll={() => toggleAll(filtered.partners)}
          />
          {filtered.partners.length > 0 && filtered.systems.length > 0 && (
            <Divider sx={{ my: 0.5 }} />
          )}
          <CheckboxSection
            title="Systems"
            options={filtered.systems}
            selected={value}
            onToggle={toggle}
            allSelected={isAllSelected(filtered.systems)}
            onToggleAll={() => toggleAll(filtered.systems)}
          />
          {(filtered.partners.length > 0 || filtered.systems.length > 0) &&
            filtered.uncategorized.length > 0 && <Divider sx={{ my: 0.5 }} />}
          <CheckboxSection
            title="Uncategorized"
            options={filtered.uncategorized}
            selected={value}
            onToggle={toggle}
            allSelected={isAllSelected(filtered.uncategorized)}
            onToggleAll={() => toggleAll(filtered.uncategorized)}
          />
        </Box>
      </Popover>
    </>
  );
};

const SectionHeader: React.FC<{
  title: string;
  allSelected: boolean;
  onToggleAll: () => void;
}> = ({ title, allSelected, onToggleAll }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 0.5,
    }}
  >
    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
      {title}
    </Typography>
    <Box
      component="button"
      type="button"
      onClick={onToggleAll}
      sx={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        p: 0,
        fontSize: 12,
        fontWeight: 500,
        color: '#0F6B7A',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {allSelected ? 'Clear all' : 'Select all'}
    </Box>
  </Box>
);

const CheckboxSection: React.FC<{
  title: string;
  options: PartnerSystemOption[];
  selected: string[];
  onToggle: (v: string) => void;
  allSelected: boolean;
  onToggleAll: () => void;
}> = ({ title, options, selected, onToggle, allSelected, onToggleAll }) => {
  if (options.length === 0) return null;
  return (
    <Box sx={{ px: 1.5, py: 0.5 }}>
      <SectionHeader title={title} allSelected={allSelected} onToggleAll={onToggleAll} />
      <Box>
        {options.map((o) => (
          <Box
            key={o.value}
            onClick={() => onToggle(o.value)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.5,
              py: 0.25,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Checkbox
              size="small"
              checked={selected.includes(o.value)}
              sx={{ p: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggle(o.value)}
            />
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {o.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PartnerSystemMultiSelect;
