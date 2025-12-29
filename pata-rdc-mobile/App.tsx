import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuthStore } from './src/store/authStore';
import { AuthContext } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from './src/screens/main/HomeScreen';
import SearchScreen from './src/screens/main/SearchScreen';
import BookingHistoryScreen from './src/screens/main/BookingHistoryScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  const { userToken, setUser, setToken } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setToken(token);
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
          const mockUser = {
            id: '123',
            email,
            firstName: 'Test',
            role: 'client',
          };
          setUser(mockUser);
          setToken('mock-token');
          return { success: true };
        } catch (error) {
          return { success: false, error };
        }
      },
      signUp: async () => {
        return { success: true };
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userToken');
      },
    }),
    [setToken, setUser]
  );

  if (isLoading) {
    return null;
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
