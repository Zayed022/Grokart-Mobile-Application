import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
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
  const { paymentDetails, address, addressDetails, location } = route.params;

  const handleCallSupport = () => {
    Linking.openURL(`tel:7498881947`);
  };

  const handleEmailSupport = () => {
    Linking.openURL(`mailto:zayedans022@gmail.com`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>✅</Text>
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.subtitle}>Thank you for shopping with us.</Text>
      <Text style={styles.subText}>Your order is on its way 🚚</Text>

      <View style={styles.card}>
        <InfoRow label="Order ID" value={paymentDetails._id || 'N/A'} />
        <InfoRow label="Payment Method" value={paymentDetails.paymentMethod?.toUpperCase()} />
        <InfoRow label="Total Amount" value={`₹${paymentDetails.totalAmount}`} highlight />
        <InfoRow label="ETA" value="15–20 mins" badge />

        <View style={styles.divider} />

        <Text style={styles.note}>
          <Text style={styles.noteLabel}>Note: </Text>
          Please pay{' '}
          <Text style={styles.highlightedAmount}>₹{paymentDetails.totalAmount}</Text>{' '}
          to the delivery partner upon arrival.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.sectionText}>{address}</Text>
        </View>

        {(addressDetails?.buildingName ||
          addressDetails?.floor ||
          addressDetails?.landmark ||
          addressDetails?.recipientPhoneNumber) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Details</Text>
            {addressDetails.buildingName && (
              <Text style={styles.detailLine}>🏢 Building: {addressDetails.buildingName}</Text>
            )}
            {addressDetails.floor && (
              <Text style={styles.detailLine}>🏬 Floor: {addressDetails.floor}</Text>
            )}
            {addressDetails.landmark && (
              <Text style={styles.detailLine}>📍 Landmark: {addressDetails.landmark}</Text>
            )}
            {addressDetails.recipientPhoneNumber && (
              <Text style={styles.detailLine}>📞 Phone: {addressDetails.recipientPhoneNumber}</Text>
            )}
          </View>
        )}
      </View>

      {/* 🎟 Invoice */}
      <TouchableOpacity
        style={[styles.button, styles.invoiceBtn]}
        onPress={() =>
          navigation.navigate('OrderInvoice', {
            orderDetails: paymentDetails,
            address,
            addressDetails,
            location,
          })
        }
      >
        <Text style={styles.buttonText}>🧾 View Invoice</Text>
      </TouchableOpacity>

      {/* 📞 Call Support */}
      <TouchableOpacity style={[styles.button, styles.callBtn]} onPress={handleCallSupport}>
        <Text style={styles.buttonText}>📞 Call Support</Text>
      </TouchableOpacity>

      {/* 📧 Email Support */}
      <TouchableOpacity style={[styles.button, styles.emailBtn]} onPress={handleEmailSupport}>
        <Text style={styles.buttonText}>📧 Email Us</Text>
      </TouchableOpacity>

      {/* 🛍 Continue Shopping */}
      <TouchableOpacity
        style={[styles.button, styles.continueBtn]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>🛒 Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentSuccess;

const InfoRow = ({
  label,
  value,
  highlight,
  badge,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  badge?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {badge ? (
      <View style={styles.etaBadge}>
        <Text style={styles.etaText}>{value}</Text>
      </View>
    ) : (
      <Text style={[styles.value, highlight && styles.highlightValue]}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f9fafc',
  },
  emoji: {
    fontSize: 52,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4b5563',
  },
  subText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  value: {
    fontSize: 15,
    color: '#111827',
  },
  highlightValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1D4ED8',
  },
  etaBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  etaText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },
  note: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  noteLabel: {
    fontWeight: '700',
    color: '#4B5563',
  },
  highlightedAmount: {
    fontWeight: '700',
    color: '#1D4ED8',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  detailLine: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  invoiceBtn: {
    backgroundColor: '#41d99f', // Slate
  },
  callBtn: {
    backgroundColor: '#788ef0', // Green (like WhatsApp)
  },
  emailBtn: {
    backgroundColor: '#de526e', // Red (Gmail)
  },
  continueBtn: {
    backgroundColor: '#7d58ed', // Violet (Zepto-style)
    marginBottom: 30,
  },
});
