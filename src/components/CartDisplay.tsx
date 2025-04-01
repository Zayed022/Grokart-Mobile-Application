/*
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Alert } from "react-native";
import { useCart } from "../context/Cart";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import { openSettings } from "react-native-permissions"; 
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';


const CartDisplay = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigation = useNavigation();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

 
  const requestLocationPermission = async () => {
      let permissionResult;
      if (Platform.OS === 'ios') {
          permissionResult = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (permissionResult !== RESULTS.GRANTED) {
              permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          }
      } else {
          permissionResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
  
      if (permissionResult === RESULTS.GRANTED || permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
          return true;
      } else {
          console.log('Location permission denied');
          return false;
      }
  };
  
  // Example usage in your component:
  const handleGetLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert("Permission Denied", "Please allow location access in settings.", [
        { text: "Open Settings", onPress: () => openSettings() },
        { text: "OK" },
      ]);
      return;
    }
  
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setModalVisible(true);
      },
      (error) => {
        console.log("Location Error: ", error.message);
        Alert.alert(
          "Location Error",
          "Failed to fetch location. Ensure GPS is enabled and try again.",
          [{ text: "OK" }]
        );
        // Navigate to checkout even if location fails (optional)
        navigation.navigate("Checkout", { location: null as { latitude: number; longitude: number } | null });

      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
  };
  

  const handleConfirmLocation = () => {
    setModalVisible(false);
    if (location) {
      navigation.navigate("Checkout", { location });
    } else {
      Alert.alert("Location Required", "Please select a valid location before proceeding.");
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
            <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>
      <TouchableOpacity style={styles.proceedButton} onPress={handleGetLocation}>
        <Text style={styles.proceedText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      {/* Location Modal 
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
              >
                <Marker coordinate={location} title="Your Location" />
              </MapView>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                <Text style={styles.buttonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
*/



import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Alert, Platform, PermissionsAndroid } from "react-native";
import { useCart } from "../context/Cart";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "react-native-geolocation-service";
import { openSettings } from "react-native-permissions"; 
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
interface Location {
  latitude: number;
  longitude: number;
}




const CartDisplay = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  
  const [location, setLocation] = useState<Location | null>(null);
  const navigation = useNavigation();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "ios") {
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error("Permission Error: ", error);
      return false;
    }
  };

  const handleGetLocation = async () => {
    console.log('Proceed to checkout clicked');
    const granted = await requestLocationPermission();
    console.log('Permission granted:', granted);
  
    if (!granted) {
      Alert.alert("Permission Denied", "Please allow location access in settings.", [
        { text: "Open Settings", onPress: () => openSettings() },
        { text: "OK" },
        
      ]);
      return;
      
    }
  console.log("hi")
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("Location fetched:", position);
        if (position.coords) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setModalVisible(true);
        }
      },
      (error) => {
        console.log("Location Error:", error.message);
        Alert.alert(
          "Location Error",
          "Failed to fetch location. Ensure GPS is enabled and try again.",
          [{ text: "OK" }]
        );
        navigation.navigate("Checkout", { location: null });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
  }    
  
  

  const handleConfirmLocation = () => {
    setModalVisible(false);
    if (location) {
      navigation.navigate("Checkout", { location });
    } else {
      Alert.alert("Location Required", "Please select a valid location before proceeding.");
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
                <TouchableOpacity onPress={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)} style={styles.quantityButton}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item._id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>₹{totalPrice}</Text>
      </View>
      <TouchableOpacity style={styles.proceedButton} onPress={handleGetLocation}>
        <Text style={styles.proceedText}>Proceed to Checkout</Text>
      </TouchableOpacity>

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
        >
          <Marker coordinate={location} title="Your Location" />
        </MapView>
      )}
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
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
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    width: 250,
    height: 200,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },
});

export default CartDisplay;




