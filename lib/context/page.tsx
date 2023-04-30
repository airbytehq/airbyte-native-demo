import React from "react";
import {
  useRouter,
  useNavigation,
  useSegments,
  useSearchParams,
} from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useAuth } from "./auth";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export type PageContextType = {
  setTitle: (title: string) => void;
};

const PageContext = React.createContext<PageContextType>(null);

// This hook can be used to access the user info.
export function usePage() {
  return React.useContext(PageContext);
}

export function PageProvider(props) {
  const router = useRouter();
  const params = useSearchParams();
  const title =
    params.title === undefined ? "Airbyte" : params.title.toString();

  return (
    <PageContext.Provider
      value={{
        setTitle: (update: string) => router.setParams({ title: update }),
      }}
    >
      <View style={styles.container}>
        <MyHeader title={title} />
        <View style={styles.slot}>{props.children}</View>
      </View>
    </PageContext.Provider>
  );
}

type MyHeaderProps = {
  title: string;
};
function MyHeader(props: MyHeaderProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const nav = useNavigation();
  const segments = useSegments();

  const isSettings = segments[segments.length - 1] === "settings";

  return (
    <HeaderRNE
      style={styles.headerParent}
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
      centerComponent={{ text: props.title, style: styles.headerCenter }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  slot: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  headerParent: {
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
