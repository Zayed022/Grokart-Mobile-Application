import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/Cart';

const FloatingCartBar = () => {
  const navigation = useNavigation();
  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.discount || 5) * item.quantity,
    5
  );

  if (cartCount === 0) return null;

  return (
    <View style={styles.wrapper}>
      {/* Banner */}
      <View style={styles.bannerRow}>
        <Text style={styles.bannerEmoji}>🎉</Text>
        <Text style={styles.bannerText}>
          Hooray! <Text style={styles.bold}>FREE DELIVERY</Text> unlocked!
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Cart Row */}
      <View style={styles.cartRow}>
        {/* Cart Images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageContainer}
        >
          {cart.slice(0, 5).map((item, index) => (
            <Image
              key={index}
              source={{ uri: item.image }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        {/* Item count and savings */}
        <View style={styles.itemInfo}>
          <Text style={styles.itemCount}>
            {cartCount} Item{cartCount > 1 ? 's' : ''}
          </Text>
          <Text style={styles.savings}>
            You save ₹{totalSavings}
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Go to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bannerEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  bannerText: {
    fontSize: 13,
    color: '#10B981',
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 6,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  savings: {
    fontSize: 12,
    color: '#10B981',
  },
  cartButton: {
    backgroundColor: '#45751aff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default FloatingCartBar;
