import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Your Order Has Been Placed!</Text>
      <Text style={styles.subtitle}>Thank you for shopping with us ❤️</Text>
      <Text style={styles.subtitle}>Your order will arrive in few minutes!</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{paymentDetails.paymentMethod.toUpperCase()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Base Amount:</Text>
          <Text style={styles.value}>₹{paymentDetails.totalAmount}</Text>
        </View>

        

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Note: </Text>
          <Text style={styles.total}>Please Pay ₹{paymentDetails.totalAmount} to Delivery Partner</Text>
        </View>
        

        <View style={styles.section}>
          <Text style={styles.label}>Delivery Address:</Text>
          <Text style={styles.address}>{address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address Details:</Text>
          <View style={styles.jsonBox}>
            <Text style={styles.jsonText}>
              {JSON.stringify(addressDetails, null, 2)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>🛍️ Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentSuccess;


const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  address: {
    fontSize: 15,
    color: '#444',
    marginTop: 6,
  },
  jsonBox: {
    backgroundColor: '#f0f4f7',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  jsonText: {
    fontSize: 13,
    color: '#333',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#007bff',
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

