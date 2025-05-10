import React, { useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../context/Cart";
import { useNavigation, useRoute } from "@react-navigation/native";

interface OrderItemProps {
  item: any;
}

const OrderItem = React.memo(({ item }: OrderItemProps) => {
  return (
    <View style={styles.orderItem}>
      <Text
        style={styles.itemName}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityLabel={`Item name: ${item.name}, quantity: ${item.quantity}`}
      >
        {item.name} x{item.quantity}
      </Text>
      
      
      
      <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
      
    </View>
  );
});

const Checkout = () => {
  const { cart } = useCart();
  const navigation = useNavigation();
  const route = useRoute();
  const { address, location } = route.params || {};

  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const handlePlaceOrder = useCallback(() => {
    if (!address || !location) {
      return; // Error is handled inline
    }

    setLoading(true);
    // Simulate a delay for placing the order (e.g., API call)
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("AddressDetails", { address, location });
    }, 1000);
  }, [address, location, navigation]);

  const renderItem = useCallback(
    ({ item }) => <OrderItem item={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Checkout</Text>

      {/* Address Card */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>📍 Delivery Address</Text>
        <Text
          style={styles.addressText}
          accessibilityLabel={`Delivery address: ${address || "No address selected"}`}
        >
          {address || "No address selected"}
        </Text>
        {!address || !location ? (
          <Text
            style={styles.errorText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            Please go back and select your location.
          </Text>
        ) : null}
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>📦 Order Summary</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        onPress={handlePlaceOrder}
        style={[
          styles.placeOrderButton,
          (!address || !location || loading) && styles.disabledButton,
        ]}
        disabled={!address || !location || loading}
        activeOpacity={0.8}
        accessibilityLabel="Place order"
        accessibilityHint="Proceeds to the next step of the order process"
      >
        <Text style={styles.placeOrderText}>
          {loading ? "Processing..." : "Place Order"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}
    </View>
  );
};

export default React.memo(Checkout);

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
    color: "#222", // Match CartDisplay
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16, // Match CartDisplay
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1E90FF", // Match CartDisplay
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "700", // Bolder for emphasis
    marginBottom: 10,
    color: "#222", // Match CartDisplay
  },
  addressText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  errorText: {
    color: "#ff4d4d", // Match CartDisplay
    fontSize: 14,
    marginTop: 5,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9", // Light background for items
    paddingHorizontal: 10,
    borderRadius: 8, // Rounded corners
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600", // Match CartDisplay
    color: "#222", // Match CartDisplay
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4d4d", // Match app theme
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1E90FF", // Match CartDisplay
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222", // Match CartDisplay
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff4d4d", // Match app theme
  },
  placeOrderButton: {
    backgroundColor: "#1E90FF", // Match app theme
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#a3d4ff", // Lighter shade when disabled
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});