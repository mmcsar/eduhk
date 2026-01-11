import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { me as fetchMe, logout as doLogout } from "./src/lib/auth";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { LoadboardScreen } from "./src/screens/LoadboardScreen";
import { LoadDetailsScreen } from "./src/screens/LoadDetailsScreen";
import { SavedSearchesScreen } from "./src/screens/SavedSearchesScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Loadboard: undefined;
  LoadDetails: { loadId: string };
  SavedSearches: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const auth = useMemo(
    () => ({
      onLogin: () => setIsAuthed(true),
      onLogout: async () => {
        await doLogout();
        setIsAuthed(false);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMe();
        if (!cancelled) setIsAuthed(Boolean(data.user));
      } catch {
        if (!cancelled) setIsAuthed(false);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthed ? (
          <>
            <Stack.Screen name="Login" options={{ title: "Toleka" }}>
              {(props) => <LoginScreen {...props} onDone={auth.onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Register" options={{ title: "Créer un compte" }}>
              {(props) => <RegisterScreen {...props} onDone={auth.onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Loadboard" options={{ title: "Loadboard" }}>
              {(props) => <LoadboardScreen {...props} isAuthed={false} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Loadboard"
              options={{
                title: "Loadboard",
                headerRight: () => null,
              }}
            >
              {(props) => (
                <LoadboardScreen
                  {...props}
                  isAuthed
                  onLogout={auth.onLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="LoadDetails"
              component={LoadDetailsScreen}
              options={{ title: "Détails" }}
            />
            <Stack.Screen
              name="SavedSearches"
              component={SavedSearchesScreen}
              options={{ title: "Mes recherches" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
