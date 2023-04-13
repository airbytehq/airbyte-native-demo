import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Airbyte</Text>
      <Link href="/workspaces">My workspaces</Link>
    </View>
  );
}
