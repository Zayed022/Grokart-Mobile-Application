import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Checkout = () => {
  const route = useRoute();
  const location = route.params?.location;

  return (
    <View>
      <Text>Checkout Screen</Text>
      {location && (
        <Text>
          Location: Latitude {location.latitude}, Longitude {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default Checkout;