import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../context/Cart';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface CheckoutParams {
  address: string;
  cartItems: any[];
  email: string;
  addressDetails: any;
}

interface OrderSummaryItemProps {
  item: any;
  index: number;
}

const OrderSummaryItem = React.memo(({ item, index }: OrderSummaryItemProps) => {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={styles.summaryText}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityLabel={`Item ${index + 1}: ${item.name}, quantity: ${item.quantity}`}
      >
        {item.name} × {item.quantity} | {item.description}
      </Text>
      <Text style={styles.summaryPrice}>₹{item.price * item.quantity}</Text>
    </View>
  );
});

const PaymentScreen = () => {
  const route = useRoute<RouteProp<Record<string, CheckoutParams>, string>>();
  const navigation = useNavigation();
  const { cart, clearCart } = useCart();
  const { address, addressDetails } = route.params || { address: 'No address provided' };

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setError('Session expired. Please login again.');
          setTimeout(() => navigation.navigate('Login'), 2000);
          return;
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user/token:', error);
        setError('Failed to load user data. Please try again.');
      }
    };

    fetchUser();
  }, [navigation]);

  const totalItemPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryCharge = 15;
  const handlingFee = 5;
  const codCharge = 0;
  const gstCharges = 2
  const totalPrice = totalItemPrice + deliveryCharge+ handlingFee + gstCharges;

  const handleCODPayment = useCallback(async () => {
    if (!user || !token) {
      setError('User not authenticated. Please login again.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://grokart-2.onrender.com/api/v1/order/create-cod-order',
        {
          customerId: user._id,
          items: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          totalAmount: Number(totalPrice),
          address,
          addressDetails,
          notes: `Please pay ₹${totalPrice} to Delivery Partner`,
          paymentMethod: 'cod',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      navigation.navigate('PaymentSuccess', { paymentDetails: response.data.order, address, addressDetails });
    } catch (error) {
      console.error('COD Payment Failed:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, token, cart, address, addressDetails, totalPrice, clearCart, navigation]);

  const renderSummaryItem = useCallback(
    ({ item, index }) => <OrderSummaryItem item={item} index={index} />,
    []
  );

  if (!user && !error) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <>
    {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Checkout & Confirm Order</Text>
        <View style={{ width: 24 }} />
      </View>
    <View style={styles.container}>
      <Text style={styles.heading}>Review & Confirm</Text>

      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <View style={styles.addressContainer}>
        <Text style={styles.label}>Deliver To</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>

      <View style={styles.etaBox}>
        <Text style={styles.etaText}>🚚 Delivery in 15–20 mins</Text>
      </View>

      <Text style={styles.label}>Order Summary</Text>
      <FlatList
        data={cart}
        renderItem={renderSummaryItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            {/* Divider */}
        <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text>Items Total</Text>
              <Text>₹{totalItemPrice.toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charge</Text>
              <Text>₹{deliveryCharge.toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Handling Fee</Text>
              <Text>₹{handlingFee.toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>GST & Charges</Text>
              <Text>₹{gstCharges.toFixed(0)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total Payable</Text>
              <Text style={styles.totalText}>₹{totalPrice.toFixed(0)}</Text>
            </View>
          </View>
        }
      />

      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPress={handleCODPayment}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
          style={[styles.paymentButton, loading && { backgroundColor: '#a3d4ff' }]}
          activeOpacity={0.8}
        >
          <Text style={styles.paymentButtonText}>
            {loading ? 'Processing...' : 'Confirm Order Using COD'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 24,
  },
  addressContainer: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 14,
  },
  etaBox: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  etaText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryContainer: { marginTop: 8 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#1F2937',
    fontSize: 16,
  },
  paymentButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(PaymentScreen);
