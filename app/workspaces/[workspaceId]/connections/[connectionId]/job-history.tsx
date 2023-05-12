import { Container } from "../../../../../lib/components/Container";
import { Icon, Switch, Text } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../../../lib/context/auth";
import { useProgress } from "../../../../../lib/context/progress";
import {
  ConnectionDetailData,
  getConnectionDetails,
  JobApiData,
} from "../../../../../lib/api/connection";
import { FlatList, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";
import { StatusIcon } from "../../../../../lib/components/StatusIcon";

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

function getSubtitle(job: JobApiData): string {
  if (!job) return "";
  const lines = [];
  const info = [];
  if (job.startTime) {
    lines.push(job.startTime); // TODO: format
  }
  if (job.bytesSynced === 1) {
    info.push(`${job.bytesSynced} byte`);
  } else if (job.bytesSynced > 1) {
    info.push(`${job.bytesSynced} bytes`);
  }

  if (job.rowsSynced === 1) {
    info.push(`${job.rowsSynced} row`);
  } else if (job.rowsSynced > 1) {
    info.push(`${job.rowsSynced} rows`);
  }
  if (job.duration) {
    info.push(`${job.duration}`); // TODO: Format ISO8601 duration like "PT33S" (for 33 seconds)
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

const styles = StyleSheet.create({});
