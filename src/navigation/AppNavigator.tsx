// AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import   Login  from '../components/Login';
import Home from '../components/Home';
import Subcategory from '../components/Subcategory';
import Register from '../components/Register';
import CartDisplay from '../components/CartDisplay';
import SubCatProduct from '../components/SubCatProduct';
import ProductDetails from '../components/ProductDetails';
import Search from '../components/Search';
import Checkout from '../components/Checkout';
import AddressDetails from '../components/AddressDetails';
import Payment from '../components/Payment';
import PaymentSuccess from '../components/PaymentSuccess';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="SubCategory" component={Subcategory} />
      <Stack.Screen name="Category" component={SubCatProduct} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={CartDisplay} />
      <Stack.Screen name="AddressDetails" component={AddressDetails} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />

    </Stack.Navigator>
  );
};

export default AppNavigator;
