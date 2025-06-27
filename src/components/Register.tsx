import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://grokart-2.onrender.com/api/v1/users/register',
        { name, email, phone, password },
        { withCredentials: true }
      );

      if (data.success) {
        Alert.alert('Success', 'Registration successful', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Custom AppBar */}
          <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.navbarTitle}>Register</Text>
            <View style={{ width: 26 }} />
          </View>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.logo}>🛒 GroKart</Text>
          <Text style={styles.heading}>Create an Account</Text>
          <Text style={styles.subheading}>Start shopping your essentials</Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.button, loading && styles.disabledButton]}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 6,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 14,
    height: 50,
    color: '#111',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#8DBFF5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkHighlight: {
    color: '#1E90FF',
    fontWeight: '600',
  },
});

export default RegisterScreen;
