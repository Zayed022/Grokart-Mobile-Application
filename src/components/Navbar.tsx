import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../context/Cart"; 
import Grokart from "../assets/images/Grokart.png"
import Feather from "react-native-vector-icons/Feather"; // for minimal, clean icons
import Ionicons from "react-native-vector-icons/Ionicons"; // if you want iOS/Android-style icons


const Navbar = () => {
  const navigation = useNavigation();
  const { cart } = useCart(); 
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.navbar}>
      {/* Logo or App Name */}
      <Image source={Grokart} style={{ width: 100, height: 30 }} />

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBarContainer} onPress={() => navigation.navigate("Search")}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <Text style={styles.searchText}>Search products...</Text>
      </TouchableOpacity>

      {/* Icons (Cart & Profile) */}
      <View style={styles.iconContainer}>
  <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Cart")}>
    <Feather name="shopping-bag" size={22} color="#333" />
    {cartCount > 0 && (
      <View style={styles.cartBadge}>
        <Text style={styles.cartBadgeText}>{cartCount}</Text>
      </View>
    )}
  </TouchableOpacity>

  <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Login")}>
    <Feather name="user" size={22} color="#333" />
  </TouchableOpacity>
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchText: {
    fontSize: 14,
    color: "#888",
  },
  iconContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 14,
},

iconButton: {
  position: "relative",
  backgroundColor: "#f9f9f9",
  padding: 8,
  borderRadius: 12,
  elevation: 1,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
cartBadge: {
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "#ff4d4d",
  width: 18,
  height: 18,
  borderRadius: 9,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#fff",
},
  cartContainer: {
    position: "relative",
  },
  
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Navbar;
