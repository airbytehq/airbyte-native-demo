import { Slot, useRouter, useNavigation, useSegments } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { AuthProvider, useAuth } from "../lib/context/auth";
import { ProgressProvider } from "../lib/context/progress";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Root() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <View style={styles.container}>
          <MyHeader />
          <Slot />
        </View>
      </ProgressProvider>
    </AuthProvider>
  );
}

function MyHeader() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const nav = useNavigation();
  const segments = useSegments();

  const isSettings = segments[segments.length - 1] === "settings";

  return (
    <HeaderRNE
      style={styles.header}
      // TODO: make it a profile menu and then sign out from there
      // icon: user
      leftComponent={
        <View style={styles.headerLeft}>
          {nav.canGoBack() && (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Icon type="font-awesome" color="white" name="chevron-left" />
            </TouchableOpacity>
          )}
        </View>
      }
      rightComponent={
        <View style={styles.headerRight}>
          {currentUser && !isSettings && (
            <TouchableOpacity
              onPress={() => {
                router.push("/workspaces/settings");
              }}
            >
              <Icon type="font-awesome" color="white" name="user" />
            </TouchableOpacity>
          )}
        </View>
      }
      centerComponent={{ text: "Airbyte", style: styles.headerCenter }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  header: {
    backgroundColor: "green",
    height: 100,
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
