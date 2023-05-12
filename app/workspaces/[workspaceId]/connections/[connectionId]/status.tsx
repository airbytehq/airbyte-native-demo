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
import { StatusIcon } from "../../../../../lib/components/StatusIcon";
import { ScheduleApiData } from "../../../../../lib/api/connections";

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

  const connection = details?.connection;
  const info = details?.info;
  const source = details?.source;
  const destination = details?.destination;

  return (
    <Container
      defaultTitle="Connection"
      loading={details === undefined}
      hasScroll={true}
    >
      <ScrollView alwaysBounceVertical={true} alwaysBounceHorizontal={false}>
        <ListItem>
          <StatusIcon
            connectionStatus={connection?.status}
            jobStatus={info?.lastJobStatus}
            currentlyRunning={info?.currentlyRunning}
          />
          <ListItem.Content>
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
            <Text style={styles.name}>{connection?.name}</Text>
          </ListItem.Content>
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => {
            // TODO: Router push to source details
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{source?.name}</ListItem.Title>
            <ListItem.Subtitle>Source: {source?.sourceType}</ListItem.Subtitle>
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
            <ListItem.Title>{destination?.name}</ListItem.Title>
            <ListItem.Subtitle>
              Destination: {destination?.destinationType}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ScheduleListItem schedule={connection?.schedule} />
        <ListItem bottomDivider>
          <ListItem.Content>
            <View>
              <Text style={styles.textItem}>
                Namespace Definition: {connection?.namespaceDefinition}
              </Text>
              <Text style={styles.textItem}>
                Namespace Format: {connection?.namespaceFormat}
              </Text>
              <Text style={styles.textItem}>
                Destination Stream Prefix: {connection?.prefix || "None"}
              </Text>
              <Text style={styles.textItem}>
                Non-breaking schema updates detected:{" "}
                {connection?.nonBreakingSchemaUpdatesBehavior}
              </Text>
              <Text style={styles.textItem}>
                Data Residency: {connection?.dataResidency}
              </Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </ScrollView>
    </Container>
  );
}

function ScheduleListItem({ schedule }: { schedule: ScheduleApiData }) {
  switch (schedule?.scheduleType) {
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
            <ListItem.Subtitle>{schedule?.cronExpression}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    case "basic":
      return (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Basic Schedule</ListItem.Title>
            <ListItem.Subtitle>{schedule?.basicTiming}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
  },
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
