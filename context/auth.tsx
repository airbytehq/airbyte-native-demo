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
    const inLoggedoutGroup = segments[0] === "(loggedout)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inLoggedoutGroup
    ) {
      // Redirect to the login page.
      router.replace("/login");
    } else if (user && inLoggedoutGroup) {
      // Redirect away from the login page.
      // TODO: if more than one loggedout page, check specifically for /login
      router.replace("/");
    }
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
