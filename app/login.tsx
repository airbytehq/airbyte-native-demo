import { View } from "react-native";
import { useAuth } from "../lib/context/auth";
import React from "react";
import { LoginForm, checkAndStoreLogin } from "../lib/api/login";
import { Button, Input } from "@rneui/themed";

export default function Login() {
  const { signIn } = useAuth();

  const [processing, setProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [apiKeyValue, setApiKeyValue] = React.useState("");

  async function submit(form: LoginForm) {
    setProcessing(true);
    setErrorMessage("");
    const { user, error } = await checkAndStoreLogin(form);
    if (user) {
      signIn(user);
    } else {
      setErrorMessage(error?.message || "Problem logging in");
    }
    setProcessing(false);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Input
        placeholder="Airbyte API Key"
        leftIcon={{ type: "font-awesome", name: "sign-in" }}
        secureTextEntry={true}
        value={apiKeyValue}
        onChangeText={setApiKeyValue}
        errorMessage={errorMessage}
        disabled={processing}
      ></Input>
      <Button
        disabled={processing}
        onPress={() => submit({ apiKey: apiKeyValue })}
      >
        Connect
      </Button>
    </View>
  );
}
