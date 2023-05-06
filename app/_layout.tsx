import { useNavigation, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../lib/context/auth";
import { ProgressProvider } from "../lib/context/progress";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "@rneui/themed";
import { StyleSheet } from "react-native";

export default function Root() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Stack
          screenOptions={{
            headerStyle: styles.headerParent,
            headerTitleStyle: styles.headerCenter,
            headerLeft: () => <HeaderLeft />,
            headerRight: () => <HeaderRight />,
          }}
        />
      </ProgressProvider>
    </AuthProvider>
  );
}

function HeaderLeft() {
  const nav = useNavigation();
  const router = useRouter();
  return (
    <View style={styles.headerLeft}>
      {nav.canGoBack() && (
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Icon type="font-awesome-5" color="white" name="chevron-left" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function HeaderRight() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const isSettings = segments[segments.length - 1] === "settings";

  return (
    <View style={styles.headerRight}>
      {currentUser && !isSettings && (
        <TouchableOpacity
          onPress={() => {
            router.push("/workspaces/settings");
          }}
        >
          <Icon type="font-awesome-5" color="white" name="user" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerParent: {
    backgroundColor: "#2089dc",
  },
  headerCenter: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
  },
});
