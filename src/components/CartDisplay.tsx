import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  
} from "react-native";
import { ScrollView } from "react-native";
import { useCart } from "../context/Cart";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import Icon from "react-native-vector-icons/Ionicons";
import { useLocation } from '../context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import axios from "axios";
import { Swipeable } from 'react-native-gesture-handler';

interface Location {
  latitude: number;
  longitude: number;
}

interface CartItemProps {
  item: any;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}


const CartItem = React.memo(
  ({ item, updateQuantity, removeFromCart }: CartItemProps) => {
    const handleDecrease = useCallback(() => {
      updateQuantity(item._id, Math.max(1, item.quantity - 1));
    }, [item._id, item.quantity, updateQuantity]);

    const handleIncrease = useCallback(() => {
      updateQuantity(item._id, item.quantity + 1);
    }, [item._id, item.quantity, updateQuantity]);

    const handleRemove = useCallback(() => {
      removeFromCart(item._id);
    }, [item._id, removeFromCart]);
    const renderRightActions = () => (
  <TouchableOpacity
    style={styles.swipeDeleteButton}
    onPress={handleRemove}
    activeOpacity={0.7}
  >
    <Text style={styles.swipeDeleteText}>Delete</Text>
  </TouchableOpacity>
);

    return (
      <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.name} - {item.description}
          </Text>
          
          <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
          <Text style={styles.subtotal}>Subtotal: ₹{item.price * item.quantity}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={handleDecrease}
              style={styles.quantityButton}
              activeOpacity={0.7}
              accessibilityLabel="Decrease quantity"
              accessibilityHint={`Decrease the quantity of ${item.name}`}
            >
              <Ionicons name="remove" size={18} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              style={styles.quantityButton}
              activeOpacity={0.7}
              accessibilityLabel="Increase quantity"
              accessibilityHint={`Increase the quantity of ${item.name}`}
            >
              <Ionicons name="add" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
          accessibilityLabel={`Remove ${item.name} from cart`}
          accessibilityHint="Removes this item from your cart"
        >
          <Ionicons name="trash-outline" size={20} color="#ff4d4d" />

        </TouchableOpacity>
      </View>
      </Swipeable>
    );
  }
);

// ... (All imports remain the same)

const CartDisplay = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const { location: confirmedLocation, setConfirmedLocation } = useLocation();
  const navigation = useNavigation();

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  

  const checkLocationPermission = useCallback(async () => {
    try {
      let permissionStatus;
      if (Platform.OS === "android") {
        permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
      return permissionStatus === RESULTS.GRANTED;
    } catch (error) {
      console.error("Permission check error:", error);
      return false;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    let permissionStatus;
    if (Platform.OS === "android") {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permissionStatus !== RESULTS.GRANTED) {
        permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }
    } else {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (permissionStatus !== RESULTS.GRANTED) {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
    }

    if (permissionStatus === RESULTS.DENIED || permissionStatus === RESULTS.BLOCKED) {
      setLocationError("Location permission is required to proceed. Please enable it in settings.");
      return false;
    }

    return permissionStatus === RESULTS.GRANTED;
  }, []);

  const handleOpenSettings = useCallback(() => {
    openSettings().catch(() => console.warn("Cannot open settings"));
  }, []);

  const handleGetLocation = useCallback(async () => {
    setLoadingLocation(true);
    setLocationError("");
    setAddressError("");

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLoadingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        console.log("Location Fetched");
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
        setModalVisible(true);
      },
      (error) => {
        console.error("Location error:", error);
        setLoadingLocation(false);
        let errorMessage = "Could not get location.";
        if (error.code === 3) errorMessage = "Location request timed out. Check your connection.";
        if (error.code === 4) errorMessage = "App context lost. Restart the app.";
        setLocationError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 0 }
    );
  }, [requestLocationPermission]);

  const handleConfirmLocation = useCallback(async () => {
    if (!location) {
      setAddressError("No location selected");
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      );

      const address = response.data.display_name || "";
      const isInBhiwandi = address.toLowerCase().includes("bhiwandi");

      if (!isInBhiwandi) {
        setModalVisible(false);
        Alert.alert("Service Unavailable", "Sorry, we are currently not available in your area.");
        return;
      }

      setModalVisible(false);
      const newAddr = { address, latitude: location.latitude, longitude: location.longitude };
      setSelectedAddress(newAddr);
      navigation.navigate("Checkout", {
  address,
  location: {
    latitude: location.latitude,
    longitude: location.longitude,
  },
});



    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressError("Failed to get address. Try again.");
    }
  }, [location, navigation]);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItem item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
    ),
    [updateQuantity, removeFromCart]
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is feeling lonely!!! Add Items to get started.</Text>
      </View>
    );
  }

  return (
  <>
    {/* Navbar */}
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.navbarTitle}>Your Cart</Text>
      <View style={{ width: 24 }} />
    </View>

    <View style = {styles.screenBackground}>
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Shopping Cart</Text>

      {/* Cart Items */}
      {cart.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      ))}

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>

      {/* Address Section */}
      <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>
        Delivery Address
      </Text>

      {/* Saved Address Block */}
      {confirmedLocation?.address && (
        <View style={styles.savedAddressContainer}>
          <Text style={styles.savedAddressTitle}>Saved Address:</Text>
          <Text style={styles.savedAddressText}>{confirmedLocation.address}</Text>
          <TouchableOpacity
            style={styles.savedButton}
            onPress={() => {
              const { address, latitude, longitude } = confirmedLocation;
              setSelectedAddress({ address, latitude, longitude });
              navigation.navigate("Checkout", {
                address,
                location: { latitude, longitude },
              });
            }}
          >
            <Text style={styles.proceedText}>Deliver to this Address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Divider */}
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          marginBottom: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Or use your current location
      </Text>

      {/* Location Error */}
      {locationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity onPress={handleOpenSettings} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Change Address Button */}
      <TouchableOpacity
        style={[styles.proceedButton, loadingLocation && styles.disabledButton]}
        onPress={handleGetLocation}
        disabled={loadingLocation}
      >
        <Text style={styles.proceedText}>
          {loadingLocation ? "Getting Location..." : "Change Address"}
        </Text>
      </TouchableOpacity>

      {/* Spinner overlay */}
      {loadingLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#222" />
        </View>
      )}

      {/* Location Confirmation Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Location</Text>
            {location && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                liteMode={Platform.OS === "android"}
              >
                <Marker coordinate={location} title="Your Location" />
              </MapView>
            )}
            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmLocation}
              >
                <Text style={styles.buttonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  </>
);

};




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
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#777",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#222",
  },
  screenBackground: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Light subtle gray background for depth
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    marginHorizontal: 10,
    shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 6, // higher for more pop on Android
  transform: [{ scale: 0.98 }],
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#f0f0f0",
  },

  detailsContainer: {
    flex: 1,
    paddingRight: 6,
  },

  itemName: {
    fontSize: 16.5,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },

  itemPrice: {
    fontSize: 14,
    color: "#6c757d",
  },

  subtotal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginTop: 6,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  quantityButton: {
    backgroundColor: "#e9ecef",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 8,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  quantity: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
    minWidth: 28,
    textAlign: "center",
    backgroundColor: "#f1f3f5",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
  },

  removeButton: {
    alignSelf: "flex-start",
    padding: 6,
    marginLeft: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,77,77,0.1)",
  },

  removeButtonText: {
    fontSize: 16,
    color: "#ff4d4d",
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  errorContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: "#1E90FF",
    padding: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  proceedButton: {
  backgroundColor: "#F64242",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 8,
  shadowColor: "#ff4d4d",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 5,
},
savedButton:{
  backgroundColor: "#319c0e",
  padding: 12,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 6,
  shadowColor: "#ff4d4d",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 5,
},
  disabledButton: {
    backgroundColor: "#888",
  },
  proceedText: {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
  letterSpacing: 0.5,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#222",
},
  map: {
  width: "100%",
  height: 220,
  borderRadius: 12,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "#ccc",
},
  modalButtons: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#1E90FF", // Match button color with app theme
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  subtotal: {
  fontSize: 16,
  color: "#111",
  marginTop: 4,
},
swipeDeleteButton: {
  backgroundColor: "#ff3b30",
  justifyContent: "center",
  alignItems: "center",
  width: 90,
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
},
swipeDeleteText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},
savedAddressContainer: {
    backgroundColor: "#e6ffed",
    borderWidth: 1,
    borderColor: "#a0d6b4",
    padding: 8,
    borderRadius: 12,
    marginBottom: 15,
  },
  savedAddressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a0a0a",
    marginBottom: 6,
  },
  savedAddressText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  scrollContainer: {
  padding: 20,
  backgroundColor: "#fff",
  paddingBottom: 40,
}


});

export default React.memo(CartDisplay);