import { useRouter } from "expo-router";
import { useEffect } from "react";
import { autoloadOnStartup } from "../lib/api/login";
import { useAuth } from "../lib/context/auth";
import { Text } from "@rneui/themed";
import { useProgress } from "../lib/context/progress";
import { Container } from "../lib/components/Container";

export default function Index() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showActivity } = useProgress();

  useEffect(() => {
    const autoLogin = async () => {
      showActivity(true);
      try {
        const user = await autoloadOnStartup();
        if (user) {
          signIn(user);
        }
        router.replace("/workspaces");
      } finally {
        showActivity(false);
      }
    };
    autoLogin();
  }, []);

  return (
    <Container>
      <Text>Airbyte Logo</Text>
    </Container>
  );
}
