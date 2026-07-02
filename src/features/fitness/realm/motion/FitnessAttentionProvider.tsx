import { createContext, useCallback, useContext, useMemo, useState, type JSX, type PropsWithChildren } from "react";
import type { AttentionReason } from "@/features/fitness/realm/types";

type AttentionState = {
  activeId?: string;
  reason: AttentionReason;
};

type AttentionContextValue = AttentionState & {
  clear: (id: string) => void;
  request: (id: string, reason: AttentionReason) => boolean;
};

const AttentionContext = createContext<AttentionContextValue | null>(null);

export function FitnessAttentionProvider({ children }: PropsWithChildren): JSX.Element {
  const [state, setState] = useState<AttentionState>({ reason: "none" });

  const request = useCallback((id: string, reason: AttentionReason) => {
    let accepted = false;

    setState((current) => {
      if (current.activeId === id && current.reason === reason) {
        accepted = true;
        return current;
      }

      if (current.activeId && current.activeId !== id && reason !== "warning") {
        return current;
      }

      accepted = true;
      return { activeId: id, reason };
    });

    return accepted;
  }, []);

  const clear = useCallback((id: string) => {
    setState((current) => (current.activeId === id ? { reason: "none" } : current));
  }, []);

  const value = useMemo(() => ({ ...state, clear, request }), [clear, request, state]);

  return <AttentionContext.Provider value={value}>{children}</AttentionContext.Provider>;
}

export function useFitnessAttention(): AttentionContextValue {
  const value = useContext(AttentionContext);

  if (!value) {
    throw new Error("useFitnessAttention must be used inside FitnessAttentionProvider");
  }

  return value;
}
