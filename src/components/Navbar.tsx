import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppNavigator from '../navigation/AppNavigator';

const Navbar = () => {
  const navigation = useNavigation(); 

  const handleLoginRedirect = () => {
    // Ensure "Login" matches your screen name
    navigation.navigate("Login")
  };

  const handleCartRedirect = () =>{
    navigation.navigate("Cart")
  }

  const handleSearch =()=>{
    navigation.navigate("Search")
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.appName}>GroKart</Text>

        <TextInput onPress={handleSearch} placeholder="Search products..." style={styles.searchBar} />

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleCartRedirect}>
            <Icon name="shopping-cart" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLoginRedirect}>
            <Icon name="person" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ff6666',
    elevation: 3,
    marginTop: 8,
    borderRadius: 4,
    marginLeft: 2,
    marginRight: 2,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default Navbar;
