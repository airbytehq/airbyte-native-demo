import { FlatList, StyleSheet, View } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { useEffect, useState } from "react";
import { WorkspaceMeta, getWorkspaces } from "../../lib/api/workspaces";
import { ListItem } from "@rneui/themed";
import { Container } from "../../lib/components/Container";
import { usePathname, useRouter } from "expo-router";
import { useProgress } from "../../lib/context/progress";

export default function Index() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { showActivity } = useProgress();
  const currentPath = usePathname();
  const [tableData, setTableData] = useState<WorkspaceMeta[]>(undefined);

  useEffect(() => {
    showActivity(true);
    getWorkspaces({ currentUser }).then((response) => {
      setTableData(response.workspaces);
      showActivity(false);
    });
  }, []);

  return (
    <Container
      title="Workspaces"
      hasScroll={true}
      loading={tableData === undefined}
    >
      <FlatList<WorkspaceMeta>
        data={tableData || []}
        keyExtractor={(item) => item.workspaceId}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => {
              router.push(`${currentPath}/${item.workspaceId}/connections`);
            }}
          >
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
