import { ScrollView, StyleSheet, View } from "react-native";
import { PropsWithChildren } from "react";

export type ParentContainerProps = {
  hasScroll?: boolean;
};

export function Container(props: PropsWithChildren<ParentContainerProps>) {
  if (props.hasScroll) {
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
  scroll: {},
});
