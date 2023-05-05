import { useNavigation, useRouter, useSegments } from "expo-router";
import React from "react";
import { clearLogin } from "../api/login";
import { CurrentUser } from "../api/client";

export type AuthContextType = {
  currentUser: CurrentUser;
  signIn: (user: CurrentUser) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextType>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: CurrentUser) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const needsUser = segments[0] === "workspaces";
    const onLogin = segments[0] === "login";

    let toRender = true;
    if (!user && needsUser) {
      // Redirect to the login page.
      router.replace("/login");
      toRender = false;
    } else if (user && onLogin) {
      // Redirect away from the login page.
      router.replace("/workspaces");
      toRender = false;
    }
    // otherwise, show current page
  }, [user, segments]);
}

export function AuthProvider(props) {
  const [user, setAuth] = React.useState<CurrentUser | null>(null);

  useProtectedRoute(user);
  const nav = useNavigation();

  return (
    <AuthContext.Provider
      value={{
        signIn: (user: CurrentUser) => setAuth(user),
        signOut: () => {
          clearLogin();
          setAuth(null);
          nav.dispatch({ type: "POP_TO_TOP" });
        },
        currentUser: user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
