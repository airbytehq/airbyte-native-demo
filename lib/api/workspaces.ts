import { ApiInput, ApiResult, getClient, processError } from "./client";

export interface GetWorkspacesInput extends ApiInput {}

interface WorkspaceData {
  workspaceId: string;
  name: string;
  dataResidency: "auto" | "us" | "eu";
}

export interface Workspace extends WorkspaceData {}

export interface GetWorkspacesResult extends ApiResult {
  workspaces?: Workspace[];
}

export async function getWorkspaces(
  input: GetWorkspacesInput
): Promise<GetWorkspacesResult> {
  const client = getClient(input.currentUser);

  try {
    const response: { data: { data: WorkspaceData[] } } = await client.get(
      "/v1/workspaces",
      { params: { limit: 1000 } }
    );
    return { workspaces: response.data.data };
  } catch (err: any) {
    return processError(err, "Error getting workspaces");
  }
}
