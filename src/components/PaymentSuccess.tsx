import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const { paymentDetails, address, addressDetails } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Payment Successful!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>{paymentDetails.paymentMethod}</Text>

        <Text style={styles.label}>Base Amount:</Text>
        <Text style={styles.value}>₹{paymentDetails.totalAmount}</Text>

        <Text style={styles.label}>COD Charge:</Text>
        <Text style={styles.value}>₹{paymentDetails.codCharge}</Text>

        <Text style={styles.label}>Total Paid:</Text>
        <Text style={styles.total}>₹{paymentDetails.totalAmount}</Text>

        <Text style={styles.label}>Delivery Address:</Text>
        <Text style={styles.value}>{address}</Text>

        <Text style={styles.label}>Address Details:</Text>
        <Text style={styles.value}>{JSON.stringify(addressDetails, null, 2)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
