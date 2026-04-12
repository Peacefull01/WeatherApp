import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {WeatherProvider} from './src/context/WeatherContext';
import RootNavigator from './src/navigation/AppNavigator';

// Provider + navigation.
export default function App() {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </WeatherProvider>
  );
}