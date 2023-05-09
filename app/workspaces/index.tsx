import { FlatList } from "react-native";
import { useAuth } from "../../lib/context/auth";
import { useEffect, useState } from "react";
import { WorkspaceApiData, getWorkspaces } from "../../lib/api/workspaces";
import { ListItem } from "@rneui/themed";
import { Container } from "../../lib/components/Container";
import { useRouter } from "expo-router";
import { useProgress } from "../../lib/context/progress";

export default function Index() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { showActivity } = useProgress();
  const [tableData, setTableData] = useState<WorkspaceApiData[]>(undefined);

  useEffect(() => {
    showActivity(true);
    getWorkspaces({ currentUser }).then((response) => {
      setTableData(response.workspaces);
      showActivity(false);
    });
  }, []);

  return (
    <Container
      defaultTitle="Workspaces"
      hasScroll={true}
      loading={tableData === undefined}
    >
      <FlatList<WorkspaceApiData>
        data={tableData || []}
        keyExtractor={(item) => item.workspaceId}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => {
              const pathname = `/workspaces/${item.workspaceId}/connections`;
              const params = { title: item.name };
              router.push({ pathname, params });
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
