import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    PasswordRecovery: undefined;
};

export type AppTabParamList = {
    Home: { scannedData?: string };
    Browse: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    Main: NavigatorScreenParams<AppTabParamList>;
    ContentDisplay: { code: string };
    EditProfile: undefined;
    HelpSupport: undefined;
    PrivacyPolicy: undefined;
    About: undefined;
    HowToUse: undefined;
    CategoryPhrases: { category: import('../constants/categories').CategoryId };
    Flashcard: {
    screen: 'Categories' | 'Practice';
    categoryName?: string;
  };
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<AppTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
>; 