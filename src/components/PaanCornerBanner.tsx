import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaanCorner: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const handlePress = () => {
    navigation.navigate('Category', { subCategory: 'Pan Corner' });
  };

  return (
    <TouchableOpacity style={[styles.container, { width: width - 32 }]} activeOpacity={0.9} onPress={handlePress}>
      <Image
        source={require('../assets/images/paan.png')}
        style={styles.image}
        resizeMode="stretch" // or 'cover'
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    height: 120,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '120%',
  },
});

export default PaanCorner;
