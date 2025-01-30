import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddTimerScreen from '../Screen/AddTimerScreen';
import TimerListScreen from '../Screen/TimerListScreen';
import HistoryScreen from '../Screen/HistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="TimerList" component={TimerListScreen} options={{ title: 'Timers' }} />
        <Stack.Screen name="AddTimer" component={AddTimerScreen} options={{ title: 'Add Timer' }} />
        <Stack.Screen name="LogHistory" component={HistoryScreen} options={{ title: 'Log History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
