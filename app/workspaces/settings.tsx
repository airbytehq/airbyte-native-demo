import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { Button } from "@rneui/themed";
import { Container } from "../../lib/components/Container";
import { usePage } from "../../lib/context/page";

export default function Settings() {
  const { signOut, currentUser } = useAuth();
  return (
    <Container title="Settings">
      <Button style={styles.button} onPress={() => signOut()}>
        Sign Out
      </Button>
      <Text>{currentUser?.apiKey}</Text>
      <Text>{currentUser?.apiKey}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 20,
  },
});
