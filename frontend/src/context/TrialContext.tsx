"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const FREE_LIMIT = 2;

interface TrialCtx {
  predictionsUsed: number;
  freeRemaining: number;
  isLocked: boolean;
  registerPredictionUsed: () => void;
}

const TrialContext = createContext<TrialCtx>({
  predictionsUsed: 0,
  freeRemaining: FREE_LIMIT,
  isLocked: false,
  registerPredictionUsed: () => {},
});

/** Free-trial manager: 2 free predictions per account, tracked via cookie + backend counter. */
export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [predictionsUsed, setPredictionsUsed] = useState(0);

  useEffect(() => {
    const used = Number(Cookies.get("vitalis_predictions_used") ?? 0);
    setPredictionsUsed(used);
  }, []);

  const registerPredictionUsed = () => {
    const next = predictionsUsed + 1;
    setPredictionsUsed(next);
    Cookies.set("vitalis_predictions_used", String(next), { expires: 3650 });
  };

  const freeRemaining = Math.max(0, FREE_LIMIT - predictionsUsed);

  return (
    <TrialContext.Provider
      value={{ predictionsUsed, freeRemaining, isLocked: freeRemaining === 0, registerPredictionUsed }}
    >
      {children}
    </TrialContext.Provider>
  );
}

export const useTrial = () => useContext(TrialContext);
