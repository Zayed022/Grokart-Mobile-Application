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
        userId,
        cartItems,
        totalAmount: totalPrice,
        paymentMethod: 'COD',
        address,
        email
      });

      if (res.data.success) {
        Alert.alert('Success', 'Order placed successfully with Cash on Delivery');
        navigation.navigate('OrderSummary', { order: res.data.order });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to place COD order');
    }
  };

  const handleOnlinePayment = async () => {
    if (!userId) return;

    try {
      const order = await axios.post('https://grokart-2.onrender.com/api/v1/order/create-order', {
        amount: totalPrice * 100
      });

      const options = {
        description: 'Payment for your order',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_0dlBqxH635NvB4',
        amount: order.data.amount,
        name: 'Quick Commerce App',
        order_id: order.data.id,
        prefill: {
          email: email,
          contact: '',
          name: 'User'
        },
        theme: { color: '#53a20e' }
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          await axios.post('https://grokart-2.onrender.com/api/payment/verify-payment', {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature
          });

          const placedOrder = await axios.post('https://grokart-2.onrender.com/api/v1/order/create-order', {
            userId,
            items: cartItems,
            totalAmount: totalPrice,
            paymentId: data.razorpay_payment_id,
            paymentMethod: 'UPI',
            deliveryAddress: address
          });

          Alert.alert('Success', 'Order placed successfully');
          navigation.navigate('OrderSummary', { order: placedOrder.data.order });
        })
        .catch((error: any) => {
          console.log(error);
          Alert.alert('Payment Error', 'Payment was not successful');
        });
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to process payment');
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
