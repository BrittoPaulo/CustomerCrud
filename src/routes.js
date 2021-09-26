import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Customer from './screen/customer';
import Edit from './screen/customer/edit';

const Stack = createStackNavigator();

function AppScreen() {
  return (
    <Stack.Navigator
      initialRouteName="client"
      screenOptions={{
        headerTintColor: '#FFF',
        headerStyle: styles.headerStyle,
        cardStyle: {backgroundColor: '#F3F5F5'},
      }}>
      <Stack.Screen
        name="client"
        options={{
          title: 'Clientes',
        }}
        component={Customer}
      />
      <Stack.Screen name="register" component={Customer} />
      <Stack.Screen name="edit" component={Edit} />
    </Stack.Navigator>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <AppScreen />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#00843d',
  },
});
