import { Icon } from "@rneui/base";
import { JobApiStatus } from "../api/connection";
import { ConnectionApiStatus } from "../api/connections";

export type JobIconProps = {
  connectionStatus?: ConnectionApiStatus;
  jobStatus: JobApiStatus;
  currentlyRunning?: boolean;
};

export function StatusIcon(props: JobIconProps) {
  return (
    <Icon
      reverse
      {...Object.assign({}, getBadgeData(props), {
        type: "font-awesome-5",
        size: 18,
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
