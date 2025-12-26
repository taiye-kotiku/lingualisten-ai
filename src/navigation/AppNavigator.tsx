import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/App/HomeScreen';
import BrowseScreen from '../screens/App/BrowseScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import ContentDisplayScreen from '../screens/App/ContentDisplayScreen';
import CategoryPhrasesScreen from '../screens/App/CategoryPhrasesScreen';
import EditProfileScreen from '../screens/App/EditProfileScreen';
import HelpSupportScreen from '../screens/App/HelpSupportScreen';
import HowToUseScreen from '../screens/App/HowToUseScreen';
import PrivacyPolicyScreen from '../screens/App/PrivacyPolicyScreen';
import AboutScreen from '../screens/App/AboutScreen';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
                {() => (
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            headerShown: false,
                            tabBarActiveTintColor: theme.COLORS.primary,
                            tabBarInactiveTintColor: theme.COLORS.textSecondary,
                            tabBarStyle: {
                                backgroundColor: theme.COLORS.background,
                                borderTopColor: theme.COLORS.border,
                                height: 80,
                            },
                            tabBarLabelStyle: {
                                ...theme.FONTS.body4,
                                marginTop: 4,
                                marginBottom: 10,
                            },
                            tabBarIcon: ({ focused, color }) => {
                                let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

                                if (route.name === 'Home') {
                                    iconName = focused ? 'home' : 'home-outline';
                                } else if (route.name === 'Browse') {
                                    iconName = focused ? 'grid' : 'grid-outline';
                                } else if (route.name === 'Profile') {
                                    iconName = focused ? 'person' : 'person-outline';
                                }

                                return <Ionicons name={iconName} size={22} color={color} />;
                            },
                        })}
                    >
                        <Tab.Screen name="Home" component={HomeScreen} />
                        <Tab.Screen name="Browse" component={BrowseScreen} />
                        <Tab.Screen name="Profile" component={ProfileScreen} />
                    </Tab.Navigator>
                )}
            </Stack.Screen>
            <Stack.Screen
                name="ContentDisplay"
                component={ContentDisplayScreen}
                options={{
                    headerShown: true,
                    title: 'Phrase Details',
                    headerStyle: { backgroundColor: theme.COLORS.background },
                    headerTintColor: theme.COLORS.textPrimary,
                    headerTitleStyle: { ...theme.FONTS.h4 },
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HelpSupport"
                component={HelpSupportScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="HowToUse"
                component={HowToUseScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoryPhrases"
                component={CategoryPhrasesScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
