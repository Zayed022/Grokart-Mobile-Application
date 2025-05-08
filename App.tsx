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

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/Cart';
import 'react-native-gesture-handler';


import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
      setTimeout(() => {
          SplashScreen.hide();
      }, 2000); // Adjust delay as needed
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
