/*
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import Navbar from './src/components/Navbar';
import Login from './src/components/Login';

const App = () => {
  return (
    <NavigationContainer>
      <Navbar/>
      <Login/>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
*/
// App.tsx
// App.tsx
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/Cart';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';

const App = () => {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        setTimeout(() => {
          SplashScreen.hide();
        }, 2000);
      } catch (err) {
        console.warn('SplashScreen hide failed:', err);
      }
    };
    hideSplash();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;

