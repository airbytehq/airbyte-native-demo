import { Container } from "../../../../../lib/components/Container";
import { useLocalSearchParams } from "expo-router";
import { Button, Icon, ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../../../lib/context/auth";
import { useProgress } from "../../../../../lib/context/progress";
import {
  ConnectionDetailData,
  getConnectionDetails,
  JobApiData,
  JobApiType,
} from "../../../../../lib/api/connection";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { StatusIcon } from "../../../../../lib/components/StatusIcon";
import { durationReadable } from "../../../../../lib/duration";
import { bytesReadable, timeReadable } from "../../../../../lib/util";
import { startSync } from "../../../../../lib/api/startSync";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();

  const { currentUser } = useAuth();
  const { showActivity } = useProgress();
  const [details, setDetails] = useState<ConnectionDetailData>(undefined);
  const tableData = details?.jobs;

  function refresh() {
    showActivity(true);
    return getConnectionDetails({ currentUser, connectionId })
      .then((response) => {
        setDetails(response.details);
      })
      .finally(() => {
        showActivity(false);
      });
  }
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh().finally(() => {
      setRefreshing(false);
    });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      refresh();
      const intervalId = setInterval(() => {
        refresh();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }, [connectionId])
  );

  return (
    <Container
      defaultTitle="Syncs"
      hasScroll={true}
      loading={tableData === undefined}
    >
      <FlatList<JobApiData>
        data={tableData || []}
        keyExtractor={(item) => "" + item.jobId}
        refreshControl={<RefreshControl {...{ refreshing, onRefresh }} />}
        ListHeaderComponent={<SyncHeader details={details} refresh={refresh} />}
        renderItem={({ item }) => <JobItem job={item} />}
      />
    </Container>
  );
}

function JobItem({ job }: { job: JobApiData }) {
  return (
    <ListItem bottomDivider>
      <StatusIcon jobStatus={job?.status} size={14} />
      <ListItem.Content>
        <ListItem.Title>{getTitle(job)}</ListItem.Title>
        <ListItem.Subtitle>{getSubtitle(job)}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

function SyncHeader({
  details,
  refresh,
}: {
  details: ConnectionDetailData;
  refresh: () => Promise<void>;
}) {
  const { currentUser } = useAuth();
  const { showActivity } = useProgress();
  const [processing, setProcessing] = useState(false);
  const currentlyRunning = !!details?.info?.currentlyRunning;
  const disabled =
    processing || currentlyRunning || details?.connection?.status !== "active";
  const connectionId = details?.connection?.connectionId;

  function confirmReset() {
    Alert.alert(
      "Reset your data",
      "Resetting your data will delete all the data for this connection in your destination and start syncs from scratch. Are you sure you want to do this?",
      [
        {
          text: "No need!",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Reset", onPress: () => submit("reset") },
      ]
    );
  }

  function submit(jobType: JobApiType) {
    showActivity(true);
    setProcessing(true);
    startSync({ currentUser, connectionId, jobType })
      .then(refresh)
      .then(() => {})
      .finally(() => {
        setProcessing(false);
        showActivity(false);
      });
  }
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={styles.headerContainer}>
          <Button type="outline" disabled={disabled} onPress={confirmReset}>
            Reset your data
          </Button>
          <Button
            style={styles.syncButton}
            disabled={disabled}
            onPress={() => submit("sync")}
          >
            <Icon
              style={styles.buttonIcon}
              type="font-awesome-5"
              name="sync"
              color="white"
              size={16}
            />
            Sync now
          </Button>
        </View>
      </ListItem.Content>
    </ListItem>
  );
}

function getSubtitle(job: JobApiData): string {
  if (!job) return "";
  const lines = [];
  const info = [];

  if (job.startTime) {
    lines.push(timeReadable(job.startTime));
  }

  if (job.bytesSynced) {
    info.push(bytesReadable(job.bytesSynced));
  }

  if (job.rowsSynced === 1) {
    info.push(`${job.rowsSynced} row`);
  } else if (job.rowsSynced > 1) {
    info.push(`${job.rowsSynced} rows`);
  }

  if (job.duration) {
    info.push(durationReadable(job.duration));
  }

  if (info.length > 0) {
    lines.push(info.join(" | "));
  }
  return lines.join("\n");
}

function getTitle(job: JobApiData): string {
  if (!job) return "";
  const type = job.jobType === "reset" ? "Reset" : "Sync";
  switch (job.status) {
    // all types
    case "failed":
      return `${type} Failed`;
    case "succeeded":
      return `${type} Successful`;
    case "running":
      return `${type} Running`;
    case "cancelled":
      return `${type} Cancelled`;
    case "pending":
      return `${type} Pending`;
  }

  return "";
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  syncButton: {
    marginLeft: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
