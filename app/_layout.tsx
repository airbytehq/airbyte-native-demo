import { Slot } from "expo-router";
import { AuthProvider } from "../lib/context/auth";
import { PageProvider } from "../lib/context/page";
import { ProgressProvider } from "../lib/context/progress";

export default function Root() {
  return (
    <AuthProvider>
      <PageProvider>
        <ProgressProvider>
          <Slot />
        </ProgressProvider>
      </PageProvider>
    </AuthProvider>
  );
}
