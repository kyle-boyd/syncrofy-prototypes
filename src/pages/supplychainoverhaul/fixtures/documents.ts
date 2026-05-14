import type { EdiDocType } from './exceptions';
import { partners } from './partners';

export type DocStatus = 'translated' | 'failed' | 'pending' | 'duplicate';
export type DocDirection = 'inbound' | 'outbound';
export type DocStage = '850' | '855' | '856' | 'Receipt' | '810' | '940' | '997';

export interface ParsedField {
  label: string;
  value: string;
  mono?: boolean;
}

export interface ParsedSegment {
  id: string;
  tag: string;
  label: string;
  fields?: ParsedField[];
  children?: ParsedSegment[];
  errorMessage?: string;
}

export interface RawLine {
  text: string;
  errorMessage?: string;
}

export interface EdiDocument {
  id: string;
  docType: EdiDocType;
  docName: string;
  direction: DocDirection;
  partnerId: string | null;
  partnerName: string;
  status: DocStatus;
  controlNumbers: { isa13: string; gs06: string; st02: string };
  receivedAt: string;
  exceptionId?: string;
  uncategorizedSenderId?: string;
  stage: DocStage;
  parsed: ParsedSegment[];
  raw: RawLine[];
  defaultExpandSegmentId?: string;
  reference?: string;
}

const DOC_NAMES: Record<EdiDocType, string> = {
  '850': 'Purchase Order',
  '855': 'PO Acknowledgment',
  '856': 'Advance Ship Notice',
  '810': 'Invoice',
  '940': 'Warehouse Shipping Order',
  '997': 'Functional Acknowledgment',
};

export const documents: EdiDocument[] = [
  // ── EXC-001: Walmart 856 ASN late, SSCC error ────────────────────────────
  {
    id: 'doc-850-wmt-1041',
    docType: '850',
    docName: DOC_NAMES['850'],
    direction: 'inbound',
    partnerId: 'p-walmart',
    partnerName: 'Walmart',
    status: 'translated',
    controlNumbers: { isa13: '000041041', gs06: '41041', st02: '0001' },
    receivedAt: '2026-05-05T05:14:00Z',
    exceptionId: 'EXC-001',
    reference: '4521-1041',
    stage: '850',
    parsed: [
      {
        id: 'beg',
        tag: 'BEG',
        label: 'Beginning Segment',
        fields: [
          { label: 'Transaction Set Purpose', value: '00 — Original' },
          { label: 'PO Type', value: 'SA — Stand-alone' },
          { label: 'PO Number', value: '4521-1041', mono: true },
          { label: 'PO Date', value: '2026-05-05' },
        ],
      },
      {
        id: 'ref',
        tag: 'REF',
        label: 'References',
        children: [
          { id: 'ref-dp', tag: 'REF*DP', label: 'Department', fields: [{ label: 'Value', value: '094', mono: true }] },
          { id: 'ref-vr', tag: 'REF*VR', label: 'Vendor #', fields: [{ label: 'Value', value: 'V-88421', mono: true }] },
        ],
      },
      {
        id: 'n1-st',
        tag: 'N1*ST',
        label: 'Ship-to (Walmart DC 6094)',
        fields: [
          { label: 'Name', value: 'Walmart DC 6094' },
          { label: 'ID Qual', value: '92' },
          { label: 'GLN', value: '0078742000000', mono: true },
        ],
      },
      {
        id: 'po1',
        tag: 'PO1',
        label: 'Line Items (12)',
        fields: [{ label: 'Lines', value: '12' }, { label: 'Total Qty', value: '4,800 EA' }],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*WMT0078742    *ZZ*ACMECORP       *260505*0514*U*00401*000041041*0*P*>~' },
      { text: 'GS*PO*WMT0078742*ACMECORP*20260505*0514*41041*X*004010~' },
      { text: 'ST*850*0001~' },
      { text: 'BEG*00*SA*4521-1041**20260505~' },
      { text: 'REF*DP*094~' },
      { text: 'REF*VR*V-88421~' },
      { text: 'N1*ST*Walmart DC 6094*92*0078742000000~' },
      { text: 'PO1*001*400*EA*8.95**UP*034000123456~' },
      { text: '... (11 more PO1 lines) ...' },
      { text: 'CTT*12~' },
      { text: 'SE*148*0001~' },
      { text: 'GE*1*41041~' },
      { text: 'IEA*1*000041041~' },
    ],
  },
  {
    id: 'doc-855-wmt-1041',
    docType: '855',
    docName: DOC_NAMES['855'],
    direction: 'outbound',
    partnerId: 'p-walmart',
    partnerName: 'Walmart',
    status: 'translated',
    controlNumbers: { isa13: '000041088', gs06: '41088', st02: '0001' },
    receivedAt: '2026-05-05T07:02:00Z',
    exceptionId: 'EXC-001',
    reference: '4521-1041',
    stage: '855',
    parsed: [
      {
        id: 'bak',
        tag: 'BAK',
        label: 'Beginning Acknowledgment',
        fields: [
          { label: 'Purpose', value: '00 — Original' },
          { label: 'Ack Type', value: 'AC — Acknowledged with detail, no change' },
          { label: 'PO Number', value: '4521-1041', mono: true },
        ],
      },
      {
        id: 'ack',
        tag: 'ACK',
        label: 'Line Acknowledgments (12)',
        fields: [{ label: 'Lines', value: '12 of 12 acknowledged' }],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*ACMECORP       *ZZ*WMT0078742    *260505*0702*U*00401*000041088*0*P*>~' },
      { text: 'GS*PR*ACMECORP*WMT0078742*20260505*0702*41088*X*004010~' },
      { text: 'ST*855*0001~' },
      { text: 'BAK*00*AC*4521-1041**20260505~' },
      { text: 'PO1*001*400*EA*8.95**UP*034000123456~' },
      { text: 'ACK*IA*400*EA~' },
      { text: '... (11 more line acks) ...' },
      { text: 'SE*30*0001~' },
      { text: 'GE*1*41088~' },
      { text: 'IEA*1*000041088~' },
    ],
  },
  {
    id: 'doc-856-wmt-1041',
    docType: '856',
    docName: DOC_NAMES['856'],
    direction: 'outbound',
    partnerId: 'p-walmart',
    partnerName: 'Walmart',
    status: 'failed',
    controlNumbers: { isa13: '000041155', gs06: '41155', st02: '0001' },
    receivedAt: '2026-05-05T13:45:00Z',
    exceptionId: 'EXC-001',
    reference: 'ASN-1041',
    stage: '856',
    defaultExpandSegmentId: 'man-1',
    parsed: [
      {
        id: 'beg',
        tag: 'BEG',
        label: 'Beginning Segment',
        fields: [
          { label: 'Purpose', value: '00 — Original' },
          { label: 'Shipment ID', value: 'ASN-1041', mono: true },
          { label: 'Date', value: '2026-05-05' },
        ],
      },
      {
        id: 'ref',
        tag: 'REF',
        label: 'References',
        children: [
          { id: 'ref-bm', tag: 'REF*BM', label: 'BOL', fields: [{ label: 'Value', value: 'BOL-998312', mono: true }] },
          { id: 'ref-cn', tag: 'REF*CN', label: 'Carrier', fields: [{ label: 'Value', value: 'JBHU', mono: true }] },
        ],
      },
      {
        id: 'n1-sf',
        tag: 'N1*SF',
        label: 'Ship-from',
        fields: [{ label: 'Name', value: 'ACME DC Atlanta' }, { label: 'GLN', value: '0860001234001', mono: true }],
      },
      {
        id: 'n1-st',
        tag: 'N1*ST',
        label: 'Ship-to',
        fields: [{ label: 'Name', value: 'Walmart DC 6094' }, { label: 'GLN', value: '0078742000000', mono: true }],
      },
      {
        id: 'hl-shp',
        tag: 'HL*1*S',
        label: 'Pack Hierarchy — Shipment',
        children: [
          {
            id: 'hl-pak-1',
            tag: 'HL*2*1*P',
            label: 'Pallet 1',
            children: [
              {
                id: 'man-1',
                tag: 'MAN*GM',
                label: 'SSCC-18 Pallet Label',
                fields: [{ label: 'SSCC', value: '(missing)', mono: true }],
                errorMessage: 'SSCC-18 is required for Walmart 856 pack hierarchy. Pallet 1 is missing MAN*GM segment — generator failed because the WMS feed did not include a label for this carton.',
              },
              { id: 'lin-1', tag: 'LIN/SN1', label: 'Carton Items', fields: [{ label: 'Lines', value: '4 SKUs · 480 EA' }] },
            ],
          },
          {
            id: 'hl-pak-2',
            tag: 'HL*3*1*P',
            label: 'Pallet 2',
            children: [
              { id: 'man-2', tag: 'MAN*GM', label: 'SSCC-18 Pallet Label', fields: [{ label: 'SSCC', value: '00860001234000000124', mono: true }] },
              { id: 'lin-2', tag: 'LIN/SN1', label: 'Carton Items', fields: [{ label: 'Lines', value: '5 SKUs · 600 EA' }] },
            ],
          },
        ],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*ACMECORP       *ZZ*WMT0078742    *260505*1345*U*00401*000041155*0*P*>~' },
      { text: 'GS*SH*ACMECORP*WMT0078742*20260505*1345*41155*X*004010~' },
      { text: 'ST*856*0001~' },
      { text: 'BEG*00*SA*ASN-1041**20260505~' },
      { text: 'REF*BM*BOL-998312~' },
      { text: 'REF*CN*JBHU~' },
      { text: 'N1*SF*ACME DC Atlanta*92*0860001234001~' },
      { text: 'N1*ST*Walmart DC 6094*92*0078742000000~' },
      { text: 'HL*1**S~' },
      { text: 'HL*2*1*P~' },
      { text: 'MAN*GM*~', errorMessage: 'SSCC-18 missing on Pallet 1 — required by Walmart 856 spec.' },
      { text: 'LIN*001*UP*034000123456~' },
      { text: 'SN1*001*120*EA~' },
      { text: 'HL*3*1*P~' },
      { text: 'MAN*GM*00860001234000000124~' },
      { text: 'LIN*002*UP*034000123457~' },
      { text: 'SN1*002*150*EA~' },
      { text: 'CTT*3~' },
      { text: 'SE*52*0001~' },
      { text: 'GE*1*41155~' },
      { text: 'IEA*1*000041155~' },
    ],
  },

  // ── EXC-010: ABC 856, healthy translation, count variance flagged downstream ─
  {
    id: 'doc-856-abc-2204',
    docType: '856',
    docName: DOC_NAMES['856'],
    direction: 'inbound',
    partnerId: 'p-abc3pl',
    partnerName: 'ABC 3PL',
    status: 'translated',
    controlNumbers: { isa13: '000022041', gs06: '22041', st02: '0001' },
    receivedAt: '2026-05-05T12:55:00Z',
    exceptionId: 'EXC-010',
    reference: 'ASN-2204',
    stage: '856',
    parsed: [
      {
        id: 'beg',
        tag: 'BEG',
        label: 'Beginning Segment',
        fields: [
          { label: 'Purpose', value: '00 — Original' },
          { label: 'Shipment ID', value: 'ASN-2204', mono: true },
        ],
      },
      {
        id: 'n1-sf',
        tag: 'N1*SF',
        label: 'Ship-from',
        fields: [{ label: 'Name', value: 'ABC 3PL — Memphis' }, { label: 'GLN', value: '0851234567890', mono: true }],
      },
      {
        id: 'hl-shp',
        tag: 'HL*1*S',
        label: 'Pack Hierarchy',
        children: [
          {
            id: 'hl-pak-1',
            tag: 'HL*2*1*P',
            label: 'Pallet 1',
            children: [
              { id: 'man-1', tag: 'MAN*GM', label: 'SSCC-18', fields: [{ label: 'SSCC', value: '00851234567000000201', mono: true }] },
              { id: 'lin-1', tag: 'LIN/SN1', label: 'SKU-77124', fields: [{ label: 'Qty', value: '1,194 EA' }] },
            ],
          },
        ],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*ABC3PL         *ZZ*ACMECORP       *260505*1255*U*00401*000022041*0*P*>~' },
      { text: 'GS*SH*ABC3PL*ACMECORP*20260505*1255*22041*X*004010~' },
      { text: 'ST*856*0001~' },
      { text: 'BEG*00*SA*ASN-2204**20260505~' },
      { text: 'N1*SF*ABC 3PL Memphis*92*0851234567890~' },
      { text: 'HL*1**S~' },
      { text: 'HL*2*1*P~' },
      { text: 'MAN*GM*00851234567000000201~' },
      { text: 'LIN*001*UP*034000771241~' },
      { text: 'SN1*001*1194*EA~' },
      { text: 'CTT*1~' },
      { text: 'SE*22*0001~' },
      { text: 'GE*1*22041~' },
      { text: 'IEA*1*000022041~' },
    ],
  },

  // ── EXC-005: Costco 810 invoice mismatch ─────────────────────────────────
  {
    id: 'doc-810-cos-4421',
    docType: '810',
    docName: DOC_NAMES['810'],
    direction: 'outbound',
    partnerId: 'p-costco',
    partnerName: 'Costco',
    status: 'translated',
    controlNumbers: { isa13: '000019846', gs06: '19846', st02: '0001' },
    receivedAt: '2026-05-05T08:46:00Z',
    exceptionId: 'EXC-005',
    reference: 'INV-92840',
    stage: '810',
    parsed: [
      {
        id: 'big',
        tag: 'BIG',
        label: 'Beginning Invoice',
        fields: [
          { label: 'Invoice Date', value: '2026-05-05' },
          { label: 'Invoice #', value: 'INV-92840', mono: true },
          { label: 'PO Date', value: '2026-04-30' },
          { label: 'PO Number', value: 'COS-4421', mono: true },
        ],
      },
      {
        id: 'tds',
        tag: 'TDS',
        label: 'Total Monetary Summary',
        fields: [{ label: 'Total', value: '$61,420.18', mono: true }],
      },
      {
        id: 'it1',
        tag: 'IT1',
        label: 'Line Items (4)',
        fields: [{ label: 'Lines', value: '4' }, { label: 'Variance', value: '+$3,220.18 vs PO' }],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*ACMECORP       *ZZ*COSTCO         *260505*0846*U*00401*000019846*0*P*>~' },
      { text: 'GS*IN*ACMECORP*COSTCO*20260505*0846*19846*X*004010~' },
      { text: 'ST*810*0001~' },
      { text: 'BIG*20260505*INV-92840*20260430*COS-4421~' },
      { text: 'IT1*001*100*EA*12.50**UP*034000444211~' },
      { text: '... (3 more IT1 lines) ...' },
      { text: 'TDS*6142018~' },
      { text: 'SE*22*0001~' },
      { text: 'GE*1*19846~' },
      { text: 'IEA*1*000019846~' },
    ],
  },

  // ── EXC-007: CVS 940 parse failure ───────────────────────────────────────
  {
    id: 'doc-940-cvs-3318',
    docType: '940',
    docName: DOC_NAMES['940'],
    direction: 'inbound',
    partnerId: 'p-cvs',
    partnerName: 'CVS',
    status: 'failed',
    controlNumbers: { isa13: '000033180', gs06: '33180', st02: '0001' },
    receivedAt: '2026-05-05T14:00:00Z',
    exceptionId: 'EXC-007',
    reference: 'CVS-3318',
    stage: '940',
    defaultExpandSegmentId: 'n1-dv',
    parsed: [
      {
        id: 'w05',
        tag: 'W05',
        label: 'Beginning Shipping Order',
        fields: [
          { label: 'Purpose', value: 'N — New' },
          { label: 'Order #', value: 'CVS-3318', mono: true },
          { label: 'Customer Order', value: 'WS-CVS-3318', mono: true },
        ],
      },
      {
        id: 'n1-dv',
        tag: 'N1*DV',
        label: 'Diverter (unrecognized qualifier)',
        fields: [{ label: 'Qualifier', value: 'DV', mono: true }, { label: 'Name', value: 'Regional Sort Hub' }],
        errorMessage: 'WMS connector parser does not recognize N1 entity-identifier "DV". Document was rejected before line items could be loaded.',
      },
      {
        id: 'lx',
        tag: 'LX',
        label: 'Line Items (12 stores)',
        fields: [{ label: 'Status', value: 'not parsed — blocked by N1*DV' }],
      },
    ],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*CVS            *ZZ*ACMECORP       *260505*1400*U*00401*000033180*0*P*>~' },
      { text: 'GS*OW*CVS*ACMECORP*20260505*1400*33180*X*004010~' },
      { text: 'ST*940*0001~' },
      { text: 'W05*N*CVS-3318*WS-CVS-3318~' },
      { text: 'N1*ST*CVS Store 04412*92*0050428044120~' },
      { text: 'N1*DV*Regional Sort Hub*92*0050428000099~', errorMessage: 'Unrecognized N1 entity-identifier "DV" — WMS parser rejected the document.' },
      { text: 'LX*1~' },
      { text: 'W01*40*EA*UP*0500441234561~' },
      { text: '... (11 more LX/W01 loops) ...' },
      { text: 'SE*30*0001~' },
      { text: 'GE*1*33180~' },
      { text: 'IEA*1*000033180~' },
    ],
  },

  // ── Additional log entries (no raw EDI in prototype) ─────────────────────
  ...([
    // Target — healthy 850/855/856/997/810 cluster
    { id: 'doc-850-tgt-5512', docType: '850', direction: 'inbound',  partnerId: 'p-target',    status: 'translated', isa: '000055120', gs: '55120', st: '0001', t: '2026-05-06T12:55:00Z', ref: 'TGT-5512' },
    { id: 'doc-855-tgt-5512', docType: '855', direction: 'outbound', partnerId: 'p-target',    status: 'translated', isa: '000055145', gs: '55145', st: '0001', t: '2026-05-06T13:08:00Z', ref: 'TGT-5512' },
    { id: 'doc-856-tgt-5489', docType: '856', direction: 'outbound', partnerId: 'p-target',    status: 'translated', isa: '000054890', gs: '54890', st: '0001', t: '2026-05-06T11:42:00Z', ref: 'ASN-5489' },
    { id: 'doc-997-tgt-5489', docType: '997', direction: 'inbound',  partnerId: 'p-target',    status: 'translated', isa: '000054912', gs: '54912', st: '0001', t: '2026-05-06T11:50:00Z', ref: 'ASN-5489' },
    { id: 'doc-810-tgt-5377', docType: '810', direction: 'outbound', partnerId: 'p-target',    status: 'translated', isa: '000053770', gs: '53770', st: '0001', t: '2026-05-06T10:15:00Z', ref: 'INV-77231' },

    // Home Depot — mostly healthy, one pending invoice
    { id: 'doc-850-hd-7733',  docType: '850', direction: 'inbound',  partnerId: 'p-homedepot', status: 'translated', isa: '000077330', gs: '77330', st: '0001', t: '2026-05-06T09:50:00Z', ref: 'HD-7733' },
    { id: 'doc-855-hd-7733',  docType: '855', direction: 'outbound', partnerId: 'p-homedepot', status: 'translated', isa: '000077351', gs: '77351', st: '0001', t: '2026-05-06T10:05:00Z', ref: 'HD-7733' },
    { id: 'doc-856-hd-7702',  docType: '856', direction: 'outbound', partnerId: 'p-homedepot', status: 'translated', isa: '000077020', gs: '77020', st: '0001', t: '2026-05-06T08:32:00Z', ref: 'ASN-7702' },
    { id: 'doc-810-hd-7660',  docType: '810', direction: 'outbound', partnerId: 'p-homedepot', status: 'pending',    isa: '000076600', gs: '76600', st: '0001', t: '2026-05-06T07:14:00Z', ref: 'INV-66115' },

    // Kroger — 850 acked, 940 failed
    { id: 'doc-850-kr-2210',  docType: '850', direction: 'inbound',  partnerId: 'p-kroger',    status: 'translated', isa: '000022100', gs: '22100', st: '0001', t: '2026-05-06T05:48:00Z', ref: 'KR-2210' },
    { id: 'doc-997-kr-2210',  docType: '997', direction: 'outbound', partnerId: 'p-kroger',    status: 'translated', isa: '000022115', gs: '22115', st: '0001', t: '2026-05-06T05:51:00Z', ref: 'KR-2210' },
    { id: 'doc-940-kr-2188',  docType: '940', direction: 'inbound',  partnerId: 'p-kroger',    status: 'failed',     isa: '000021880', gs: '21880', st: '0001', t: '2026-05-06T04:22:00Z', ref: 'KR-2188' },

    // McKesson — pending 850, healthy others
    { id: 'doc-810-mck-9012', docType: '810', direction: 'outbound', partnerId: 'p-mckesson',  status: 'translated', isa: '000090120', gs: '90120', st: '0001', t: '2026-05-06T03:07:00Z', ref: 'INV-99001' },
    { id: 'doc-850-mck-9020', docType: '850', direction: 'inbound',  partnerId: 'p-mckesson',  status: 'pending',    isa: '000090200', gs: '90200', st: '0001', t: '2026-05-06T01:55:00Z', ref: 'MCK-9020' },
    { id: 'doc-856-mck-8995', docType: '856', direction: 'outbound', partnerId: 'p-mckesson',  status: 'translated', isa: '000089950', gs: '89950', st: '0001', t: '2026-05-05T23:18:00Z', ref: 'ASN-8995' },

    // Walgreens — duplicate inbound PO + healthy others
    { id: 'doc-850-wag-3401', docType: '850', direction: 'inbound',  partnerId: 'p-walgreens', status: 'duplicate',  isa: '000034010', gs: '34010', st: '0001', t: '2026-05-05T22:40:00Z', ref: 'WAG-3401' },
    { id: 'doc-855-wag-3399', docType: '855', direction: 'outbound', partnerId: 'p-walgreens', status: 'translated', isa: '000033990', gs: '33990', st: '0001', t: '2026-05-05T21:15:00Z', ref: 'WAG-3399' },
    { id: 'doc-810-wag-3380', docType: '810', direction: 'outbound', partnerId: 'p-walgreens', status: 'translated', isa: '000033800', gs: '33800', st: '0001', t: '2026-05-05T20:08:00Z', ref: 'INV-44210' },

    // Walmart — 997 ack tied to EXC-001 ASN (still translated)
    { id: 'doc-997-wmt-1041', docType: '997', direction: 'inbound',  partnerId: 'p-walmart',   status: 'translated', isa: '000041201', gs: '41201', st: '0001', t: '2026-05-05T18:55:00Z', ref: 'ASN-1041', exceptionId: 'EXC-001' },
    { id: 'doc-850-wmt-1102', docType: '850', direction: 'inbound',  partnerId: 'p-walmart',   status: 'translated', isa: '000041102', gs: '41102', st: '0001', t: '2026-05-05T17:44:00Z', ref: 'WMT-1102' },

    // Costco — healthy ASN + 997 tied to EXC-005 invoice
    { id: 'doc-856-cos-4480', docType: '856', direction: 'outbound', partnerId: 'p-costco',    status: 'translated', isa: '000044800', gs: '44800', st: '0001', t: '2026-05-05T16:30:00Z', ref: 'ASN-4480' },
    { id: 'doc-997-cos-4421', docType: '997', direction: 'inbound',  partnerId: 'p-costco',    status: 'translated', isa: '000019901', gs: '19901', st: '0001', t: '2026-05-05T16:00:00Z', ref: 'INV-92840', exceptionId: 'EXC-005' },

    // CVS — duplicate 940 retransmit
    { id: 'doc-940-cvs-3325', docType: '940', direction: 'inbound',  partnerId: 'p-cvs',       status: 'duplicate',  isa: '000033250', gs: '33250', st: '0001', t: '2026-05-05T15:18:00Z', ref: 'CVS-3325' },

    // ABC 3PL — failed 856 (separate from EXC-010)
    { id: 'doc-856-abc-2210', docType: '856', direction: 'inbound',  partnerId: 'p-abc3pl',    status: 'failed',     isa: '000022210', gs: '22210', st: '0001', t: '2026-05-05T14:50:00Z', ref: 'ASN-2210' },
  ] as const).map((d): EdiDocument => ({
    id: d.id,
    docType: d.docType as EdiDocType,
    docName: DOC_NAMES[d.docType as EdiDocType],
    direction: d.direction as DocDirection,
    partnerId: d.partnerId,
    partnerName: partners.find((p) => p.id === d.partnerId)?.name ?? '—',
    status: d.status as DocStatus,
    controlNumbers: { isa13: d.isa, gs06: d.gs, st02: d.st },
    receivedAt: d.t,
    stage: d.docType as DocStage,
    parsed: [],
    raw: [],
    reference: d.ref,
    ...(('exceptionId' in d) ? { exceptionId: (d as { exceptionId: string }).exceptionId } : {}),
  })),

  // ── UNC-001: Walmart DC-217 (held pending categorization) ────────────────
  {
    id: 'doc-unc-001-856-a',
    docType: '856',
    docName: DOC_NAMES['856'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099001', gs06: '99001', st02: '0001' },
    receivedAt: '2026-05-12T08:00:00Z',
    uncategorizedSenderId: 'UNC-001',
    stage: '856',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *12*0078742000008  *ZZ*ACMECORP       *260512*0800*U*00401*000099001*0*P*>~' },
      { text: 'GS*SH*0078742000008*ACMECORP*20260512*0800*217*X*004010~' },
      { text: 'ST*856*0001~' },
      { text: 'BEG*00*SA*ASN-WMT-D217-001**20260512~' },
      { text: 'N1*BY*Walmart Inc.*UL*0078742000008~' },
      { text: 'N1*SF*Walmart DC 217*92*0078742000217~' },
      { text: 'N3*901 SE 10TH ST~' },
      { text: 'N4*SANGER*TX*76266*US~' },
      { text: 'HL*1**S~' },
      { text: 'SE*9*0001~' },
      { text: 'GE*1*217~' },
      { text: 'IEA*1*000099001~' },
    ],
    reference: 'ASN-WMT-D217-001',
  },
  {
    id: 'doc-unc-001-850',
    docType: '850',
    docName: DOC_NAMES['850'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099002', gs06: '99002', st02: '0001' },
    receivedAt: '2026-05-12T08:45:00Z',
    uncategorizedSenderId: 'UNC-001',
    stage: '850',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *12*0078742000008  *ZZ*ACMECORP       *260512*0845*U*00401*000099002*0*P*>~' },
      { text: 'GS*PO*0078742000008*ACMECORP*20260512*0845*217*X*004010~' },
      { text: 'ST*850*0001~' },
      { text: 'BEG*00*SA*WMT-D217-PO-3320**20260512~' },
      { text: 'N1*BY*Walmart Inc.*UL*0078742000008~' },
      { text: 'N1*ST*Walmart DC 217*92*0078742000217~' },
      { text: 'N3*901 SE 10TH ST~' },
      { text: 'N4*SANGER*TX*76266*US~' },
      { text: 'SE*8*0001~' },
      { text: 'GE*1*217~' },
      { text: 'IEA*1*000099002~' },
    ],
    reference: 'WMT-D217-PO-3320',
  },
  {
    id: 'doc-unc-001-856-b',
    docType: '856',
    docName: DOC_NAMES['856'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099003', gs06: '99003', st02: '0001' },
    receivedAt: '2026-05-12T09:45:00Z',
    uncategorizedSenderId: 'UNC-001',
    stage: '856',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *12*0078742000008  *ZZ*ACMECORP       *260512*0945*U*00401*000099003*0*P*>~' },
      { text: 'GS*SH*0078742000008*ACMECORP*20260512*0945*217*X*004010~' },
      { text: 'ST*856*0001~' },
      { text: 'BEG*00*SA*ASN-WMT-D217-002**20260512~' },
      { text: 'N1*BY*Walmart Inc.*UL*0078742000008~' },
      { text: 'N1*SF*Walmart DC 217*92*0078742000217~' },
      { text: 'N3*901 SE 10TH ST~' },
      { text: 'N4*SANGER*TX*76266*US~' },
      { text: 'HL*1**S~' },
      { text: 'SE*9*0001~' },
      { text: 'GE*1*217~' },
      { text: 'IEA*1*000099003~' },
    ],
    reference: 'ASN-WMT-D217-002',
  },

  // ── UNC-002: BrightPath Logistics 3PL ────────────────────────────────────
  {
    id: 'doc-unc-002-940-a',
    docType: '940',
    docName: DOC_NAMES['940'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099101', gs06: '99101', st02: '0001' },
    receivedAt: '2026-05-12T04:00:00Z',
    uncategorizedSenderId: 'UNC-002',
    stage: '940',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*BRGHTPTH3PL    *ZZ*ACMECORP       *260512*0400*U*00401*000099101*0*P*>~' },
      { text: 'GS*OW*BRGHTPTH3PL*ACMECORP*20260512*0400*99101*X*004010~' },
      { text: 'ST*940*0001~' },
      { text: 'W05*N*BP-SO-77110**WS-BP-77110~' },
      { text: 'N1*SH*BrightPath Logistics*1*029638041~' },
      { text: 'N3*4400 INDUSTRIAL PKWY~' },
      { text: 'N4*MEMPHIS*TN*38118*US~' },
      { text: 'SE*7*0001~' },
      { text: 'GE*1*99101~' },
      { text: 'IEA*1*000099101~' },
    ],
    reference: 'BP-SO-77110',
  },
  {
    id: 'doc-unc-002-940-b',
    docType: '940',
    docName: DOC_NAMES['940'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099102', gs06: '99102', st02: '0001' },
    receivedAt: '2026-05-12T07:20:00Z',
    uncategorizedSenderId: 'UNC-002',
    stage: '940',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*BRGHTPTH3PL    *ZZ*ACMECORP       *260512*0720*U*00401*000099102*0*P*>~' },
      { text: 'GS*OW*BRGHTPTH3PL*ACMECORP*20260512*0720*99102*X*004010~' },
      { text: 'ST*940*0001~' },
      { text: 'W05*N*BP-SO-77118**WS-BP-77118~' },
      { text: 'N1*SH*BrightPath Logistics*1*029638041~' },
      { text: 'N3*4400 INDUSTRIAL PKWY~' },
      { text: 'N4*MEMPHIS*TN*38118*US~' },
      { text: 'SE*7*0001~' },
      { text: 'GE*1*99102~' },
      { text: 'IEA*1*000099102~' },
    ],
    reference: 'BP-SO-77118',
  },

  // ── UNC-003: Ambiguous "WMT" sender ──────────────────────────────────────
  {
    id: 'doc-unc-003-850',
    docType: '850',
    docName: DOC_NAMES['850'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099201', gs06: '99201', st02: '0001' },
    receivedAt: '2026-05-12T09:30:00Z',
    uncategorizedSenderId: 'UNC-003',
    stage: '850',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*WMT            *ZZ*ACMECORP       *260512*0930*U*00401*000099201*0*P*>~' },
      { text: 'GS*PO*WMT*ACMECORP*20260512*0930*99201*X*004010~' },
      { text: 'ST*850*0001~' },
      { text: 'BEG*00*SA*WMT-TEST-0001**20260512~' },
      { text: 'N1*BY*Walmart*UL*0078742999999~' },
      { text: 'N1*BT*Walmart HQ*92*0078742000000~' },
      { text: 'N3*702 SW 8TH ST~' },
      { text: 'N4*BENTONVILLE*AR*72716*US~' },
      { text: 'SE*8*0001~' },
      { text: 'GE*1*99201~' },
      { text: 'IEA*1*000099201~' },
    ],
    reference: 'WMT-TEST-0001',
  },

  // ── UNC-004: Truly novel sender ──────────────────────────────────────────
  {
    id: 'doc-unc-004-850',
    docType: '850',
    docName: DOC_NAMES['850'],
    direction: 'inbound',
    partnerId: null,
    partnerName: 'Uncategorized sender',
    status: 'pending',
    controlNumbers: { isa13: '000099301', gs06: '99301', st02: '0001' },
    receivedAt: '2026-05-12T06:00:00Z',
    uncategorizedSenderId: 'UNC-004',
    stage: '850',
    parsed: [],
    raw: [
      { text: 'ISA*00*          *00*          *ZZ*TESTSEND001    *ZZ*ACMECORP       *260512*0600*U*00401*000099301*0*P*>~' },
      { text: 'GS*PO*TESTSEND001*ACMECORP*20260512*0600*99301*X*004010~' },
      { text: 'ST*850*0001~' },
      { text: 'BEG*00*SA*TS-0001**20260512~' },
      { text: 'N3*PO BOX 4421~' },
      { text: 'N4*WILMINGTON*DE*19801*US~' },
      { text: 'SE*5*0001~' },
      { text: 'GE*1*99301~' },
      { text: 'IEA*1*000099301~' },
    ],
    reference: 'TS-0001',
  },
];

export const documentsById: Record<string, EdiDocument> = Object.fromEntries(
  documents.map((d) => [d.id, d]),
);

export function documentsForException(exceptionId: string): EdiDocument[] {
  return documents.filter((d) => d.exceptionId === exceptionId);
}

const STAGE_ORDER: Record<DocStage, number> = {
  '850': 0,
  '855': 1,
  '856': 2,
  Receipt: 3,
  '810': 4,
  '940': 2,
  '997': 5,
};

export function relatedDocuments(doc: EdiDocument): EdiDocument[] {
  if (!doc.exceptionId) return [];
  return documentsForException(doc.exceptionId)
    .filter((d) => d.id !== doc.id)
    .sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]);
}

export function documentForExceptionStage(exceptionId: string, stage: DocStage): EdiDocument | undefined {
  return documents.find((d) => d.exceptionId === exceptionId && d.stage === stage);
}
