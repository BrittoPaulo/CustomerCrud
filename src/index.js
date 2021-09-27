import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import Routes from './routes';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <StatusBar backgroundColor="#00843d" />
      <Routes />
    </>
  );
}
