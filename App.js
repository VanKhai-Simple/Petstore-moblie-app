import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigation from './src/navigation/AppNavigation';
import { AppProvider } from './src/context/AppContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </AppProvider>
  );
}