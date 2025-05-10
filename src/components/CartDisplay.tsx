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
import { useCart } from "../context/Cart";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
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
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={handleIncrease}
              style={styles.quantityButton}
              activeOpacity={0.7}
              accessibilityLabel="Increase quantity"
              accessibilityHint={`Increase the quantity of ${item.name}`}
            >
              <Text style={styles.buttonText}>+</Text>
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
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      </Swipeable>
    );
  }
);

const CartDisplay = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressError, setAddressError] = useState("");
  const navigation = useNavigation();

  // Memoize totalPrice calculation
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
      setLocationError(
        "Location permission is required to proceed. Please enable it in settings."
      );
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
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

      const address = response.data.display_name;

      setModalVisible(false);
      navigation.navigate("Checkout", { address, location });
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressError("Failed to get address. Try again.");
    }
  }, [location, navigation]);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        item={item}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
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
    
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>

      {locationError ? (
        <View style={styles.errorContainer}>
          <Text
            style={styles.errorText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {locationError}
          </Text>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.retryButton}
            activeOpacity={0.7}
            accessibilityLabel="Open settings"
            accessibilityHint="Opens device settings to enable location permission"
          >
            <Text style={styles.retryButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.proceedButton, loadingLocation && styles.disabledButton]}
        onPress={handleGetLocation}
        disabled={loadingLocation}
        activeOpacity={0.8}
        accessibilityLabel="Proceed to checkout"
        accessibilityHint="Fetches your location and proceeds to checkout"
      >
        <Text style={styles.proceedText}>
          {loadingLocation ? "Getting Location..." : "Proceed to Checkout"}
        </Text>
      </TouchableOpacity>

      {loadingLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#222" />
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
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
                liteMode={Platform.OS === "android"} // Optimize for Android
                accessibilityLabel="Map showing your location"
                accessibilityHint="Displays your current location on a map"
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                  accessibilityLabel="Your location marker"
                />
              </MapView>
            )}

            {addressError ? (
              <Text
                style={styles.errorText}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
              >
                {addressError}
              </Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
                accessibilityLabel="Cancel location selection"
                accessibilityHint="Closes the location selection modal"
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmLocation}
                activeOpacity={0.7}
                accessibilityLabel="Confirm location"
                accessibilityHint="Confirms your selected location and proceeds to checkout"
              >
                <Text style={styles.buttonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#777",
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 10,
    minWidth: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "500",
    color: "#222",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  proceedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  map: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
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
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    fontWeight: "bold",
  },
  swipeDeleteButton: {
  backgroundColor: '#ff4d4d',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  height: '100%',
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
},
swipeDeleteText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

});

export default React.memo(CartDisplay);