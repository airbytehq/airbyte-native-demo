import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { PropsWithChildren, useEffect } from "react";
import { Text } from "@rneui/themed";
import {
  useRouter,
  useNavigation,
  useSegments,
  useSearchParams,
} from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useAuth } from "../context/auth";
import { useProgress } from "../context/progress";
import { LinearProgress } from "@rneui/themed";

export type ParentContainerProps = {
  title?: string;
  hasScroll?: boolean;
  loading?: boolean;
};

export function Main(props: PropsWithChildren<ParentContainerProps>) {
  if (props.loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading</Text>
      </View>
    );
  } else if (props.hasScroll) {
    return <View style={styles.hasScroll}>{props.children}</View>;
  } else {
    return (
      <ScrollView
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style={styles.addScroll}
      >
        {props.children}
      </ScrollView>
    );
  }
}

export function Container(props: PropsWithChildren<ParentContainerProps>) {
  const params = useSearchParams();

  const title: string = (params.title || props.title || "Airbyte").toString();

  return (
    <View style={styles.container}>
      <MyHeader title={title} />
      <ProgressBar />
      <Main {...props}>{props.children}</Main>
    </View>
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

function ProgressBar() {
  const { isProcessing } = useProgress();

  if (isProcessing) {
    return <LinearProgress color="primary" style={styles.progress} />;
  } else {
    return <View style={[styles.progress, { backgroundColor: "#2089dc" }]} />;
  }
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
  // progress
  progress: {
    position: "relative",
    top: -3,
    height: 5,
    marginBottom: -3,
  },
  // main
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hasScroll: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  addScroll: {},
});
