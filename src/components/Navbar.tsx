import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../context/Cart";
import Grokart from "../assets/images/Grokart.png";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  const navigation = useNavigation();
  const { cart } = useCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleAccountPress = () => setDropdownVisible((prev) => !prev);
  const closeDropdown = () => setDropdownVisible(false);

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        {/* Logo */}
        <Image source={Grokart} style={styles.logo} resizeMode="contain" />

        {/* Search Input Redirect */}
        <SearchBar/>

        {/* Cart + Account container */}
        <View style={styles.rightSection}>
          {/* Cart Box */}
          

          {/* Account */}
          <TouchableOpacity
            style={styles.accountContainer}
            onPress={handleAccountPress}
          >
            <Text style={styles.accountText}>Account</Text>
            <MaterialIcon name="keyboard-arrow-down" size={20} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Transparent overlay to close dropdown */}
      {dropdownVisible && (
        <Pressable style={styles.overlay} onPress={closeDropdown} />
      )}

      {/* Dropdown menu */}
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <Text style={styles.dropdownHeader}>My Account</Text>
          <Text style={styles.dropdownSubheader}>Your Phone</Text>

          <Pressable onPress={() => { closeDropdown(); navigation.navigate("MyOrders"); }}>
            <Text style={styles.dropdownItem}>My Orders</Text>
          </Pressable>

          <Pressable onPress={() => { closeDropdown(); navigation.navigate("LocationFetcher"); }}>
            <Text style={styles.dropdownItem}>Saved Addresses</Text>
          </Pressable>

          <Pressable onPress={()=>{closeDropdown(); navigation.navigate("GiftCards");}}>
            <Text style={styles.dropdownItem}>E-Gift Cards</Text>
          </Pressable>

          <Pressable onPress={closeDropdown}>
            <Text style={styles.dropdownItem}>FAQ's</Text>
          </Pressable>

          <Pressable onPress={()=>{closeDropdown(); navigation.navigate("AccountPrivacy");}}>
            <Text style={styles.dropdownItem}>Account Privacy</Text>
          </Pressable>

          <Pressable onPress={()=>{closeDropdown(); navigation.navigate("CustomerCare");}}>
            <Text style={styles.dropdownItem}>Customer Care</Text>
          </Pressable>

          
          <Pressable onPress={() => { closeDropdown(); navigation.navigate("Login"); }}>
            <Text style={styles.logoutItem}>Log Out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  navbarContainer: {
    zIndex: 1000, // Highest level
    elevation: 100,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 18 : 12,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
  },
  logo: {
    width: 90,
    height: 28,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
  },
  searchPlaceholder: {
    color: "#888",
    marginLeft: 8,
    fontSize: 14,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartBox: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  cartDetails: {
    marginLeft: 6,
  },
  cartItems: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 16,
  },
  cartPrice: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 16,
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  accountText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 75 : 65,
    right: 10,
    backgroundColor: "#fff",
    padding: 12,
    width: 200,
    borderRadius: 8,
    elevation: 20,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownHeader: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  dropdownSubheader: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 6,
    fontSize: 14,
    color: "#333",
  },
  logoutItem: {
    paddingVertical: 6,
    fontSize: 14,
    color: "#e11d48",
    fontWeight: "600",
    marginTop: 6,
  },
});


export default Navbar;
