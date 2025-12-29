import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthStore } from './src/store/authStore';
import { AuthContext } from './src/context/AuthContext';
import { USER_KEY, USER_TOKEN_KEY } from './src/constants/storage';
import type { AuthStackParamList, MainTabParamList } from './src/types/navigation';
import type { User } from './src/types/auth';
import { authErrorMessage, clearSession, login, persistSession, register } from './src/services/authService';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from './src/screens/main/HomeScreen';
import SearchScreen from './src/screens/main/SearchScreen';
import BookingHistoryScreen from './src/screens/main/BookingHistoryScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: can throw if already prevented
});

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'BookingHistory') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { userToken, setUser, setToken, logout } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [token, userJson] = await Promise.all([
          SecureStore.getItemAsync(USER_TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (token) setToken(token);
        if (userJson) {
          try {
            const user = JSON.parse(userJson) as User;
            setUser(user);
          } catch {
            // ignore invalid stored user
          }
        }
      } catch (error) {
        console.error('Bootstrap error:', error);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, [setToken]);

  const authContext = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        try {
          if (!email || !password) {
            return { success: false as const, error: 'Missing email or password' };
          }
          const { token, user } = await login({ email, password });
          await persistSession(token, user);
          setUser(user);
          setToken(token);
          return { success: true as const };
        } catch (error) {
          return { success: false as const, error: authErrorMessage(error) };
        }
      },
      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        try {
          if (!email || !password || !firstName || !lastName) {
            return { success: false as const, error: 'Please fill in all fields' };
          }
          await register({ email, password, firstName, lastName });
          return { success: true as const };
        } catch (error) {
          return { success: false as const, error: authErrorMessage(error) };
        }
      },
      signOut: async () => {
        await clearSession();
        logout();
      },
    }),
    [logout, setToken, setUser]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {userToken ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
