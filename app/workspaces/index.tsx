import { FlatList, RefreshControl } from "react-native";
import { useAuth } from "../../lib/context/auth";
import React, { useEffect, useState } from "react";
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

  function refresh() {
    showActivity(true);
    return getWorkspaces({ currentUser })
      .then((response) => {
        setTableData(response.workspaces);
      })
      .finally(() => {
        showActivity(false);
      });
  }
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    refresh();
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
        refreshControl={<RefreshControl {...{ refreshing, onRefresh }} />}
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
