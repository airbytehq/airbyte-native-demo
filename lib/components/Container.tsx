import { ScrollView, StyleSheet, View } from "react-native";
import { PropsWithChildren } from "react";
import { Text } from "@rneui/themed";

export type ParentContainerProps = {
  hasScroll?: boolean;
  loading?: boolean;
};

export function Container(props: PropsWithChildren<ParentContainerProps>) {
  if (props.loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading</Text>
      </View>
    );
  } else if (props.hasScroll) {
    return <View style={styles.container}>{props.children}</View>;
  } else {
    return (
      <ScrollView
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style={styles.scroll}
      >
        {props.children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {},
});
