// Payment.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useCart } from '../context/Cart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

interface CheckoutParams {
  address: string;
  cartItems: any[];
  email: string;
}

const PaymentScreen = () => {
  const { cart } = useCart();
  const route = useRoute();
  const navigation = useNavigation();

  const { address, cartItems, email } = route.params as CheckoutParams;
  const [userId, setUserId] = useState<string | null>(null);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) setUserId(id);
        else Alert.alert('Error', 'User ID not found');
      } catch (error) {
        console.error('Error fetching userId:', error);
        Alert.alert('Error', 'Unable to fetch user ID');
      }
    };

    fetchUserId();
  }, []);

  const handleCOD = async () => {
    if (!userId) return;

    try {
      const res = await axios.post('https://grokart-2.onrender.com/api/v1/order/create-order', {
        
        amount: totalPrice,
        currency:"INR",
      });

      if (res.data.success) {
        Alert.alert('Success', 'Order placed successfully with Cash on Delivery');
       // navigation.navigate('OrderSummary', { order: res.data.order });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to place COD order');
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Step 1: Create order from backend
      const orderResponse = await axios.post('https://grokart-2.onrender.com/api/v1/order/create-order', {
        amount: totalPrice, // assuming backend handles *100 to paise
        currency: 'INR',
      });
  
      const { id: order_id, amount, currency } = orderResponse.data;
  
      // Step 2: Razorpay Options
      const options = {
        description: 'A payment to GroKart: 15 minutes Delivery App',
        image: 'https://your-domain.com/logo.png',
        currency,
        key: 'rzp_test_0dlBqxH635NvB4', // replace with live key in production
        amount,
        name: 'Grokart',
        order_id,
        prefill: {
          email: 'zayedans022@gmail.com',
          contact: '7498881947',
          name: 'Zayed Ansari',
        },
        theme: { color: '#3399cc' },
      };
  
      // Step 3: Open Razorpay Checkout
      RazorpayCheckout.open(options)
        .then((data) => {
          // No verification step
          Alert.alert('✅ Payment Successful', `Payment ID: ${data.razorpay_payment_id}`);
          // Navigate to confirmation screen or update UI
          //navigation.navigate('OrderSummary', {
            //orderId: order_id,
          //});
        })
        .catch((error) => {
          console.log('Payment failed:', error);
          Alert.alert('❌ Payment Failed', 'Your payment could not be completed.');
        });
    } catch (err) {
      console.error('Error initiating payment:', err);
      Alert.alert('Error', 'Unable to initiate payment. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Options</Text>
      <Text style={styles.label}>Total Amount: ₹{totalPrice}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Pay with UPI (Razorpay)" onPress={handleOnlinePayment} color="#4CAF50" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cash on Delivery (COD)" onPress={handleCOD} color="#FF9800" />
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  buttonContainer: {
    marginVertical: 10
  }
});
