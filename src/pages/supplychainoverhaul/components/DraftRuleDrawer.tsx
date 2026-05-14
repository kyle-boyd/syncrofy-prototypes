import React from 'react';
import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SideSheet } from '../../../components/SideSheet';
import { Textarea } from '../../../components/Textarea';

export interface DraftRuleDrawerProps {
  open: boolean;
  onClose: () => void;
  onActivate: () => void;
  onSaveDraft: () => void;
}

const DEFAULT_STATEMENT =
  'When a Walmart 856 ASN is past its expected window by more than 15 minutes, automatically reassign the exception to Maria Chen and snooze for 30 minutes pending partner response.';

interface HistoricalHit {
  id: string;
  date: string;
  partner: string;
  detail: string;
}

const HISTORICAL: HistoricalHit[] = [
  { id: 'EX-h-2270', date: 'Apr 09', partner: 'Walmart', detail: '856 ASN late by 22m · PO 4521-0982' },
  { id: 'EX-h-2284', date: 'Apr 11', partner: 'Walmart', detail: '856 ASN late by 18m · PO 4521-0997' },
  { id: 'EX-h-2295', date: 'Apr 14', partner: 'Walmart', detail: '856 ASN late by 41m · PO 4521-1003' },
  { id: 'EX-h-2308', date: 'Apr 17', partner: 'Walmart', detail: '856 ASN late by 16m · PO 4521-1014' },
  { id: 'EX-h-2317', date: 'Apr 20', partner: 'Walmart', detail: '856 ASN late by 27m · PO 4521-1019' },
  { id: 'EX-h-2329', date: 'Apr 24', partner: 'Walmart', detail: '856 ASN late by 19m · PO 4521-1028' },
  { id: 'EX-h-2341', date: 'Apr 28', partner: 'Walmart', detail: '856 ASN late by 33m · PO 4521-1031' },
  { id: 'EX-h-2356', date: 'May 01', partner: 'Walmart', detail: '856 ASN late by 21m · PO 4521-1037' },
  { id: 'EX-h-2362', date: 'May 03', partner: 'Walmart', detail: '856 ASN late by 24m · PO 4521-1039' },
];

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="baseline">
      <Typography variant="caption" color="text.secondary" sx={{ width: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function DraftRuleDrawer({ open, onClose, onActivate, onSaveDraft }: DraftRuleDrawerProps) {
  const [statement, setStatement] = React.useState(DEFAULT_STATEMENT);

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      title="Draft routing rule"
      width={560}
      footer={
        <>
          <Button variant="text" color="secondary" onClick={onClose}>
            Dismiss
          </Button>
          <Button variant="outlined" color="primary" onClick={onSaveDraft}>
            Save as draft
          </Button>
          <Button variant="contained" color="primary" onClick={onActivate}>
            Activate rule
          </Button>
        </>
      }
    >
      <Stack spacing={3}>
        <Section title="Rule statement">
          <Textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            minRows={3}
            maxRows={8}
          />
        </Section>

        <Section title="Trigger conditions">
          <Stack
            spacing={1}
            sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'grey.50' }}
          >
            <MetaRow label="Partner" value="Walmart" />
            <MetaRow label="Doc type" value="856" />
            <MetaRow label="State" value="Past expected window" />
            <MetaRow label="Threshold" value="15 minutes" />
          </Stack>
        </Section>

        <Section title="Recommended action">
          <Stack
            spacing={1}
            sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'grey.50' }}
          >
            <MetaRow label="Action" value="Reassign to Maria Chen" />
            <MetaRow label="Then" value="Snooze 30m" />
          </Stack>
        </Section>

        <Section title="Dry-run preview">
          <Box
            sx={(t) => ({
              p: 1.5,
              borderLeft: '2px solid',
              borderColor: 'primary.main',
              bgcolor: alpha(t.palette.primary.main, 0.04),
              borderRadius: 0.5,
              mb: 1.5,
            })}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              If this rule had been active for the last 30 days, it would have fired on 7 of 30 days, affecting 9 exceptions.
            </Typography>
          </Box>
          <Stack
            divider={<Divider flexItem />}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}
          >
            {HISTORICAL.map((h) => (
              <Box key={h.id} sx={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr auto', alignItems: 'center', gap: 1, px: 1.5, py: 1 }}>
                <Typography variant="caption" color="text.secondary">{h.date}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{h.id}</Typography>
                <Typography variant="body2" noWrap>{h.detail}</Typography>
                <Chip label="historical, dry-run" size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
              </Box>
            ))}
          </Stack>
        </Section>

        <Section title="Conflict check">
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={(t) => ({ p: 1.5, borderRadius: 1.5, bgcolor: alpha(t.palette.success.main, 0.06) })}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'success.main' }} />
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 500 }}>
              No conflicts with existing rules
            </Typography>
          </Stack>
        </Section>
      </Stack>
    </SideSheet>
  );
}

export default DraftRuleDrawer;
