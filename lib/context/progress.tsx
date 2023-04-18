import { LinearProgress } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";

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
        showActivity: (processing: boolean) => setProgress(processing),
        isProcessing: progress,
      }}
    >
      <View style={styles.container}>
        {progress && <LinearProgress color="primary" style={styles.progress} />}
        <View style={styles.slot}>{props.children}</View>
      </View>
    </ProgressContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slot: {
    flex: 1,
    flexDirection: "column",
  },
  progress: {
    position: "absolute",
    top: 30, // TODO height of bar
  },
});
