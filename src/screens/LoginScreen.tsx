/*
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../context/slices/authSlice.ts';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://grokart-2.onrender.com/api/v1/login', { email, password });

      const { user, token } = response.data;

      // Store token locally
      await AsyncStorage.setItem('token', token);

      // Update Redux state
      dispatch(loginSuccess({ user, token }));

      // Navigate to Home screen
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});

export default LoginScreen;
*/
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
const LoginScreen = () => {
  return (
    <View>
      <Text>Login Page</Text>
    </View>
  );
};

export default LoginScreen; // Ensure proper export
