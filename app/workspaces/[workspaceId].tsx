import { useSearchParams } from "expo-router";
import { Container } from "../../lib/components/Container";
import { Text } from "@rneui/themed";

export default function Workspace() {
  const { workspaceId } = useSearchParams();
  return (
    <Container>
      <Text>{workspaceId}</Text>
    </Container>
  );
}
