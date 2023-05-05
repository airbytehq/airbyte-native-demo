import { ApiInput, ApiResult, getClient, processError } from "./client";

export interface GetConnectionsInput extends ApiInput {
  workspaceId: string;
}

export interface ScheduleData {
  scheduleType: "manual" | "cron" | "basic";
  cronExpression?: string;
  basicTiming?: string;
}

interface ConnectionData {
  connectionId: string;
  name: string;
  sourceId: string;
  destinationId: string;
  workspaceId: string;
  status: "active" | "inactive" | "deprecated";
  schedule: ScheduleData;
  dataResidency: "auto" | "us" | "eu";
  NonBreakingSchemaUpdatesBehavior?: "ignore" | "disable_connection";
  namespaceDefinition?: "source" | "destination" | "custom_format";
  namespaceFormat?: string;
  prefix?: string;
}

export interface Connection extends ConnectionData {}

export interface GetConnectionsResult extends ApiResult {
  connections?: Connection[];
}

export async function getConnections(
  input: GetConnectionsInput
): Promise<GetConnectionsResult> {
  const client = getClient(input.currentUser);

  try {
    const response: { data: { data: ConnectionData[] } } = await client.get(
      "/v1/connections",
      { params: { limit: 1000, workspaceIds: input.workspaceId } }
    );
    return { connections: response.data.data };
  } catch (err: any) {
    return processError(err, "Error getting workspaces");
  }
}
