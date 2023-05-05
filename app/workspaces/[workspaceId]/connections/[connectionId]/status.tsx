import { useLocalSearchParams } from "expo-router";
import { Container } from "../../../../../lib/components/Container";
import { Text } from "@rneui/themed";

export default function Status() {
  const { workspaceId, connectionId } = useLocalSearchParams();
  return (
    <Container defaultTitle="Connection">
      <Text>Connection: {connectionId}</Text>
    </Container>
  );
}
