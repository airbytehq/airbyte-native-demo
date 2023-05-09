import { useLocalSearchParams, useRouter } from "expo-router";
import { Container } from "../../../../lib/components/Container";
import { ListItem } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/context/auth";
import { useProgress } from "../../../../lib/context/progress";
import {
  ConnectionApiData,
  getConnections,
} from "../../../../lib/api/connections";
import { FlatList } from "react-native";

export default function Connections() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { showActivity } = useProgress();
  const [tableData, setTableData] = useState<ConnectionApiData[]>(undefined);

  const workspaceId = useLocalSearchParams().workspaceId.toString();

  useEffect(() => {
    showActivity(true);
    getConnections({ currentUser, workspaceId }).then((response) => {
      setTableData(response.connections);
      showActivity(false);
    });
  }, []);

  return (
    <Container
      defaultTitle="Connections"
      hasScroll={true}
      loading={tableData === undefined}
    >
      <FlatList<ConnectionApiData>
        data={tableData || []}
        keyExtractor={(item) => item.connectionId}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() => {
              const pathname = `/workspaces/${item.workspaceId}/connections/${item.connectionId}/status`;
              const params = {};
              router.push({ pathname, params });
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.status}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </Container>
  );
}
