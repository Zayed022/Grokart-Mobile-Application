import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { useCart } from "../context/Cart";
import { useNavigation, useRoute } from "@react-navigation/native";

const Checkout = () => {
  const { cart } = useCart();
  const navigation = useNavigation();
  const route = useRoute();

  const { address, location } = route.params || {};
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!address || !location) {
      Alert.alert("Error", "Address is missing. Please go back and select your location.");
      return;
    }

    Alert.alert(
      "🎉 Order Placed!",
      `Your order has been placed successfully.\n\n📍 Delivery Address:\n${address}`,
      [{ text: "OK", onPress: () => {
        
        navigation.navigate("AddressDetails",{address,location});
      }}]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Checkout</Text>

      {/* Address Card */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>📍 Delivery Address</Text>
        <Text style={styles.addressText}>{address || "No address selected"}</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>📦 Order Summary</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          )}
        />
      </View>

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
  },
  addressText: {
    fontSize: 16,
    color: "#555",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff5733",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5733",
  },
  placeOrderButton: {
    backgroundColor: "#ff5733",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});