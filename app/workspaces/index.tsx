import { Text, View } from "react-native";
import { useAuth } from "../../lib/context/auth";

export default function Index() {
  const { signOut, user } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{user?.apiKey}</Text>
      <Text onPress={() => signOut()}>Sign Out</Text>
    </View>
  );
}
