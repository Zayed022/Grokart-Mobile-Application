import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useLocation } from '../context/LocationContext';

const getDeliveryTime = (address: string): number => {
  if (address.toLowerCase().includes('bhiwandi')) return 14;
  if (address.toLowerCase().includes('thane')) return 20;
  return 30; // default ETA
};

const LocationSelector: React.FC = () => {
  const { location } = useLocation();
  const navigation = useNavigation();

  const address = location?.address || '';
  const eta = getDeliveryTime(address);

  const handlePress = () => {
    navigation.navigate('LocationFetcher');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{eta}{"\n"}MINS</Text>
      </View>

      <View style={styles.locationInfo}>
        <Text style={styles.label}>Delivery to Home</Text>
        <Text style={styles.address} numberOfLines={1}>
          {address || 'Select delivery location'}
        </Text>
      </View>

      <MaterialIcon name="keyboard-arrow-down" size={22} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 4,
  },
  timeBadge: {
    backgroundColor: '#FF5A1F',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  address: {
    fontSize: 12,
    color: '#555',
  },
});

export default LocationSelector;
