import { useRouter } from "expo-router";
import { useEffect } from "react";
import { autoloadOnStartup } from "../lib/api/login";
import { useAuth } from "../lib/context/auth";
import { Image } from "@rneui/themed";
import { useProgress } from "../lib/context/progress";
import { Container } from "../lib/components/Container";
import { Dimensions, StyleSheet, View } from "react-native";

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
    <Container title=" ">
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/airbyte_logo.png")}
        />
      </View>
    </Container>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const imageWidth = Math.min(windowWidth - 40, 500);
const imageHeight = (200 / 738.0) * imageWidth;
const toolbarHeight = 56;
const aboveHeight =
  (windowHeight - imageHeight) / 2 - imageHeight / 2 - toolbarHeight;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: aboveHeight,
    width: imageWidth,
    height: imageHeight,
  },
});
