// LocationFetcher.tsx - React Native version
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LocationFetcher: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const { setConfirmedLocation } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('savedAddresses');
      if (stored) setSavedAddresses(JSON.parse(stored));
    })();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getUserLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location access is required.');
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserLocation(coords);
        setShowMap(true);
      },
      (err) => {
        console.error(err);
        Alert.alert('Error', 'Unable to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleConfirmLocation = async () => {
  if (!userLocation) return;

  try {
    // Reverse geocoding using OpenStreetMap API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.latitude}&lon=${userLocation.longitude}`
    );
    const data = await response.json();
    const address = data?.display_name || `Lat: ${userLocation.latitude}, Lng: ${userLocation.longitude}`;

    const isBhiwandi = address.toLowerCase().includes('bhiwandi');
    if (!isBhiwandi) {
      Alert.alert('Service not available in this area.');
      setShowMap(false);
      return;
    }

    const newAddr = { ...userLocation, address };

    await setConfirmedLocation(newAddr);
    Alert.alert('Location Confirmed', address);
    setShowMap(false);

    const existing = JSON.parse((await AsyncStorage.getItem('savedAddresses')) || '[]');
    const updated = [newAddr, ...existing.filter((a: any) => a.address !== address)];
    await AsyncStorage.setItem('savedAddresses', JSON.stringify(updated));
    setSavedAddresses(updated);

    navigation.navigate('Home');
  } catch (error) {
    console.error('Confirm error:', error);
    Alert.alert('Failed to confirm location');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📍 Confirm Delivery Location</Text>
      <Text style={styles.description}>Tap below to detect your current location.</Text>

      <TouchableOpacity style={styles.detectButton} onPress={getUserLocation}>
        <Text style={styles.detectButtonText}>Detect My Location</Text>
      </TouchableOpacity>

      {savedAddresses.length > 0 && (
        <View style={styles.savedBox}>
          <Text style={styles.savedHeading}>Saved Addresses</Text>
          {savedAddresses.map((addr, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.savedCard}
              onPress={async () => {
                await setConfirmedLocation(addr);
                Alert.alert('Location Confirmed', addr.address);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.savedText}>{addr.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showMap && userLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              ...userLocation,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker coordinate={userLocation} draggable onDragEnd={(e) => setUserLocation(e.nativeEvent.coordinate)} />
          </MapView>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 16, color: '#666', marginBottom: 20 },
  detectButton: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
  detectButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  savedBox: { marginTop: 30 },
  savedHeading: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  savedCard: { padding: 14, backgroundColor: '#eee', borderRadius: 10, marginBottom: 8 },
  savedText: { fontSize: 14 },
  mapContainer: { marginTop: 30, height: 300, borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
  confirmButton: { backgroundColor: '#10B981', padding: 14, borderRadius: 10, marginTop: 10 },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default LocationFetcher;
