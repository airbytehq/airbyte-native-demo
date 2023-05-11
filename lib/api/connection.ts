import { AxiosInstance } from "axios";
import {
  ApiInput,
  ApiResult,
  CurrentUser,
  getClient,
  processError,
} from "./client";
import { ConnectionApiData } from "./connections";

export interface SourceApiData {
  sourceId: string;
  name: string;
  sourceType: string;
  workspaceId: string;
}

export interface DestinationApiData {
  destinationId: string;
  name: string;
  destinationType: string;
  workspaceId: string;
}

export interface JobApiData {
  jobId: number;
  status:
    | "pending"
    | "running"
    | "incomplete"
    | "failed"
    | "succeeded"
    | "cancelled";
  jobType: "sync" | "reset";
  startTime: string;
  lastUpdatedAt: string;
  duration: string;
  bytesSynced: number;
  rowsSynced: number;
}

export interface ConnectionCalculatedData {
  lastJobStatus: string;
}

export interface ConnectionDetailData {
  connection: ConnectionApiData;
  source: SourceApiData;
  destination: DestinationApiData;
  jobs: JobApiData[];
  info: ConnectionCalculatedData;
}

export interface GetConnectionDetailsInput extends ApiInput {
  connectionId: string;
}
export interface GetConnectionDetailsResult extends ApiResult {
  details?: ConnectionDetailData;
}

export async function getConnectionDetails(
  input: GetConnectionDetailsInput
): Promise<GetConnectionDetailsResult> {
  const client = getClient(input.currentUser);

  try {
    const connection = await getConnection(input);

    const [source, destination, jobs] = await Promise.all([
      getSource(client, connection.sourceId),
      getDestination(client, connection.destinationId),
      getJobs(client, connection.connectionId),
    ]);

    const info: ConnectionCalculatedData = {
      lastJobStatus: jobs.length > 0 ? jobs[0].status : "none",
    };

    return { details: { connection, source, destination, jobs, info } };
  } catch (err: any) {
    return processError(err, "Error getting connection details");
  }
}

async function getConnection(
  input: GetConnectionDetailsInput
): Promise<ConnectionApiData> {
  const client = getClient(input.currentUser);
  const response: { data: ConnectionApiData } = await client.get(
    `/v1/connections/${input.connectionId}`,
    { params: {} }
  );
  return response.data;
}

async function getSource(
  client: AxiosInstance,
  sourceId: string
): Promise<SourceApiData> {
  const response: { data: SourceApiData } = await client.get(
    `/v1/sources/${sourceId}`,
    { params: {} }
  );
  return response.data;
}

async function getDestination(
  client: AxiosInstance,
  destinationId: string
): Promise<DestinationApiData> {
  const response: { data: DestinationApiData } = await client.get(
    `/v1/destinations/${destinationId}`,
    { params: {} }
  );
  return response.data;
}

async function getJobs(
  client: AxiosInstance,
  connectionId: string
): Promise<JobApiData[]> {
  const response: { data: { data: JobApiData[] } } = await client.get(
    `/v1/jobs`,
    {
      params: { connectionId, limit: 1000 },
    }
  );
  return response.data.data;
}
