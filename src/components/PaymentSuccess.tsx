import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PaymentSuccessRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: PaymentSuccessRouteProp;
}

const PaymentSuccess: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { paymentDetails, address, addressDetails,location } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.subtitle}>Thank you for shopping with us.</Text>
      <Text style={styles.subText}>Your order is on its way 🚚</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>{paymentDetails._id || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment</Text>
          <Text style={styles.value}>{paymentDetails.paymentMethod?.toUpperCase()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>₹{paymentDetails.totalAmount }</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>ETA</Text>
          <Text style={styles.value}>15–20 mins</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.noteText}>
          Note: Please pay <Text style={styles.noteAmount}>₹{paymentDetails.totalAmount }</Text> to the delivery partner upon arrival of your order.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        {addressDetails?.landmark || addressDetails?.floor || addressDetails?.buildingName ? (
          <View style={styles.section}>
            <Text style={styles.label}>More Details</Text>
            {addressDetails?.buildingName && <Text style={styles.addressLine}>Building: {addressDetails.buildingName}</Text>}
            {addressDetails?.floor && <Text style={styles.addressLine}>Floor: {addressDetails.floor}</Text>}
            {addressDetails?.landmark && <Text style={styles.addressLine}>Landmark: {addressDetails.landmark}</Text>}
             {addressDetails?.recipientPhoneNumber && <Text style={styles.addressLine}>Phone : {addressDetails.recipientPhoneNumber}</Text>}
          </View>
        ) : null}
      </View>
      <TouchableOpacity
  style={[styles.button, { backgroundColor: '#111827', marginBottom: 14 }]}
  onPress={() =>
    navigation.navigate('OrderInvoice', {
      orderDetails: paymentDetails,
      address,
      addressDetails,
      location
    })
  }
>
  <Text style={styles.buttonText}>🧾 View Invoice</Text>
</TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>🛒 Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafc',
    flexGrow: 1,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 6,
  },
  subText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  section: {
    marginTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  noteText: {
    marginTop: 14,
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  noteAmount: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  addressText: {
    fontSize: 15,
    color: '#374151',
    marginTop: 6,
    lineHeight: 22,
  },
  addressLine: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
