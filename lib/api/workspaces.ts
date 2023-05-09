import { ApiInput, ApiResult, getClient, processError } from "./client";

export interface GetWorkspacesInput extends ApiInput {}

export interface WorkspaceApiData {
  workspaceId: string;
  name: string;
  dataResidency: "auto" | "us" | "eu";
}

export interface GetWorkspacesResult extends ApiResult {
  workspaces?: WorkspaceApiData[];
}

export async function getWorkspaces(
  input: GetWorkspacesInput
): Promise<GetWorkspacesResult> {
  const client = getClient(input.currentUser);

  try {
    const response: { data: { data: WorkspaceApiData[] } } = await client.get(
      "/v1/workspaces",
      { params: { limit: 1000 } }
    );
    return { workspaces: response.data.data };
  } catch (err: any) {
    return processError(err, "Error getting workspaces");
  }
}
