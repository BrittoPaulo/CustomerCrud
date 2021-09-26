import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import Routes from './routes';

export default function App() {
  return <Routes />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
  },
});
