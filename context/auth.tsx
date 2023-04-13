import { useRouter, useSegments } from "expo-router";
import React from "react";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
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
  const [user, setAuth] = React.useState(null);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: ({ apiKey }) => setAuth({ apiKey }),
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
