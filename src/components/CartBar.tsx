import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { useCart } from '../context/Cart';

const CartBar = () => {
  const navigation = useNavigation();
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount === 0) return null;

  return (
    <View style={styles.cartBarContainer}>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Feather name="shopping-cart" size={20} color="#fff" />
        <Text style={styles.cartText}>Your Cart</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 999,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    elevation: 4,
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#28a745',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartBar;
