import { useCallback, useEffect, useRef } from 'react';
import type {
  BulkAction,
  Calibration,
  CategorizationLogEntry,
  GroupAction,
  InternalExternal,
  OutcomeBucket,
  SessionLog,
  Suggestion,
} from './types';
import { resolveTier } from './types';

function now(): number {
  return Date.now();
}

function makeSessionId(): string {
  return `sess_${now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyEntry(rowId: string, suggestion: Suggestion | null): CategorizationLogEntry {
  return {
    rowId,
    timeRowFirstFocused: null,
    timeConfirmed: null,
    outcomeBucket: null,
    openedReasoning: false,
    openedPermissionPreview: false,
    finalValues: { businessName: null, internalExternal: null },
    suggestionValues: suggestion
      ? {
          businessName: suggestion.businessName,
          internalExternal: suggestion.internalExternal,
          confidence: suggestion.confidence,
          tier: resolveTier(suggestion),
        }
      : null,
    calibration: null,
  };
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface UseCategorizationSessionArgs {
  mode: 'prototype' | 'manual';
}

export function useCategorizationSession({ mode }: UseCategorizationSessionArgs) {
  const logRef = useRef<SessionLog>({
    sessionId: makeSessionId(),
    mode,
    sessionStart: now(),
    sessionEnd: null,
    totalElapsed: null,
    entries: {},
    groupsActioned: [],
    bulkActions: [],
  });

  const ensureEntry = useCallback((rowId: string, suggestion: Suggestion | null) => {
    const log = logRef.current;
    if (!log.entries[rowId]) {
      log.entries[rowId] = emptyEntry(rowId, suggestion);
    }
    return log.entries[rowId];
  }, []);

  const markRowFocused = useCallback(
    (rowId: string, suggestion: Suggestion | null) => {
      const entry = ensureEntry(rowId, suggestion);
      if (entry.timeRowFirstFocused === null) {
        entry.timeRowFirstFocused = now();
      }
    },
    [ensureEntry]
  );

  const markReasoningOpened = useCallback(
    (rowId: string, suggestion: Suggestion | null) => {
      const entry = ensureEntry(rowId, suggestion);
      entry.openedReasoning = true;
    },
    [ensureEntry]
  );

  const markPermissionOpened = useCallback(
    (rowId: string, suggestion: Suggestion | null) => {
      const entry = ensureEntry(rowId, suggestion);
      entry.openedPermissionPreview = true;
    },
    [ensureEntry]
  );

  const commitDecision = useCallback(
    (args: {
      rowId: string;
      suggestion: Suggestion | null;
      outcome: OutcomeBucket;
      finalBusinessName: string | null;
      finalInternalExternal: InternalExternal | null;
      calibration?: Calibration | null;
    }) => {
      const entry = ensureEntry(args.rowId, args.suggestion);
      entry.outcomeBucket = args.outcome;
      entry.timeConfirmed = now();
      entry.finalValues = {
        businessName: args.finalBusinessName,
        internalExternal: args.finalInternalExternal,
      };
      if (args.calibration !== undefined) entry.calibration = args.calibration;
    },
    [ensureEntry]
  );

  const setCalibration = useCallback(
    (rowId: string, calibration: Calibration) => {
      const entry = logRef.current.entries[rowId];
      if (entry) entry.calibration = calibration;
    },
    []
  );

  const recordBulk = useCallback((bulk: BulkAction) => {
    logRef.current.bulkActions.push(bulk);
  }, []);

  const recordGroupAction = useCallback((action: GroupAction) => {
    logRef.current.groupsActioned.push(action);
  }, []);

  const finalizeSession = useCallback(() => {
    const log = logRef.current;
    log.sessionEnd = now();
    log.totalElapsed = log.sessionEnd - log.sessionStart;
  }, []);

  const exportSessionJson = useCallback(() => {
    const log = logRef.current;
    if (!log.sessionEnd) {
      log.sessionEnd = now();
      log.totalElapsed = log.sessionEnd - log.sessionStart;
    }
    downloadJson(`syncrofy-categorize-${log.sessionId}.json`, log);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const metaOrCtrl = e.metaKey || e.ctrlKey;
      if (metaOrCtrl && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        exportSessionJson();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exportSessionJson]);

  return {
    logRef,
    markRowFocused,
    markReasoningOpened,
    markPermissionOpened,
    commitDecision,
    setCalibration,
    recordBulk,
    recordGroupAction,
    finalizeSession,
    exportSessionJson,
  };
}

export type CategorizationSession = ReturnType<typeof useCategorizationSession>;
