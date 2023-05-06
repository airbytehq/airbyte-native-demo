import { StyleSheet, View } from "react-native";
import { useAuth } from "../lib/context/auth";
import React from "react";
import { LoginForm, checkAndStoreLogin } from "../lib/api/login";
import { Button, Input } from "@rneui/themed";
import { useProgress } from "../lib/context/progress";
import { Container } from "../lib/components/Container";

export default function Login() {
  const { signIn } = useAuth();
  const { showActivity } = useProgress();

  const [processing, setProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [apiKeyValue, setApiKeyValue] = React.useState("");

  async function submit(form: LoginForm) {
    setProcessing(true);
    showActivity(true);
    setErrorMessage("");
    const { user, error } = await checkAndStoreLogin(form);
    if (user) {
      signIn(user);
    } else {
      setErrorMessage(error?.message || "Problem logging in");
    }
    showActivity(false);
    setProcessing(false);
  }

  return (
    <Container>
      <Input
        placeholder="Airbyte API Key"
        leftIcon={{ type: "font-awesome-5", name: "sign-in-alt" }}
        secureTextEntry={true}
        value={apiKeyValue}
        onChangeText={setApiKeyValue}
        errorMessage={errorMessage}
        errorStyle={styles.errorMessage}
        disabled={processing}
      ></Input>
      <Button
        style={styles.button}
        disabled={processing}
        onPress={() => submit({ apiKey: apiKeyValue })}
      >
        Connect
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  errorMessage: {},
  button: {
    marginTop: 20,
  },
});
