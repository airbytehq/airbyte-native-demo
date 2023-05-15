import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { Button } from "@rneui/themed";
import { Container } from "../../lib/components/Container";

export default function Settings() {
  const { signOut, currentUser } = useAuth();
  return (
    <Container defaultTitle="Settings">
      <View style={styles.top}></View>
      <Button style={styles.button} onPress={() => signOut()}>
        Sign Out
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 20,
    marginRight: 20,
  },
  top: {
    marginTop: 50,
  },
});
