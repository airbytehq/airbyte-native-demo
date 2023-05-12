import { Icon } from "@rneui/base";
import { JobApiStatus, STATES_RUNNING } from "../api/connection";
import { ConnectionApiStatus } from "../api/connections";
import { ActivityIndicator } from "react-native";

export type JobIconProps = {
  connectionStatus?: ConnectionApiStatus;
  jobStatus: JobApiStatus;
  currentlyRunning?: boolean;
  size?: number;
};

export function StatusIcon(props: JobIconProps) {
  // if (props.currentlyRunning || STATES_RUNNING.includes(props.jobStatus)) {
  //   return <ActivityIndicator size="large" />;
  // }
  return (
    <Icon
      reverse
      {...Object.assign({}, getBadgeData(props), {
        type: "font-awesome-5",
        size: props.size || 18,
      })}
    />
  );
}

function getBadgeData({
  connectionStatus,
  jobStatus,
  currentlyRunning,
}: JobIconProps): {
  name: string;
  color: string;
} {
  const defaultData = {
    name: "",
    color: "#ffffff", // hidden
  };
  if (connectionStatus === "inactive") {
    return {
      name: "pause",
      color: "#aaaaaa",
    };
  }
  if (currentlyRunning || STATES_RUNNING.includes(jobStatus)) {
    return {
      name: "spinner",
      color: "#615eff",
    };
  }
  switch (jobStatus) {
    case "succeeded":
      return {
        name: "check",
        color: "#67dae1",
      };
    case "cancelled":
      return {
        name: "slash",
        color: "#aaaaaa",
      };
    case "failed":
      return {
        name: "exclamation",
        color: "#ff5e7b",
      };
    // case incomplete, none
  }

  // TODO: how to should info.currentlyRunning? Cloud shows a spinner around the icon
  return defaultData;
}
