import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/Cart';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './src/components/Login';
import { View, ActivityIndicator} from 'react-native';
import { LocationProvider } from './src/context/LocationContext';


const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // (Optional) Add a real token validation with backend
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.warn('Error reading token:', error);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
          setIsLoading(false);
        }, 2000); // splash delay
      }
    };

    initializeApp();
  }, []);

  


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F58A07" />
      </View>
    );
  }

  return (
    <CartProvider>
      <LocationProvider>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <Login />}
      </NavigationContainer>
      </LocationProvider>
    </CartProvider>
  );
};

export default App;
