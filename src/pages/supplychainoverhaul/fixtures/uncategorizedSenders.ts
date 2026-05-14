import type { UncategorizedSender } from '../types/uncategorized';

export const uncategorizedSenders: UncategorizedSender[] = [
  // ── VARIETY 1 — High-confidence link to existing ────────────────────────
  {
    id: 'UNC-001',
    envelope: { qualifier: '12', value: '0078742000008', subValue: '217' },
    firstSeenAt: '2026-05-12T08:00:00Z',
    lastSeenAt: '2026-05-12T09:45:00Z',
    heldDocumentIds: ['doc-unc-001-856-a', 'doc-unc-001-850', 'doc-unc-001-856-b'],
    observedSignals: {
      documentIdentities: [
        {
          source: 'N1',
          identityType: 'GLN',
          value: '0078742000008',
          raw: 'N1*BY*Walmart Inc.*UL*0078742000008~',
        },
      ],
      addresses: [
        {
          role: 'ship-from',
          raw: '901 SE 10th St, Sanger, TX 76266',
          normalized: {
            street: '901 SE 10th St',
            city: 'Sanger',
            state: 'TX',
            postal: '76266',
            country: 'US',
          },
          occurrenceCount: 3,
        },
      ],
      contacts: [],
      docTypePattern: [
        { docType: '856', count: 2 },
        { docType: '850', count: 1 },
      ],
    },
    recommendation: {
      proposedAction: 'link-to-existing',
      proposedPartnerId: 'p-walmart',
      proposedSubValue: '217',
      overallConfidence: 'high',
      signalSummary: { agreeing: 4, conflicting: 0, totalSignals: 4 },
      fields: {
        name: {
          value: 'Walmart Inc. - DC-217 (Sanger, TX)',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'ISA envelope value matches Walmart GLN', strength: 'strong', agrees: true },
            { source: 'address', description: 'Ship-from address matches known Walmart DC 217', strength: 'strong', agrees: true },
            { source: 'document-identity', description: 'N1*BY GLN matches Walmart registered GLN', strength: 'strong', agrees: true },
            { source: 'cross-customer', description: 'DC naming pattern matches Walmart DC-### convention across other customers', strength: 'moderate', agrees: true },
          ],
        },
        qualifier: {
          value: '12',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA qualifier', strength: 'strong', agrees: true },
            { source: 'cross-customer', description: 'Matches existing Walmart partner entries', strength: 'strong', agrees: true },
          ],
        },
        value: {
          value: '0078742000008',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA value', strength: 'strong', agrees: true },
            { source: 'cross-customer', description: 'Matches existing Walmart partner entries', strength: 'strong', agrees: true },
          ],
        },
        subValue: {
          value: '217',
          confidence: 'moderate',
          signals: [
            { source: 'envelope', description: 'Present in GS06', strength: 'strong', agrees: true },
            { source: 'cross-customer', description: 'Matches Walmart DC numbering pattern', strength: 'moderate', agrees: true },
          ],
        },
        description: {
          value: 'Walmart Distribution Center 217, Sanger TX',
          confidence: 'moderate',
          signals: [
            { source: 'cross-customer', description: 'Cross-customer pattern for DC-### entries', strength: 'moderate', agrees: true },
            { source: 'address', description: 'Address geocodes to Sanger, TX', strength: 'moderate', agrees: true },
          ],
        },
        partyType: {
          value: 'External partner',
          confidence: 'high',
          signals: [
            { source: 'cross-customer', description: 'Walmart is an external partner across all customers', strength: 'strong', agrees: true },
          ],
        },
        direction: {
          value: 'Inbound',
          confidence: 'high',
          signals: [
            { source: 'behavioral', description: 'Only inbound documents observed', strength: 'strong', agrees: true },
          ],
        },
      },
    },
  },

  // ── VARIETY 2 — Moderate-confidence new partner ─────────────────────────
  {
    id: 'UNC-002',
    envelope: { qualifier: 'ZZ', value: 'BRGHTPTH3PL', subValue: null },
    firstSeenAt: '2026-05-12T04:00:00Z',
    lastSeenAt: '2026-05-12T07:20:00Z',
    heldDocumentIds: ['doc-unc-002-940-a', 'doc-unc-002-940-b'],
    observedSignals: {
      documentIdentities: [
        {
          source: 'N1',
          identityType: 'DUNS',
          value: '029638041',
          raw: 'N1*SH*BrightPath Logistics*1*029638041~',
        },
      ],
      addresses: [
        {
          role: 'ship-from',
          raw: '4400 Industrial Pkwy, Memphis, TN 38118',
          normalized: {
            street: '4400 Industrial Pkwy',
            city: 'Memphis',
            state: 'TN',
            postal: '38118',
            country: 'US',
          },
          occurrenceCount: 2,
        },
      ],
      contacts: [],
      docTypePattern: [{ docType: '940', count: 2 }],
    },
    recommendation: {
      proposedAction: 'create-new',
      overallConfidence: 'moderate',
      signalSummary: { agreeing: 3, conflicting: 0, totalSignals: 3 },
      fields: {
        name: {
          value: 'BrightPath Logistics 3PL',
          confidence: 'moderate',
          signals: [
            { source: 'partner-spec', description: 'DUNS 029638041 registered to BrightPath Logistics', strength: 'moderate', agrees: true },
            { source: 'cross-customer', description: 'Cross-customer match for "BrightPath Logistics" name', strength: 'moderate', agrees: true },
            { source: 'envelope', description: 'Envelope value abbreviation suggests BrightPath 3PL', strength: 'weak', agrees: true },
          ],
        },
        qualifier: {
          value: 'ZZ',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA', strength: 'strong', agrees: true },
          ],
        },
        value: {
          value: 'BRGHTPTH3PL',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA', strength: 'strong', agrees: true },
          ],
        },
        subValue: {
          value: null,
          confidence: 'none',
          signals: [],
        },
        description: {
          value: 'Third-party logistics warehouse provider, Memphis TN',
          confidence: 'exploratory',
          signals: [
            { source: 'cross-customer', description: 'Cross-customer description pattern for 3PL entries', strength: 'weak', agrees: true },
          ],
        },
        partyType: {
          value: 'External partner',
          confidence: 'high',
          signals: [
            { source: 'cross-customer', description: '3PL providers are external partners', strength: 'strong', agrees: true },
          ],
        },
        direction: {
          value: 'Inbound',
          confidence: 'moderate',
          signals: [
            { source: 'behavioral', description: 'Only inbound observed but small sample (n=2)', strength: 'moderate', agrees: true },
          ],
        },
      },
    },
  },

  // ── VARIETY 3 — Exploratory with conflicting signals ───────────────────
  {
    id: 'UNC-003',
    envelope: { qualifier: 'ZZ', value: 'WMT', subValue: null },
    firstSeenAt: '2026-05-12T09:30:00Z',
    lastSeenAt: '2026-05-12T09:30:00Z',
    heldDocumentIds: ['doc-unc-003-850'],
    observedSignals: {
      documentIdentities: [
        {
          source: 'N1',
          identityType: 'GLN',
          value: '0078742999999',
          raw: 'N1*BY*Walmart*UL*0078742999999~',
        },
      ],
      addresses: [
        {
          role: 'bill-to',
          raw: '702 SW 8th St, Bentonville, AR 72716',
          normalized: {
            street: '702 SW 8th St',
            city: 'Bentonville',
            state: 'AR',
            postal: '72716',
            country: 'US',
          },
          occurrenceCount: 1,
        },
      ],
      contacts: [],
      docTypePattern: [{ docType: '850', count: 1 }],
    },
    recommendation: {
      proposedAction: 'create-new',
      overallConfidence: 'exploratory',
      signalSummary: { agreeing: 1, conflicting: 2, totalSignals: 3 },
      fields: {
        name: {
          value: null,
          confidence: 'exploratory',
          signals: [],
          candidates: [
            {
              value: 'Walmart Inc. (HQ test)',
              signals: [
                { source: 'address', description: 'Bill-to address matches Walmart HQ in Bentonville, AR', strength: 'strong', agrees: true },
                { source: 'envelope', description: 'Qualifier abbreviation "WMT" suggests Walmart', strength: 'moderate', agrees: true },
              ],
            },
            {
              value: 'Unknown — investigate',
              signals: [
                { source: 'document-identity', description: 'GLN 0078742999999 does not match Walmart\'s registered GLN (0078742000008); trailing 999999 looks like a test/placeholder', strength: 'strong', agrees: true },
                { source: 'behavioral', description: 'Walmart HQ address atypical for inbound 850s — Walmart POs originate from DC operations, not HQ', strength: 'moderate', agrees: true },
              ],
            },
          ],
        },
        qualifier: {
          value: 'ZZ',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA', strength: 'strong', agrees: true },
          ],
        },
        value: {
          value: 'WMT',
          confidence: 'high',
          signals: [
            { source: 'envelope', description: 'Directly from ISA', strength: 'strong', agrees: true },
          ],
        },
        subValue: {
          value: null,
          confidence: 'none',
          signals: [],
        },
        description: {
          value: null,
          confidence: 'exploratory',
          signals: [
            { source: 'cross-customer', description: 'Multiple plausible reads — needs operator judgment', strength: 'weak', agrees: false },
          ],
        },
        partyType: {
          value: 'External partner',
          confidence: 'moderate',
          signals: [
            { source: 'cross-customer', description: 'External sender is the most common case', strength: 'moderate', agrees: true },
          ],
        },
        direction: {
          value: 'Inbound',
          confidence: 'moderate',
          signals: [
            { source: 'behavioral', description: 'Only inbound observed (single document)', strength: 'weak', agrees: true },
          ],
        },
      },
    },
  },

  // ── VARIETY 4 — No recommendation (truly novel) ────────────────────────
  {
    id: 'UNC-004',
    envelope: { qualifier: 'ZZ', value: 'TESTSEND001', subValue: null },
    firstSeenAt: '2026-05-12T06:00:00Z',
    lastSeenAt: '2026-05-12T06:00:00Z',
    heldDocumentIds: ['doc-unc-004-850'],
    observedSignals: {
      documentIdentities: [],
      addresses: [
        {
          role: 'ship-from',
          raw: 'PO Box 4421, Wilmington, DE 19801',
          normalized: {
            street: 'PO Box 4421',
            city: 'Wilmington',
            state: 'DE',
            postal: '19801',
            country: 'US',
          },
          occurrenceCount: 1,
        },
      ],
      contacts: [],
      docTypePattern: [{ docType: '850', count: 1 }],
    },
    recommendation: {
      proposedAction: 'none',
      overallConfidence: 'none',
      signalSummary: { agreeing: 0, conflicting: 0, totalSignals: 0 },
      fields: {
        name: { value: null, confidence: 'none', signals: [] },
        qualifier: { value: null, confidence: 'none', signals: [] },
        value: { value: null, confidence: 'none', signals: [] },
        subValue: { value: null, confidence: 'none', signals: [] },
        description: { value: null, confidence: 'none', signals: [] },
        partyType: { value: null, confidence: 'none', signals: [] },
        direction: { value: null, confidence: 'none', signals: [] },
      },
    },
  },
];

export const uncategorizedSendersById: Record<string, UncategorizedSender> = Object.fromEntries(
  uncategorizedSenders.map((s) => [s.id, s]),
);
