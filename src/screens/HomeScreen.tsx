// HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

const HomeScreen = () => {
  return (
    <>

<Navbar />
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to Home Page</Text>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
