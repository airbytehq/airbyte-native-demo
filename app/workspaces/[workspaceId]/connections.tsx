import { useSearchParams } from "expo-router";
import { Container } from "../../../lib/components/Container";
import { Text } from "@rneui/themed";

export default function Connections() {
  const { workspaceId } = useSearchParams();
  return (
    <Container title="Connections">
      <Text>Connections: {workspaceId}</Text>
    </Container>
  );
}
