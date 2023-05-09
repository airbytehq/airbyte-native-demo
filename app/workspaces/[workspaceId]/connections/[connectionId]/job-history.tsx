import { useLocalSearchParams } from "expo-router";
import { Container } from "../../../../../lib/components/Container";
import { Text } from "@rneui/themed";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();
  return (
    <Container defaultTitle="Syncs">
      <Text>Syncs: {connectionId}</Text>
    </Container>
  );
}
