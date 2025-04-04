import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal, 
  Alert,
  Platform 
} from "react-native";
import { useCart } from "../context/Cart";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import axios from "axios";

interface Location {
  latitude: number;
  longitude: number;
}

const CartDisplay = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const navigation = useNavigation();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      let permissionStatus;
      if (Platform.OS === 'android') {
        permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
      return permissionStatus === RESULTS.GRANTED;
    } catch (error) {
      console.error("Permission check error:", error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    let permissionStatus;
    
    if (Platform.OS === 'android') {
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
  
    return permissionStatus === RESULTS.GRANTED;
  };

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
  
      // Check permissions
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoadingLocation(false);
        return;
      }
  
      // Request location
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("Location Fetched ")
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
  
          Alert.alert(
            "Error",
            errorMessage,
            [{ text: "OK", onPress: () => setModalVisible(false) }]
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      setLoadingLocation(false);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  

  const handleConfirmLocation = async () => {
    if (!location) {
      Alert.alert("Error", "No location selected");
      return;
    }
  
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      );
  
      const address = response.data.display_name;
  
      Alert.alert(
        "Confirm Your Location",
        `Your location: ${address}`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => console.log("Cancel Pressed"),
          },
          {
            text: "Continue",
            onPress: () => {
              setModalVisible(false);
              navigation.navigate("Checkout", { address, location });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error fetching address:", error);
      Alert.alert("Error", "Failed to get address. Try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      
      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.detailsContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  style={styles.quantityButton}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item._id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => removeFromCart(item._id)} 
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.proceedButton,
          loadingLocation && styles.disabledButton
        ]} 
        onPress={handleGetLocation}
        disabled={loadingLocation}
      >
        <Text style={styles.proceedText}>
          {loadingLocation ? "Getting Location..." : "Proceed to Checkout"}
        </Text>
      </TouchableOpacity>

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
              >
                <Marker 
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }} 
                  title="Your Location" 
                />
              </MapView>
            )}
            
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
  proceedButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  proceedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
});

export default CartDisplay;