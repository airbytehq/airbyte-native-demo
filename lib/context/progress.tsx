import React from "react";

export type ProgressCallback = (isProcessing: boolean) => void;

export type ProgressContextType = {
  isProcessing: boolean;
  showActivity: (isProcessing: boolean) => void;
};

const ProgressContext = React.createContext<ProgressContextType>(null);

// This hook can be used to access the user info.
export function useProgress() {
  return React.useContext(ProgressContext);
}

// this seems to work best to make sure there is truly a global count
let globalCount = 0;

export function ProgressProvider(props) {
  const [processing, setProcessing] = React.useState(globalCount > 0);
  return (
    <ProgressContext.Provider
      value={{
        showActivity: (processing: boolean) => {
          if (processing) {
            globalCount++;
          } else {
            globalCount--;
            if (globalCount < 0) throw new Error("count less than zero!");
          }
          setProcessing(globalCount > 0);
        },
        isProcessing: processing,
      }}
    >
      {props.children}
    </ProgressContext.Provider>
  );
}
