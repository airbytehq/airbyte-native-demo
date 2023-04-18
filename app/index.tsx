import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { autoloadOnStartup } from "../lib/api/login";
import { useAuth } from "../lib/context/auth";
import { Text } from "@rneui/themed";
import { useProgress } from "../lib/context/progress";

export default function Index() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showActivity } = useProgress();

  useEffect(() => {
    const autoLogin = async () => {
      showActivity(true);
      const user = await autoloadOnStartup();
      if (user) {
        signIn(user);
      }
      showActivity(false);
      router.replace("/workspaces");
    };
    autoLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Airbyte Logo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
