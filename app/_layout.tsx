import { Slot } from "expo-router";
import { AuthProvider } from "../lib/context/auth";
import { ProgressProvider } from "../lib/context/progress";

export default function Root() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Slot />
      </ProgressProvider>
    </AuthProvider>
  );
}
