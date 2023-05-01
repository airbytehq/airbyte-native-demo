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

export function ProgressProvider(props) {
  const [progress, setProgress] = React.useState(false);
  return (
    <ProgressContext.Provider
      value={{
        showActivity: (processing: boolean) => {
          // TODO: we could increment and decrement here
          setProgress(processing);
        },
        isProcessing: progress,
      }}
    >
      {props.children}
    </ProgressContext.Provider>
  );
}
