import React from 'react';
import { uncategorizedSenders } from '../fixtures/uncategorizedSenders';
import { documentsById } from '../fixtures/documents';
import type { UncategorizedSender } from '../types/uncategorized';

const EVENT = 'syncrofy:uncategorized-changed';

export function notifyUncategorizedChanged(): void {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useUncategorizedSenders(): UncategorizedSender[] {
  const [, forceTick] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => {
    const handler = () => forceTick();
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);
  return uncategorizedSenders;
}

export function totalDocsHeld(senders: UncategorizedSender[]): number {
  return senders.reduce((acc, s) => acc + s.heldDocumentIds.length, 0);
}

export function isHeldDocument(docId: string): boolean {
  const doc = documentsById[docId];
  return Boolean(doc && doc.uncategorizedSenderId);
}
