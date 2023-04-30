import { ApiInput, ApiResult, getClient, processError } from "./client";

export interface GetWorkspacesInput extends ApiInput {}

export interface WorkspaceMeta {
  workspaceId: string;
  name: string;
  dataResidency: "auto" | "us" | "eu";
}

export interface GetWorkspacesResult extends ApiResult {
  workspaces?: WorkspaceMeta[];
}

export async function getWorkspaces(
  input: GetWorkspacesInput
): Promise<GetWorkspacesResult> {
  const client = getClient(input.currentUser);

  try {
    const response: { data: WorkspaceMeta[] } = await client.get(
      "/v1/workspaces"
    );
    return { workspaces: response.data };
  } catch (err: any) {
    return processError(err, "Error getting workspaces");
  }
}
