import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { Button } from "@rneui/themed";

export default function Settings() {
  const { signOut, currentUser } = useAuth();
  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={() => signOut()}>
        Sign Out
      </Button>
      <Text>{currentUser?.apiKey}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 20,
  },
});
