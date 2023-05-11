import { Container } from "../../../../../lib/components/Container";
import { Text } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ListItem } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../lib/context/auth";
import { useProgress } from "../../../../../lib/context/progress";
import {
  ConnectionDetailData,
  getConnectionDetails,
} from "../../../../../lib/api/connection";
import { FlatList } from "react-native";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();

  const { currentUser } = useAuth();
  const router = useRouter();
  const { showActivity } = useProgress();
  const [item, setItem] = useState<ConnectionDetailData>(undefined);

  useEffect(() => {
    showActivity(true);
    getConnectionDetails({ currentUser, connectionId }).then((response) => {
      setItem(response.details);
      showActivity(false);
    });
  }, []);

  return (
    <Container defaultTitle="Connection" loading={item === undefined}>
      <Text>Name: {item?.connection?.name}</Text>
      <Text>Status: {item?.connection?.status}</Text>
      <Text>Last Job: {item?.info?.lastJobStatus}</Text>
      <Text>Job Count: {item?.jobs?.length}</Text>
      <Text>Source: {item?.source?.name}</Text>
      <Text>Destination: {item?.destination?.name}</Text>
    </Container>
  );
}
