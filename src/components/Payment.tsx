import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/Cart';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        {item.name} × {item.quantity}
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

  // Animation for the payment button
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
          setTimeout(() => navigation.navigate('Login'), 2000); // Redirect after showing error
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
  const codCharge = 0; // COD charges set to null (0)
  const totalPrice = totalItemPrice + deliveryCharge + handlingFee + codCharge;

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
          notes: `Please pay ₹{totalAmount} to Delivery Partner `,
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
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      {error ? (
        <Text
          style={styles.errorText}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}

      <View style={styles.addressContainer}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text
          style={styles.addressText}
          accessibilityLabel={`Delivery address: ${address}`}
        >
          {address}
        </Text>
      </View>

      <View>
        <Text style={styles.label}>Order Summary</Text>
        <FlatList
          data={cart}
          renderItem={renderSummaryItem}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text>Items Total</Text>
                <Text>₹{totalItemPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Delivery Charges</Text>
                <Text>₹{deliveryCharge.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Handling Fee</Text>
                <Text>₹{handlingFee.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={{ fontWeight: 'bold' }}>Total Payable</Text>
                <Text style={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          }
        />
      </View>

      

      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPress={handleCODPayment}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
          style={[styles.paymentButton, loading && { backgroundColor: '#a3d4ff' }]}
          activeOpacity={0.8}
          accessibilityLabel="Pay now with Cash on Delivery"
          accessibilityHint="Completes your order using Cash on Delivery"
        >
          <Text style={styles.paymentButtonText}>
            {loading ? 'Processing...' : 'Pay Now with COD'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: 24 },
  addressContainer: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 8, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  addressText: { fontSize: 14, color: '#6b7280' },
  summaryContainer: { marginTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  summaryText: { flex: 1 },
  summaryPrice: { textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#d1d5db', fontWeight: 'bold' },
  paymentButton: { width: '100%', paddingVertical: 14, backgroundColor: '#1E90FF', borderRadius: 8, marginTop: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  paymentButtonText: { color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#ff4d4d', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  reassuranceText: { fontSize: 14, color: '#1f2937', textAlign: 'center', marginTop: 16, marginBottom: 8 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', justifyContent: 'center', alignItems: 'center' },
});

export default React.memo(PaymentScreen);