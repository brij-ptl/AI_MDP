"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { subscriptionService } from "@/services/subscription.service";

type Remaining = number | "unlimited";
type PredictionAccess = {
  can_predict: boolean;
  access_source: "admin" | "prediction_tokens" | "subscription" | "free_trial" | "quota_exceeded";
  predictions_remaining: Remaining;
};

type SubscriptionResponse = {
  data: {
    predictions_used: number;
    prediction_access: PredictionAccess;
  };
};

interface TrialCtx {
  predictionsUsed: number;
  freeRemaining: Remaining;
  isLocked: boolean;
  registerPredictionUsed: () => void;
  refreshPredictionAccess: () => Promise<void>;
}

const TrialContext = createContext<TrialCtx>({
  predictionsUsed: 0,
  freeRemaining: 2,
  isLocked: false,
  registerPredictionUsed: () => {},
  refreshPredictionAccess: async () => {},
});

/** The backend subscription state is the single source of truth for prediction access. */
export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [predictionsUsed, setPredictionsUsed] = useState(0);
  const [freeRemaining, setFreeRemaining] = useState<Remaining>(2);
  const [canPredict, setCanPredict] = useState(true);

  const refreshPredictionAccess = useCallback(async () => {
    const response = await subscriptionService.me() as SubscriptionResponse;
    const subscription = response.data;
    setPredictionsUsed(subscription.predictions_used ?? 0);
    setFreeRemaining(subscription.prediction_access.predictions_remaining);
    setCanPredict(subscription.prediction_access.can_predict);
  }, []);

  useEffect(() => { refreshPredictionAccess().catch(() => {}); }, [refreshPredictionAccess]);

  const registerPredictionUsed = () => {
    // A prediction may consume a token, subscription credit, or free-trial credit.
    // Re-read the server after success instead of maintaining a client-side quota.
    refreshPredictionAccess().catch(() => {});
  };

  return (
    <TrialContext.Provider value={{
      predictionsUsed,
      freeRemaining,
      isLocked: !canPredict,
      registerPredictionUsed,
      refreshPredictionAccess,
    }}>
      {children}
    </TrialContext.Provider>
  );
}

export const useTrial = () => useContext(TrialContext);
