export type SignalSource =
  | 'envelope'
  | 'document-identity'
  | 'address'
  | 'behavioral'
  | 'cross-customer'
  | 'partner-spec';

export interface Signal {
  source: SignalSource;
  description: string;
  strength: 'strong' | 'moderate' | 'weak';
  agrees: boolean;
}

export type ConfidenceLabel = 'high' | 'moderate' | 'exploratory' | 'none';

export interface FieldRecommendation {
  value: string | null;
  confidence: ConfidenceLabel;
  signals: Signal[];
  candidates?: Array<{
    value: string;
    signals: Signal[];
  }>;
}

export interface ObservedAddress {
  role: 'ship-from' | 'bill-to' | 'sold-to' | 'remit-to';
  raw: string;
  normalized: {
    street: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  occurrenceCount: number;
}

export interface ObservedIdentity {
  source: 'N1' | 'REF' | 'GS' | 'PER';
  identityType: string;
  value: string;
  raw: string;
}

export interface ObservedContact {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  occurrenceCount: number;
}

export interface ObservedDocTypePattern {
  docType: string;
  count: number;
}

export interface UncategorizedSender {
  id: string;
  envelope: {
    qualifier: string;
    value: string;
    subValue: string | null;
  };
  firstSeenAt: string;
  lastSeenAt: string;
  heldDocumentIds: string[];

  observedSignals: {
    documentIdentities: ObservedIdentity[];
    addresses: ObservedAddress[];
    contacts: ObservedContact[];
    docTypePattern: ObservedDocTypePattern[];
  };

  recommendation: {
    proposedAction: 'create-new' | 'link-to-existing' | 'none';
    proposedPartnerId?: string;
    proposedSubValue?: string;
    fields: {
      name: FieldRecommendation;
      qualifier: FieldRecommendation;
      value: FieldRecommendation;
      subValue: FieldRecommendation;
      description: FieldRecommendation;
      partyType: FieldRecommendation;
      direction: FieldRecommendation;
    };
    overallConfidence: ConfidenceLabel;
    signalSummary: {
      agreeing: number;
      conflicting: number;
      totalSignals: number;
    };
  };
}
