import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CityDetailScreen from '../screens/CityDetailScreen';

const Stack = createNativeStackNavigator();

// Home → CityDetail. Custom headers on screens.
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CityDetail" component={CityDetailScreen} />
    </Stack.Navigator>
  );
}
