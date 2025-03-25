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
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
