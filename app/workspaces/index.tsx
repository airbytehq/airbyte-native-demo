import { FlatList, StyleSheet, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { useEffect, useState } from "react";
import { WorkspaceMeta, getWorkspaces } from "../../lib/api/workspaces";
import { ListItem } from "@rneui/themed";
import { Container } from "../../lib/components/Container";

export default function Index() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState<WorkspaceMeta[]>([]);

  useEffect(() => {
    getWorkspaces({ currentUser }).then((response) => {
      console.log(response.workspaces);
      setTableData(response.workspaces);
    });
  }, []);

  return (
    <Container hasScroll={true}>
      <FlatList<WorkspaceMeta>
        data={tableData}
        keyExtractor={(item) => item.workspaceId}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.dataResidency}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({});
