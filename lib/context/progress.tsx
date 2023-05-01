import React from "react";

export type ProgressCallback = (isProcessing: boolean) => void;

export type ProgressContextType = {
  isProcessing: boolean;
  showActivity: (isProcessing: boolean) => void;
  watchActivity: (callback: ProgressCallback) => void;
  unwatchActivity: (callback: ProgressCallback) => void;
};

const ProgressContext = React.createContext<ProgressContextType>(null);

// This hook can be used to access the user info.
export function useProgress() {
  return React.useContext(ProgressContext);
}

export function ProgressProvider(props) {
  const [progress, setProgress] = React.useState(false);
  const callbacks = new Set<ProgressCallback>();
  return (
    <ProgressContext.Provider
      value={{
        showActivity: (processing: boolean) => {
          // TODO: we could increment and decrement here
          setProgress(processing);
          for (const cb of callbacks) {
            cb(processing);
          }
        },
        isProcessing: progress,
        watchActivity: (callback: ProgressCallback) => {
          callbacks.add(callback);
        },
        unwatchActivity: (callback: ProgressCallback) => {
          callbacks.delete(callback);
        },
      }}
    >
      {props.children}
    </ProgressContext.Provider>
  );
}
