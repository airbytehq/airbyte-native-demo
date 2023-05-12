import { ApiInput, ApiResult, getClient, processError } from "./client";
import {
  GetConnectionDetailsResult,
  JobApiData,
  JobApiType,
  getConnectionDetails,
} from "./connection";

export interface StartSyncInput extends ApiInput {
  connectionId: string;
  jobType: JobApiType;
}
export interface StartSyncResult extends ApiResult {
  job?: JobApiData;
}
export async function startSync(
  input: StartSyncInput
): Promise<StartSyncResult> {
  const client = getClient(input.currentUser);
  const { connectionId, jobType } = input;

  try {
    const response: { data: JobApiData } = await client.post("/v1/jobs", {
      connectionId,
      jobType,
    });

    return { job: response.data };
  } catch (err: any) {
    return processError(err, "Error starting sync");
  }
}
