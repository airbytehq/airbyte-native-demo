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
} from "../../../../../lib/api/connection";
import { ScrollView, StyleSheet } from "react-native";
import { View } from "react-native";

export default function Status() {
  const connectionId = useLocalSearchParams().connectionId.toString();

  const { currentUser } = useAuth();
  const { showActivity } = useProgress();
  const [details, setDetails] = useState<ConnectionDetailData>(undefined);

  function refresh() {
    showActivity(true);
    getConnectionDetails({ currentUser, connectionId }).then((response) => {
      setDetails(response.details);
      showActivity(false);
    });
  }

  useFocusEffect(React.useCallback(refresh, []));

  return (
    <Container defaultTitle="Syncs">
      <Text>Syncs: {connectionId}</Text>
    </Container>
  );
}
