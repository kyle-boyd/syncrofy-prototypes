import { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  Chip,
  Divider,
} from '@mui/material';
import {
  Button,
  Tag,
  Badge,
  Stepper,
  Table,
  TableColumn,
  Input,
} from '@kyleboyd/design-system';
import type { Step } from '@kyleboyd/design-system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Types
interface Mapping {
  id: string;
  sourcePath: string;
  sourceLabel: string;
  targetPath: string;
  targetLabel: string;
  confidence: number;
  status: 'mapped' | 'missing' | 'ambiguous';
  comment: string;
}

interface MRSData {
  mrsId: string;
  generatedAt: string;
  documentType: string;
  summary: {
    totalFields: number;
    mapped: number;
    lowConfidence: number;
    missing: number;
  };
  mappings: Mapping[];
}

interface ValidationData {
  mrsId: string;
  validatedAt: string;
  summary: {
    status: 'pass' | 'fail';
    errorCount: number;
    warningCount: number;
  };
  issues: Array<{
    id: string;
    severity: 'error' | 'warning';
    mappingId: string;
    message: string;
  }>;
  outputPreview: {
    format: string;
    content: string;
  };
  canMarkReady: boolean;
}

type Screen = 'setup' | 'review' | 'editor' | 'validation' | 'audit';

const STEPS: Step[] = [
  { id: 'setup', label: 'Project Setup' },
  { id: 'review', label: 'Auto-MRS Review' },
  { id: 'editor', label: 'MRS & Mapping Editor' },
  { id: 'validation', label: 'Validation & Output' },
  { id: 'audit', label: 'Audit & Evidence' },
];

function IntegrationCloud() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup');
  const [poData, setPoData] = useState<any>(null);
  const [mrsData, setMrsData] = useState<MRSData | null>(null);
  const [validationData, setValidationData] = useState<ValidationData | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [editingMapping, setEditingMapping] = useState<Mapping | null>(null);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [targetFields, setTargetFields] = useState<string[]>([]);

  // Load 850 sample data
  const load850Sample = async () => {
    try {
      const response = await fetch('/sic/850-sample.json');
      const data = await response.json();
      setPoData(data);
      
      // Generate source fields from PO data
      const fields: string[] = [];
      if (data.header) {
        Object.keys(data.header).forEach(key => {
          fields.push(`header.${key}`);
        });
      }
      if (data.parties) {
        Object.keys(data.parties).forEach(party => {
          if (typeof data.parties[party] === 'object') {
            Object.keys(data.parties[party]).forEach(key => {
              fields.push(`parties.${party}.${key}`);
            });
          }
        });
      }
      if (data.lineItems) {
        data.lineItems.forEach((item: any, idx: number) => {
          Object.keys(item).forEach(key => {
            fields.push(`lineItems[${idx}].${key}`);
          });
        });
      }
      setSourceFields([...new Set(fields)]);
      
      // Generate target fields (fake target structure)
      setTargetFields([
        'Order.header.orderNumber',
        'Order.header.orderDate',
        'Order.header.currency',
        'Order.header.buyerReference',
        'Order.parties.buyer.name',
        'Order.parties.vendor.name',
        'Order.parties.shipTo.address',
        'Order.lines[].quantity',
        'Order.lines[].price',
        'Order.lines[].productCode',
        'Order.lines[].description',
        'Order.lines[].requestedDate',
        'Order.summary.lineCount',
      ]);
    } catch (error) {
      console.error('Failed to load 850 sample:', error);
    }
  };

  // Load MRS data
  const loadMRS = async () => {
    try {
      const response = await fetch('/sic/mrs-auto-generated.json');
      const data = await response.json();
      setMrsData(data);
      setMappings([...data.mappings]);
    } catch (error) {
      console.error('Failed to load MRS:', error);
    }
  };

  // Load validation data
  const loadValidation = async () => {
    try {
      const response = await fetch('/sic/validation-results.json');
      const data = await response.json();
      setValidationData(data);
    } catch (error) {
      console.error('Failed to load validation:', error);
    }
  };

  // Get current step index
  const getCurrentStepIndex = () => {
    return STEPS.findIndex(step => step.id === currentScreen);
  };

  // Navigation handlers
  const handleGenerateMRS = () => {
    loadMRS();
    setCurrentScreen('review');
  };

  const handleEditMRS = () => {
    setCurrentScreen('editor');
  };

  const handleValidate = () => {
    loadValidation();
    setCurrentScreen('validation');
  };

  const handleMarkReady = () => {
    setCurrentScreen('audit');
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentScreen(STEPS[currentIndex - 1].id as Screen);
    }
  };

  // Mapping editor handlers
  const handleMappingSelect = (mappingId: string) => {
    const mapping = mappings.find(m => m.id === mappingId);
    if (mapping) {
      setSelectedMappingId(mappingId);
      setEditingMapping({ ...mapping });
    }
  };

  const handleSaveMapping = () => {
    if (editingMapping) {
      const updatedMappings = mappings.map(m =>
        m.id === editingMapping.id ? { ...editingMapping, confidence: 0.95, status: 'mapped' as const } : m
      );
      setMappings(updatedMappings);
      setEditingMapping(null);
      setSelectedMappingId(null);
    }
  };

  // Filtered mappings for review screen
  const filteredMappings = showIssuesOnly
    ? mappings.filter(m => m.status === 'missing' || m.status === 'ambiguous' || m.confidence < 0.7)
    : mappings;

  // Render Screen 1: Project Setup
  const renderSetup = () => (
    <Container maxWidth="md">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            850 Purchase Order Mapping
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your mapping project for X12 850 Purchase Order documents
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Document Type
              </Typography>
              <Typography variant="body1">850 - Purchase Order</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Partner Name
              </Typography>
              <Typography variant="body1">WW Grainger Inc</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Button
                variant="outlined"
                onClick={load850Sample}
                sx={{ mb: 2 }}
              >
                Upload Sample 850
              </Button>
              {poData && (
                <Chip
                  label="Sample 850 loaded"
                  color="success"
                  icon={<CheckCircleIcon />}
                  sx={{ ml: 2 }}
                />
              )}
            </Box>

            <Box>
              <Button variant="outlined" disabled>
                Upload Output Spec
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2, display: 'inline-block' }}>
                (Optional)
              </Typography>
            </Box>

            <Box sx={{ pt: 2 }}>
              <Button
                variant="contained"
                onClick={handleGenerateMRS}
                disabled={!poData}
                size="large"
              >
                Generate MRS
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );

  // Render Screen 2: Auto-MRS Review
  const renderReview = () => {
    if (!mrsData) return null;

    const reviewColumns: TableColumn<Mapping>[] = [
      {
        id: 'source',
        label: 'Source Field',
        render: (row) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.sourceLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.sourcePath}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'target',
        label: 'Target Field',
        render: (row) => (
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.targetLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.targetPath}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'confidence',
        label: 'Confidence',
        render: (row) => (
          <Typography variant="body2">
            {Math.round(row.confidence * 100)}%
          </Typography>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => {
          const statusConfig = {
            mapped: { variant: 'success' as const, label: 'Mapped' },
            ambiguous: { variant: 'warning' as const, label: 'Ambiguous' },
            missing: { variant: 'error' as const, label: 'Missing' },
          };
          const config = statusConfig[row.status];
          return <Tag label={config.label} variant={config.variant} size="small" />;
        },
      },
    ];

    return (
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Auto-MRS Review
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review the automatically generated mapping rules
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Fields
                  </Typography>
                  <Typography variant="h4">{mrsData.summary.totalFields}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Auto-Mapped
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {mrsData.summary.mapped}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Low Confidence
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {mrsData.summary.lowConfidence}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Missing Mappings
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {mrsData.summary.missing}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Mapping Rules</Typography>
                <FormControlLabel
                  control={
                    <MuiCheckbox
                      checked={showIssuesOnly}
                      onChange={(e) => setShowIssuesOnly(e.target.checked)}
                    />
                  }
                  label="Show issues only"
                />
              </Box>

              <Table
                columns={reviewColumns}
                rows={filteredMappings}
                getRowId={(row) => row.id}
                onRowClick={(row) => handleMappingSelect(row.id)}
                sx={{ cursor: 'pointer' }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button variant="contained" onClick={handleEditMRS}>
                  Edit MRS
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  };

  // Render Screen 3: MRS & Mapping Editor
  const renderEditor = () => {
    const selectedMapping = mappings.find(m => m.id === selectedMappingId);

    return (
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              MRS & Mapping Editor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Edit mapping rules between source and target fields
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left: Source Fields */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, maxHeight: '600px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Source Fields
                </Typography>
                <Stack spacing={1}>
                  {sourceFields.map((field, idx) => (
                    <Box
                      key={idx}
                      onClick={() => {
                        if (selectedMapping) {
                          setEditingMapping({
                            ...selectedMapping,
                            sourcePath: field,
                            sourceLabel: field.split('.').pop() || field,
                          });
                        }
                      }}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: selectedMapping?.sourcePath === field ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Typography variant="body2" fontSize="0.75rem">
                        {field}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Center: Mapping Rules */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Mapping Rules
                </Typography>

                {selectedMapping ? (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Source
                      </Typography>
                      <Input
                        value={editingMapping?.sourcePath || selectedMapping.sourcePath}
                        onChange={(e) =>
                          setEditingMapping({
                            ...selectedMapping,
                            sourcePath: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Target
                      </Typography>
                      <Input
                        value={editingMapping?.targetPath || selectedMapping.targetPath}
                        onChange={(e) =>
                          setEditingMapping({
                            ...selectedMapping,
                            targetPath: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Comment
                      </Typography>
                      <TextField
                        multiline
                        rows={3}
                        value={editingMapping?.comment || selectedMapping.comment}
                        onChange={(e) =>
                          setEditingMapping({
                            ...selectedMapping,
                            comment: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="contained" onClick={handleSaveMapping}>
                        Save Mapping
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedMappingId(null);
                          setEditingMapping(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Select a mapping from the table or click a source/target field to create a new mapping
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  All Mappings
                </Typography>
                <Table
                  columns={[
                    {
                      id: 'source',
                      label: 'Source',
                      render: (row) => <Typography variant="body2">{row.sourceLabel}</Typography>,
                    },
                    {
                      id: 'target',
                      label: 'Target',
                      render: (row) => <Typography variant="body2">{row.targetLabel}</Typography>,
                    },
                    {
                      id: 'status',
                      label: 'Status',
                      render: (row) => {
                        const statusConfig = {
                          mapped: { variant: 'success' as const, label: 'Mapped' },
                          ambiguous: { variant: 'warning' as const, label: 'Ambiguous' },
                          missing: { variant: 'error' as const, label: 'Missing' },
                        };
                        const config = statusConfig[row.status];
                        return <Tag label={config.label} variant={config.variant} size="small" />;
                      },
                    },
                  ]}
                  rows={mappings}
                  getRowId={(row) => row.id}
                  onRowClick={(row) => handleMappingSelect(row.id)}
                  sx={{ cursor: 'pointer' }}
                />
              </Paper>
            </Grid>

            {/* Right: Target Fields */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, maxHeight: '600px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Target Fields
                </Typography>
                <Stack spacing={1}>
                  {targetFields.map((field, idx) => (
                    <Box
                      key={idx}
                      onClick={() => {
                        if (selectedMapping) {
                          setEditingMapping({
                            ...selectedMapping,
                            targetPath: field,
                            targetLabel: field.split('.').pop() || field,
                          });
                        }
                      }}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: selectedMapping?.targetPath === field ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Typography variant="body2" fontSize="0.75rem">
                        {field}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleValidate}>
              Validate Mapping
            </Button>
          </Box>
        </Stack>
      </Container>
    );
  };

  // Render Screen 4: Validation & Output Preview
  const renderValidation = () => {
    if (!validationData) return null;

    const isPass = validationData.summary.status === 'pass';

    return (
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Validation & Output Preview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review validation results and output preview
            </Typography>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {isPass ? (
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                  ) : (
                    <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                  )}
                  <Box>
                    <Typography variant="h5">
                      Validation {isPass ? 'Passed' : 'Failed'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {validationData.summary.errorCount} errors, {validationData.summary.warningCount} warnings
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {validationData.issues.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Issues
                  </Typography>
                  <Stack spacing={1}>
                    {validationData.issues.map((issue) => {
                      const mapping = mappings.find(m => m.id === issue.mappingId);
                      return (
                        <Box
                          key={issue.id}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: issue.severity === 'error' ? 'error.light' : 'warning.light',
                            border: `1px solid ${issue.severity === 'error' ? 'error.main' : 'warning.main'}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {issue.severity === 'error' ? (
                              <ErrorIcon color="error" fontSize="small" />
                            ) : (
                              <WarningIcon color="warning" fontSize="small" />
                            )}
                            <Typography variant="subtitle2" textTransform="uppercase">
                              {issue.severity}
                            </Typography>
                            {mapping && (
                              <Chip
                                label={mapping.sourceLabel}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          <Typography variant="body2">{issue.message}</Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              <Box>
                <Typography variant="h6" gutterBottom>
                  Output Preview
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '400px',
                    overflow: 'auto',
                  }}
                >
                  {validationData.outputPreview.content}
                </Paper>
              </Box>
            </Stack>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleMarkReady}
              disabled={!validationData.canMarkReady}
            >
              Mark as Ready
            </Button>
          </Box>
        </Stack>
      </Container>
    );
  };

  // Render Screen 5: Audit & Evidence
  const renderAudit = () => (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Audit & Evidence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mapping version history and generated artifacts
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mapping Version History
              </Typography>
              <Stack spacing={2}>
                {[
                  { version: 'v1.2', timestamp: '2025-01-26 15:30:00', user: 'Analyst A', changes: 'Fixed currency mapping' },
                  { version: 'v1.1', timestamp: '2025-01-26 14:15:00', user: 'System', changes: 'Auto-generated MRS' },
                  { version: 'v1.0', timestamp: '2025-01-26 13:00:00', user: 'System', changes: 'Initial creation' },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2">{item.version}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.user}: {item.changes}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Input Samples Used
              </Typography>
              <Stack spacing={1}>
                <Chip label="850-sample.json" variant="outlined" />
                <Chip label="850-sample-2.json" variant="outlined" />
                <Chip label="850-sample-3.json" variant="outlined" />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generated Output Artifacts
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Outbound 850 EDI File
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generated: 2025-01-26 15:30:00
                  </Typography>
                  <Chip label="Download" size="small" />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                997 Functional Acknowledgment Preview
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {`ISA*00*          *00*          *ZZ*DEMOCO        *ZZ*TARGETSYS    *250126*1530*U*00401*000000124*0*T*~
GS*FA*DEMOCO*TARGETSYS*20250126*1530*124*X*004010
ST*997*0001
AK1*PO*123*004010
AK2*850*0001
AK5*A
AK9*A*1*1*0
SE*6*0001
GE*1*124
IEA*1*000000124`}
              </Paper>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Box>
      </Stack>
    </Container>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFCFC', py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Progress Stepper */}
          <Paper sx={{ p: 3 }}>
            <Stepper
              steps={STEPS}
              activeStep={getCurrentStepIndex()}
            />
          </Paper>

          {/* Screen Content */}
          {currentScreen === 'setup' && renderSetup()}
          {currentScreen === 'review' && renderReview()}
          {currentScreen === 'editor' && renderEditor()}
          {currentScreen === 'validation' && renderValidation()}
          {currentScreen === 'audit' && renderAudit()}
        </Stack>
      </Container>
    </Box>
  );
}

export default IntegrationCloud;
