import React from 'react';
import { Box, Divider, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface DemoButton {
  label: string;
  icon: React.ReactElement;
  color?: 'default' | 'primary' | 'secondary' | 'error';
  disabled?: boolean;
  placement?: Placement;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const COMMON_ACTIONS: DemoButton[] = [
  { label: 'Edit', icon: <EditOutlinedIcon /> },
  { label: 'Delete', icon: <DeleteOutlineIcon />, color: 'error' },
  { label: 'Share', icon: <ShareOutlinedIcon /> },
  { label: 'Download', icon: <DownloadOutlinedIcon /> },
  { label: 'Copy', icon: <ContentCopyOutlinedIcon /> },
  { label: 'Refresh', icon: <RefreshOutlinedIcon /> },
  { label: 'Filter', icon: <FilterListIcon /> },
  { label: 'Settings', icon: <SettingsOutlinedIcon /> },
  { label: 'Preview', icon: <VisibilityOutlinedIcon /> },
  { label: 'More options', icon: <MoreVertIcon /> },
];

const PLACEMENT_DEMOS: { placement: Placement; label: string; icon: React.ReactElement }[] = [
  { placement: 'top', label: 'Tooltip above', icon: <EditOutlinedIcon /> },
  { placement: 'right', label: 'Tooltip right', icon: <ShareOutlinedIcon /> },
  { placement: 'bottom', label: 'Tooltip below', icon: <DownloadOutlinedIcon /> },
  { placement: 'left', label: 'Tooltip left', icon: <SettingsOutlinedIcon /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

function DemoCard({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <Box
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'background.paper',
      }}
    >
      {label && (
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 2 }}>
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', minWidth: 180, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IconButtonTooltips() {
  return (
    <Box sx={{ bgcolor: '#FAFCFC', minHeight: '100vh', p: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>

        {/* Page header */}
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.4px' }}>
            Icon Button — Hover Tooltips
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 600 }}>
            Icon-only buttons should always display a tooltip on hover that identifies the action.
            Because the button has no visible label, the tooltip is the primary way users discover
            what each button does — it is not optional.
          </Typography>
        </Stack>

        {/* ── Section 1: Common actions ── */}
        <Box sx={{ mb: 5 }}>
          <SectionHeader
            title="Common actions"
            description="Hover each button to see its tooltip. The label matches what the action does, written in plain language."
          />
          <DemoCard>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {COMMON_ACTIONS.map(({ label, icon, color, disabled }) => (
                <Tooltip key={label} title={label} placement="top">
                  <IconButton color={color ?? 'default'} disabled={disabled} size="medium">
                    {icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </DemoCard>
        </Box>

        {/* ── Section 2: Tooltip placement ── */}
        <Box sx={{ mb: 5 }}>
          <SectionHeader
            title="Tooltip placement"
            description="Tooltips default to appearing above the button. Use a different placement when the button is near the edge of the viewport or when another element would obstruct the tooltip."
          />
          <DemoCard>
            <Stack
              direction="row"
              spacing={4}
              alignItems="center"
              justifyContent="center"
              sx={{ py: 3 }}
            >
              {PLACEMENT_DEMOS.map(({ placement, label, icon }) => (
                <Stack key={placement} alignItems="center" spacing={1}>
                  <Tooltip title={label} placement={placement}>
                    <IconButton size="medium">{icon}</IconButton>
                  </Tooltip>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {placement}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </DemoCard>
        </Box>

        {/* ── Section 3: Disabled state ── */}
        <Box sx={{ mb: 5 }}>
          <SectionHeader
            title="Disabled state"
            description="Disabled icon buttons do not show a tooltip on hover. If the reason for disabling is not obvious from context, use a different pattern — such as disabling the action with a visible explanation — rather than relying on a tooltip."
          />
          <DemoCard>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Edit" placement="top">
                <IconButton size="medium">
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                Enabled
              </Typography>

              <Box sx={{ width: 24 }} />

              {/* MUI Tooltip doesn't show on disabled buttons without a wrapper span */}
              <Tooltip title="" placement="top">
                <span>
                  <IconButton size="medium" disabled>
                    <EditOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Disabled (no tooltip)
              </Typography>
            </Stack>
          </DemoCard>
        </Box>

        {/* ── Section 4: Sizes ── */}
        <Box sx={{ mb: 5 }}>
          <SectionHeader
            title="Button sizes"
            description="Tooltips work the same across all icon button sizes."
          />
          <DemoCard>
            <Stack direction="row" spacing={2} alignItems="center">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Stack key={size} alignItems="center" spacing={1}>
                  <Tooltip title={`${size.charAt(0).toUpperCase() + size.slice(1)} button`} placement="top">
                    <IconButton size={size}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {size}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </DemoCard>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* ── Engineering spec ── */}
        <Box>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Engineering spec
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Requirements for implementing icon button tooltips across the product.
            </Typography>
          </Stack>

          <Stack spacing={3}>

            {/* Behavior */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Behavior
              </Typography>
              <DemoCard>
                <SpecRow label="Trigger" value="Mouse hover (pointer enter)" />
                <SpecRow label="Enter delay" value="500 ms — prevents tooltips from flashing during quick cursor movement" />
                <SpecRow label="Leave delay" value="0 ms (hide immediately on pointer leave)" />
                <SpecRow label="Default placement" value="top" />
                <SpecRow label="Disabled buttons" value="No tooltip. Wrap in a <span> if a tooltip is required on a disabled element." />
                <SpecRow label="Touch / mobile" value="No tooltip on touch devices — labels should be visible or the action accessible another way" />
              </DemoCard>
            </Box>

            {/* Copy guidelines */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Tooltip copy guidelines
              </Typography>
              <DemoCard>
                <SpecRow label="Format" value={'Verb + noun, sentence case. Example: \u201cDelete record\u201d, \u201cDownload CSV\u201d, \u201cShare link\u201d'} />
                <SpecRow label="Length" value="2–4 words preferred. Never exceed 6 words." />
                <SpecRow label="Punctuation" value="No trailing period." />
                <SpecRow label="Avoid" value={'Vague labels like \u201cMore\u201d, \u201cAction\u201d, or duplicating the icon name (e.g., \u201cPencil icon\u201d)'} />
              </DemoCard>
            </Box>

            {/* Implementation */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Implementation
              </Typography>
              <DemoCard>
                <SpecRow label="Component" value="Wrap every <IconButton> with <Tooltip title='...'>" />
                <SpecRow label="Accessibility" value="The Tooltip title doubles as the accessible name when aria-label is absent. If an aria-label is already set, the tooltip title should match it exactly." />
                <SpecRow label="Scope" value="All icon-only buttons in the product. Buttons with a visible text label do not need a tooltip." />
              </DemoCard>
            </Box>

          </Stack>
        </Box>

      </Box>
    </Box>
  );
}
