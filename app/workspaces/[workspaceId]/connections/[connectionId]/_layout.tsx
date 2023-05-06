import { Tabs, useLocalSearchParams, useSegments } from "expo-router";
import { Container } from "../../../../../lib/components/Container";
import { Icon } from "@rneui/themed";

const PATH_STATUS = "status";
const PATH_JOB_HISTORY = "job-history";

const tabs = {
  [PATH_STATUS]: {
    title: "Connection",
    icon: "octopus-deploy",
  },
  [PATH_JOB_HISTORY]: {
    title: "Syncs",
    icon: "sync",
  },
};

export default function Root() {
  const { workspaceId, connectionId } = useLocalSearchParams();
  const root = `/workspaces/${workspaceId.toString()}/connections/${connectionId.toString()}/`;
  const segments = useSegments();

  return (
    <Container title={calculateTitle(segments)} navigator={true}>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen {...getTab(root, PATH_STATUS)} />
        <Tabs.Screen {...getTab(root, PATH_JOB_HISTORY)} />
      </Tabs>
    </Container>
  );
}

function getTab(root: string, path: string): Parameters<typeof Tabs.Screen>[0] {
  const { title, icon } = tabs[path];
  return {
    name: path,
    options: {
      href: root + path,
      tabBarLabel: title,
      tabBarIcon: ({ focused, color, size }) => {
        return (
          <Icon type="font-awesome-5" color={color} size={size} name={icon} />
        );
      },
    },
  };
}

function calculateTitle(segments: string[]): string {
  switch (segments[segments.length - 1]) {
    case PATH_STATUS:
      return tabs[PATH_STATUS].title;
    case PATH_JOB_HISTORY:
      return tabs[PATH_JOB_HISTORY].title;
    default:
      return "Connection";
  }
}
