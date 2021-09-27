import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Customer from './screen/customer';
import register from './screen/customer/register';

const Stack = createStackNavigator();

function AppScreen() {
  return (
    <Stack.Navigator
      initialRouteName="client"
      screenOptions={{
        headerTintColor: '#FFF',
        headerStyle: styles.headerStyle,
        cardStyle: {backgroundColor: '#F3F5F5', opacity: 1},
      }}>
      <Stack.Screen
        name="client"
        options={{
          title: 'Clientes',
        }}
        component={Customer}
      />
      <Stack.Screen
        options={({route}) => ({
          title: route.params?.id ? 'Editar cliente' : 'Cadastrar cliente',
        })}
        name="register"
        component={register}
      />
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
