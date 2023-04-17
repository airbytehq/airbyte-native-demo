export interface CurrentUser {
  apiKey: string;
}
export type AuthContextType = {
  user: CurrentUser;
  signIn: (user: CurrentUser) => void;
  signOut: () => void;
};
