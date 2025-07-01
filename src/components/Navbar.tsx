import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../context/Cart";
import Grokart from "../assets/images/Grokart.png";

const Navbar: React.FC = () => {
  const navigation = useNavigation();
  const { cart } = useCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <Image source={Grokart} style={styles.logo} resizeMode="contain" />

      {/* Search Redirect */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("Search")}
        activeOpacity={0.7}
      >
        <Icon name="search" size={20} color="#888" />
        <Text style={styles.searchPlaceholder}>Search for products...</Text>
      </TouchableOpacity>

      {/* Cart Icon */}
      <TouchableOpacity
        style={styles.cartContainer}
        onPress={() => navigation.navigate("Cart")}
        activeOpacity={0.7}
      >
        <Icon name="shopping-cart" size={24} color="#fff" />
        {totalQuantity > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: "space-between",
  },
  logo: {
    width: 100,
    height: 30,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
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
  cartContainer: {
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 100,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 999,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#fff",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default Navbar;
