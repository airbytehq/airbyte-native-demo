import { Container } from "../../../../../lib/components/Container";
import { Text } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ListItem } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../lib/context/auth";
import { useProgress } from "../../../../../lib/context/progress";
import {
  ConnectionApiData,
  getConnection,
} from "../../../../../lib/api/connections";
import { FlatList } from "react-native";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();

  const { currentUser } = useAuth();
  const router = useRouter();
  const { showActivity } = useProgress();
  const [item, setItem] = useState<ConnectionApiData>(undefined);

  useEffect(() => {
    showActivity(true);
    getConnection({ currentUser, connectionId }).then((response) => {
      setItem(response.connection);
      showActivity(false);
    });
  }, []);

  return (
    <Container defaultTitle="Connection" loading={item === undefined}>
      <Text>Name: {item?.name}</Text>
      <Text>Status: {item?.status}</Text>
    </Container>
  );
}
