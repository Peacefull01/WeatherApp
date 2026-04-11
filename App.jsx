import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { WeatherProvider } from './src/context/WeatherContext';
import RootNavigator from './src/navigation/AppNavigator'; // or your navigator

export default function App() {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </WeatherProvider>
  );
}