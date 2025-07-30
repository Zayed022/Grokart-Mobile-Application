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
  TextInput,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, LatLng } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LocationFetcher: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [manualAddress, setManualAddress] = useState('');
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

  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) return Alert.alert('Please enter a valid address.');

    const isBhiwandi = manualAddress.toLowerCase().includes('bhiwandi');
    if (!isBhiwandi) {
      return Alert.alert('Service not available in this area.');
    }

    const newAddr = { latitude: 0, longitude: 0, address: manualAddress };

    await setConfirmedLocation(newAddr);
    Alert.alert('Location Confirmed', manualAddress);

    const existing = JSON.parse((await AsyncStorage.getItem('savedAddresses')) || '[]');
    const updated = [newAddr, ...existing.filter((a: any) => a.address !== manualAddress)];
    await AsyncStorage.setItem('savedAddresses', JSON.stringify(updated));
    setSavedAddresses(updated);

    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>📍 Confirm Delivery Location</Text>
      <Text style={styles.description}>Tap below to detect your current location or enter manually.</Text>

      <TouchableOpacity style={styles.detectButton} onPress={getUserLocation}>
        <Text style={styles.detectButtonText}>Detect My Location</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
  <Text style={styles.orText}>OR</Text>
</View>


      {/* Manual Address Input */}
      <View style={styles.manualInputBox}>
        <TextInput
          placeholder="Enter your delivery address manually"
          value={manualAddress}
          onChangeText={setManualAddress}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.manualButton} onPress={handleManualAddressSubmit}>
          <Text style={styles.manualButtonText}>Use this Address</Text>
        </TouchableOpacity>
      </View>

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
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  orContainer: {
  alignItems: 'center',
  marginVertical: 16,
},
orText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#6b7280', // Tailwind's gray-500 for modern subtlety
},

  description: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
  },

  detectButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  manualInputBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#111827',
  },
  manualButton: {
    marginTop: 14,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  savedBox: {
    marginTop: 32,
  },
  savedHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  savedCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  savedText: {
    fontSize: 14,
    color: '#374151',
  },

  mapContainer: {
    marginTop: 30,
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});


export default LocationFetcher;
