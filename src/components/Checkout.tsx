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
import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native";

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
        {item.name} × {item.quantity} | {item.description}
        
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
    if (!address || !location) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("AddressDetails", { address, location });
    }, 1000);
  }, [address, location, navigation]);

  const renderItem = useCallback(({ item }) => <OrderItem item={item} />, []);

  return (
  <>
    {/* Navbar */}
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.navbarTitle}>Bill Details</Text>
      <View style={{ width: 24 }} />
    </View>

    {/* Scrollable Content */}
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>🛒 Checkout Summary</Text>

      <View style={styles.card}>
        <Text style={styles.subHeader}>📍 Shipping Address</Text>
        <Text style={styles.addressText}>{address || "No address selected"}</Text>
        {(!address || !location) && (
          <Text style={styles.errorText}>Please go back and select your location.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>📦 Order Items</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.chargeBreakdownCard}>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>Item Total</Text>
          <Text style={styles.chargeValue}>₹{totalPrice}</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>Delivery Charge</Text>
          <Text style={styles.chargeValue}>₹15</Text>
        </View>
        <Text style={styles.deliveryNote}>
          100% of this fee goes directly to the delivery partner
        </Text>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>Handling Fee</Text>
          <Text style={styles.chargeValue}>₹5</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>GST & Charges</Text>
          <Text style={styles.chargeValue}>₹2</Text>
        </View>

        <View style={styles.totalPayableRow}>
          <Text style={styles.totalPayableLabel}>Total Payable</Text>
          <Text style={styles.totalPayableAmount}>₹{totalPrice + 15 + 5 + 2}</Text>
        </View>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>⚠️ Review your order to avoid cancellation.</Text>
      </View>
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          NOTE: Orders cannot be cancelled and are non-refundable once packed for delivery.
        </Text>
      </View>

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
          {loading ? "Processing..." : "Proceed to Payment"}
        </Text>
      </TouchableOpacity>
    </ScrollView>

    {loading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    )}
  </>
);

};

export default React.memo(Checkout);

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
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
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1E90FF",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  addressText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    marginTop: 5,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4d4d",
  },
  chargeBreakdownCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  chargeLabel: {
    fontSize: 16,
    color: "#333",
  },
  chargeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  deliveryNote: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    marginTop: -4,
  },
  totalPayableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  totalPayableLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  totalPayableAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  warningBox: {
    backgroundColor: "#fff9c4",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    borderColor: "#fdd835",
    borderWidth: 1,
  },
  warningText: {
    color: "#795548",
    fontSize: 14,
  },
  noteBox: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noteText: {
    fontSize: 13,
    color: "#666",
  },
  placeOrderButton: {
    backgroundColor: "#1E90FF",
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
    backgroundColor: "#a3d4ff",
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
