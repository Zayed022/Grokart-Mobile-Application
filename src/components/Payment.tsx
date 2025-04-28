import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/Cart';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CheckoutParams {
  address: string;
  cartItems: any[];
  email: string;
  addressDetails: any
}

const PaymentScreen = () => {
  const route = useRoute<RouteProp<Record<string, CheckoutParams>, string>>();
  const navigation = useNavigation();
  const { cart, clearCart } = useCart();
  const { address, addressDetails } = route.params || { address: 'No address provided' };

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // No user found
          Alert.alert('Session expired', 'Please login again.');
          navigation.navigate('Login'); // 👈 Redirect to Login screen
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user/token:', error);
      }
    };
  
    fetchUser();
  }, []);
  
  

  const totalItemPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = 15;
  const handlingFee = 9;
  const codCharge = paymentMethod === 'cod' ? 20 : 0;
  const totalPrice = totalItemPrice + deliveryCharge + handlingFee + codCharge;

  const handleUPIPayment = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'User not authenticated. Please login again.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://grokart-2.onrender.com/api/v1/order/create-order',
        {
          customerId: user._id,
          items: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          totalAmount: totalPrice,
          address,
          addressDetails,
          notes: { deliveryInstruction: 'Call before arriving' },
          codCharge: 0,
          paymentMethod: 'razorpay',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { razorpayOrder, order } = response.data;

      const options = {
        description: '15-minute delivery payment',
        image: 'https://your_logo_url.com/logo.png',
        currency: razorpayOrder.currency,
        key: 'rzp_test_0dlBqxH635NvB4',
        amount: razorpayOrder.amount,
        order_id: razorpayOrder.id,
        name: 'Grokart',
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#6366f1' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          await axios.post(
            'https://grokart-2.onrender.com/api/v1/order/verify',
            {
              razorpay_order_id: paymentData.razorpay_order_id,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_signature: paymentData.razorpay_signature,
              orderId: order._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          clearCart();
          //navigation.navigate('PaymentSuccessOnline', { order, address, addressDetails });
        })
        .catch((error) => {
          console.log('Payment Failed:', error);
          Alert.alert('Payment Failed', 'Please try again.');
        });
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
    setLoading(true);
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
          totalAmount: totalPrice,
          address,
          addressDetails,
          notes: {},
          paymentMethod: 'cod',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      //navigation.navigate('PaymentSuccess', { paymentDetails: response.data, address, addressDetails });
    } catch (error) {
      console.log('COD Payment Failed:', error);
      Alert.alert('COD Payment Failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'upi') handleUPIPayment();
    else handleCODPayment();
  };

  if (!user) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <View style={styles.addressContainer}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>

      <View style={styles.paymentMethodContainer}>
        <Text style={styles.label}>Select Payment Method</Text>
        <View style={styles.paymentOptionsRow}>
          <TouchableOpacity onPress={() => setPaymentMethod('upi')} style={styles.paymentOption}>
            <View style={[styles.radioButton, paymentMethod === 'upi' && styles.radioButtonSelected]} />
            <Text>Pay Online (UPI/Card)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPaymentMethod('cod')} style={styles.paymentOption}>
            <View style={[styles.radioButton, paymentMethod === 'cod' && styles.radioButtonSelected]} />
            <Text>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.label}>Order Summary</Text>
        <View style={styles.summaryContainer}>
          {cart.map((item, index) => (
            <View key={index} style={styles.summaryRow}>
              <Text>{item.name} × {item.quantity}</Text>
              <Text>₹{item.price * item.quantity}</Text>
            </View>
          ))}

          <View style={styles.summaryRow}><Text>Items Total</Text><Text>₹{totalItemPrice}</Text></View>
          <View style={styles.summaryRow}><Text>Delivery Charges</Text><Text>₹{deliveryCharge}</Text></View>
          <View style={styles.summaryRow}><Text>Handling Fee</Text><Text>₹{handlingFee}</Text></View>
          {paymentMethod === 'cod' && (
            <View style={styles.summaryRow}><Text style={{ color: 'red' }}>COD Charges</Text><Text style={{ color: 'red' }}>₹{codCharge}</Text></View>
          )}

          <View style={styles.totalRow}><Text>Total Payable</Text><Text>₹{totalPrice}</Text></View>
        </View>
      </View>

      <TouchableOpacity onPress={handlePayment} disabled={loading} style={[styles.paymentButton, loading && { backgroundColor: '#a1a1aa' }]}> 
        <Text style={styles.paymentButtonText}>
          {loading ? 'Processing...' : paymentMethod === 'upi' ? 'Pay Now using UPI' : 'Pay Now with COD'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1f2937', marginBottom: 24 },
  addressContainer: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 8, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  addressText: { fontSize: 14, color: '#6b7280' },
  paymentMethodContainer: { marginBottom: 16 },
  paymentOptionsRow: { flexDirection: 'row', gap: 16 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  radioButton: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#9ca3af', marginRight: 8 },
  radioButtonSelected: { borderColor: '#4f46e5', backgroundColor: '#4f46e5' },
  summaryContainer: { marginTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#d1d5db', fontWeight: 'bold' },
  paymentButton: { width: '100%', paddingVertical: 14, backgroundColor: '#4f46e5', borderRadius: 8, marginTop: 24 },
  paymentButtonText: { color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PaymentScreen;
