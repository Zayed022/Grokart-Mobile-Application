// AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import   Login  from '../components/Login';
import Home from '../components/Home';
import Subcategory from '../components/Subcategory';
import Register from '../components/Register';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="SubCategory" component={Subcategory} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
