import { Container } from "../../../../../lib/components/Container";
import { Icon, Switch, Text } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ListItem } from "@rneui/themed";
import React, { ReactElement, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../../../lib/context/auth";
import { useProgress } from "../../../../../lib/context/progress";
import {
  ConnectionDetailData,
  getConnectionDetails,
} from "../../../../../lib/api/connection";
import { ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();

  const { currentUser } = useAuth();
  const { showActivity } = useProgress();
  const [details, setDetails] = useState<ConnectionDetailData>(undefined);
  const [enabled, setEnabled] = useState(details?.info?.enabled || false);

  function refresh() {
    showActivity(true);
    getConnectionDetails({ currentUser, connectionId }).then((response) => {
      setDetails(response.details);
      setEnabled(response.details.info.enabled);
      showActivity(false);
    });
  }

  useFocusEffect(React.useCallback(refresh, []));

  return (
    <Container
      defaultTitle="Connection"
      loading={details === undefined}
      hasScroll={true}
    >
      <ScrollView alwaysBounceVertical={true} alwaysBounceHorizontal={false}>
        <ListItem>
          <ListItem.Content style={styles.topBar}>
            <Icon
              style={styles.badge}
              reverse
              {...Object.assign({}, getBadgeData(details), {
                type: "font-awesome-5",
                size: 18,
              })}
            />
            <View style={styles.enabledContainer}>
              <Text style={styles.enabledLabel}>
                {enabled ? "Enabled" : "Disabled"}
              </Text>
              <Switch
                style={styles.enabledSwitch}
                value={enabled}
                disabled={details === undefined}
                onValueChange={(value) => {
                  // TODO: change via API, then (or maybe it should be optimistic?)
                  details.info.enabled = true;
                  details.connection.status = "active";
                  setEnabled(value);
                }}
              />
            </View>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <Text style={styles.name}>{details?.connection?.name}</Text>
          </ListItem.Content>
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            // TODO: Router push to source details
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{details?.source?.name}</ListItem.Title>
            <ListItem.Subtitle>
              Source: {details?.source?.sourceType}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            // TODO: Router push to source details
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{details?.destination?.name}</ListItem.Title>
            <ListItem.Subtitle>
              Destination: {details?.destination?.destinationType}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ScheduleListItem details={details} />
        <ListItem bottomDivider>
          <ListItem.Content>
            <View>
              <Text style={styles.textItem}>
                Namespace Definition: {details?.connection?.namespaceDefinition}
              </Text>
              <Text style={styles.textItem}>
                Namespace Format: {details?.connection?.namespaceFormat}
              </Text>
              <Text style={styles.textItem}>
                Destination Stream Prefix:{" "}
                {details?.connection?.prefix || "None"}
              </Text>
              <Text style={styles.textItem}>
                Non-breaking schema updates detected:{" "}
                {details?.connection?.nonBreakingSchemaUpdatesBehavior}
              </Text>
              <Text style={styles.textItem}>
                Data Residency: {details?.connection?.dataResidency}
              </Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </ScrollView>
    </Container>
  );
}

function ScheduleListItem({ details }: { details: ConnectionDetailData }) {
  switch (details?.connection?.schedule?.scheduleType) {
    case "manual":
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Manual Schedule</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      );
    case "cron":
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Cron Schedule</ListItem.Title>
            <ListItem.Subtitle>
              {details?.connection?.schedule?.cronExpression}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    case "basic":
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Basic Schedule</ListItem.Title>
            <ListItem.Subtitle>
              {details?.connection?.schedule?.basicTiming}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    default:
      return null;
  }
}

function getBadgeData(details: ConnectionDetailData): {
  name: string;
  color: string;
} {
  const defaultData = {
    name: "",
    color: "#ffffff", // hidden
  };
  if (!details) {
    return defaultData;
  }
  if (details.connection.status === "inactive") {
    return {
      name: "pause",
      color: "#aaaaaa",
    };
  }
  switch (details.info.lastJobStatus) {
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

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
  },
  topBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  badge: {},
  enabledContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  enabledLabel: {
    fontSize: 20,
    marginRight: 10,
    alignSelf: "center",
  },
  enabledSwitch: {
    alignSelf: "center",
  },
  textItem: {
    fontSize: 14,
  },
});
