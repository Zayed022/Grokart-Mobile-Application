import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type of your location data
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Define the context value type
interface LocationContextType {
  location: Location | null;
  setConfirmedLocation: (loc: Location) => Promise<void>;
}

// Create context with default undefined
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider Props
interface LocationProviderProps {
  children: ReactNode;
}

// Provider Component
export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);

  // Load location from AsyncStorage
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const stored = await AsyncStorage.getItem('confirmedLocation');
        if (stored) {
          const parsed = JSON.parse(stored);
          setLocation(parsed);
        }
      } catch (error) {
        console.error('❌ Failed to load location:', error);
      }
    };

    loadLocation();
  }, []);

  // Save location to AsyncStorage
  const setConfirmedLocation = async (loc: Location) => {
  try {
    let address = loc.address;

    // If address is not already provided, fetch it via reverse geocoding
    if (!address) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.latitude}&lon=${loc.longitude}`
      );
      const data = await response.json();
      address = data.display_name;
    }

    const updatedLoc = { ...loc, address };
    setLocation(updatedLoc);
    await AsyncStorage.setItem('confirmedLocation', JSON.stringify(updatedLoc));
  } catch (error) {
    console.error('❌ Failed to fetch/save address:', error);
  }
};



  return (
    <LocationContext.Provider value={{ location, setConfirmedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom Hook
export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
