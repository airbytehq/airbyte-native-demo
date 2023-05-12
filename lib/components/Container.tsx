import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { PropsWithChildren } from "react";
import { Text } from "@rneui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useProgress } from "../context/progress";
import { LinearProgress } from "@rneui/themed";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export type ParentContainerProps = {
  title?: string;
  defaultTitle?: string;
  hasScroll?: boolean;
  navigator?: boolean;
  inTabs?: boolean;
  loading?: boolean;
};

export function Main(props: PropsWithChildren<ParentContainerProps>) {
  if (props.loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading</Text>
      </View>
    );
  } else if (props.hasScroll || props.navigator) {
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
  const params = useLocalSearchParams();

  const options: NativeStackNavigationOptions = {};
  if (!props.inTabs) {
    const title: string = (
      props.title ||
      params.title ||
      props.defaultTitle ||
      "Airbyte"
    ).toString();
    options.title = title;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={options} />
      {!props.inTabs && <ProgressBar />}
      <Main {...props}>{props.children}</Main>
    </View>
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
