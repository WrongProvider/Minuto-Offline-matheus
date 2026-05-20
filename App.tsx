import React from 'react';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { WATERCOLOR_THEME as theme } from './src/theme';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />  
      <HomeScreen />
    </>
  );
}
