import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", data.user._id);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      } else {
        Alert.alert("Login Failed", "Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      Alert.alert("Login Failed", error.response?.data?.message || "Please try again.");
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
        <Text style={styles.navbarTitle}>Login</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.logo}>🛒 Grokart</Text>
            <Text style={styles.heading}>Welcome Back!</Text>
            <Text style={styles.subheading}>Login to continue shopping</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Feather name="mail" size={18} color="#888" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Feather name="lock" size={18} color="#888" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#aaa"
                style={styles.input}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={[styles.button, loading && styles.disabledButton]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Signup Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                New to GroKart?{" "}
                <Text style={styles.linkHighlight}>Create an Account</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f62fe",
    textAlign: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#111",
  },
  button: {
    backgroundColor: "#0f62fe",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    backgroundColor: "#a3c2f2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 18,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#6B7280",
  },
  linkHighlight: {
    color: "#0f62fe",
    fontWeight: "600",
  },
});

export default React.memo(Login);
