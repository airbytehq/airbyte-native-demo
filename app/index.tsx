import { Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { autoloadOnStartup } from "../lib/api/login";
import { useAuth } from "../lib/context/auth";

export default function Index() {
  const router = useRouter();
  const { signIn } = useAuth();

  useEffect(() => {
    const autoLogin = async () => {
      const user = await autoloadOnStartup();
      if (user) {
        signIn(user);
      }
      router.replace("/workspaces");
    };
    autoLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Airbyte</Text>
      <Link href="/workspaces">My workspaces</Link>
    </View>
  );
}
