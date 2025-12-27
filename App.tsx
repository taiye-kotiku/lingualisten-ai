import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';

// Auth Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import PasswordRecoveryScreen from './src/screens/Auth/PasswordRecoveryScreen';

// App Screens
import HomeScreen from './src/screens/App/HomeScreen';
import ProfileScreen from './src/screens/App/ProfileScreen';
import BrowseScreen from './src/screens/App/BrowseScreen';
import ContentDisplayScreen from './src/screens/App/ContentDisplayScreen';
import VoicePracticeFeedback from './src/screens/App/VoicePracticeFeedback';

// Dynamically import SearchScreen with fallback
let SearchScreen: any;
try {
  SearchScreen = require('./src/screens/App/SearchScreen').default;
} catch (e) {
  // Fallback component if SearchScreen doesn't exist yet
  SearchScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search Screen Coming Soon</Text>
    </View>
  );
}

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Stack - Shown when user is not logged in
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{}}
      />
      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecoveryScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}

/**
 * Home Stack - Main app screens with home
 */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name="ContentDisplay"
        component={ContentDisplayScreen}
        options={{ title: 'Phrase Details' }}
      />
      <Stack.Screen
        name="VoicePractice"
        component={VoicePracticeFeedback}
        options={{ title: 'Practice' }}
      />
    </Stack.Navigator>
  );
}

/**
 * App Tab Navigator - Bottom tabs when user is logged in
 */
function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A855F7',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          title: 'Browse',
          tabBarLabel: 'Browse',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📖</Text>,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator - Handles auth state
 */
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{}}
        />
      ) : (
        <Stack.Screen
          name="App"
          component={AppTabNavigator}
          options={{}}
        />
      )}
    </Stack.Navigator>
  );
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}