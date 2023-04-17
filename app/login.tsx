import { Text, View } from "react-native";
import { useAuth } from "../lib/context/auth";

export default function Login() {
  const { signIn } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text onPress={() => signIn({ apiKey: "testkey" })}>Sign In</Text>
    </View>
  );
}
