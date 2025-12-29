// src/navigation/FlashcardStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoriesScreen from '../screens/Flashcard/CategoriesScreen';
import FlashcardScreen from '../screens/Flashcard/FlashcardScreen';

const Stack = createNativeStackNavigator();

export const FlashcardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="Practice"
        component={FlashcardScreen}
        options={{
          title: 'Practice',
        }}
      />
    </Stack.Navigator>
  );
};

export default FlashcardStack;