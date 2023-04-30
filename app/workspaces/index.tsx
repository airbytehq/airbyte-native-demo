import { FlatList, StyleSheet, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { useEffect, useState } from "react";
import { WorkspaceMeta, getWorkspaces } from "../../lib/api/workspaces";
import { ListItem } from "@rneui/themed";

export default function Index() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState<WorkspaceMeta[]>([]);

  useEffect(() => {
    getWorkspaces({ currentUser }).then((response) => {
      setTableData(response.workspaces);
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList<WorkspaceMeta>
        data={tableData}
        keyExtractor={(item) => {
          return item.workspaceId;
        }}
        renderItem={({ item }) => (
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.dataResidency}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
