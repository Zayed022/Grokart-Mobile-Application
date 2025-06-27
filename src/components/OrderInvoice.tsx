import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
  Platform, Modal, Pressable, Linking
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import Icon from "react-native-vector-icons/Ionicons";

type InvoiceRouteProp = RouteProp<RootStackParamList, 'OrderInvoice'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  route: InvoiceRouteProp;
}

const OrderInvoice: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { orderDetails, address, addressDetails } = route.params;

  const [supportVisible, setSupportVisible] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const generatePDF = async () => {
    const DELIVERY_FEE = 15;
    const HANDLING_FEE = 5;
    const GSTCHARGES = 2;

    const html = `
      <h1>Grokart Invoice</h1>
      <p><strong>Order ID:</strong> ${orderDetails._id}</p>
      <p><strong>Date:</strong> ${formatDate(orderDetails.createdAt)}</p>
      <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod.toUpperCase()}</p>
      <hr/>
      <h2>Items Ordered</h2>
      ${orderDetails.items.map((item: any) =>
        `<p>${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}</p>`
      ).join('')}
      <hr/>
      <p><strong>Delivery Fee:</strong> ₹${DELIVERY_FEE}</p>
      <p><strong>Product Handling Fee:</strong> ₹${HANDLING_FEE}</p>
      <p><strong>GST & Charges:</strong> ₹${GSTCHARGES}</p>
      <h3>Total: ₹${orderDetails.totalAmount}</h3>
      <hr/>
      <h3>Delivery Address:</h3>
      <p>${address}</p>
      ${addressDetails?.buildingName ? `<p> Building: ${addressDetails.buildingName}</p>` : ''}
      ${addressDetails?.floor ? `<p> Floor: ${addressDetails.floor}</p>` : ''}
      ${addressDetails?.landmark ? `<p> Landmark: ${addressDetails.landmark}</p>` : ''}
      ${addressDetails?.recipientPhoneNumber ? `<p> Phone: ${addressDetails.recipientPhoneNumber}</p>` : ''}
    `;

    try {
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: `Invoice_${orderDetails._id}`,
        base64: false,
      });

      await Share.open({
        url: Platform.OS === 'ios'
          ? file.filePath!.replace('file://', '')
          : `file://${file.filePath}`,
        title: 'Share Invoice',
        type: 'application/pdf',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate or share PDF.');
    }
  };

  const handleSupport = () => {
    setSupportVisible(true);
  };

  const closeSupport = () => {
    setSupportVisible(false);
  };

  const callSupport = () => {
    Linking.openURL('tel:+917498881947');
    closeSupport();
  };

  const emailSupport = () => {
    Linking.openURL('mailto:grokart.co@gmail.com');
    closeSupport();
  };

  return (
    <>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Order Invoice</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.companyName}>Grokart</Text>
        <Text style={styles.invoiceTitle}>Your Order Invoice</Text>

        <View style={styles.section}>
          <Text style={styles.row}><Text style={styles.label}>Order ID:</Text> {orderDetails._id}</Text>
          <Text style={styles.row}><Text style={styles.label}>Order Date:</Text> {formatDate(orderDetails.createdAt)}</Text>
          <Text style={styles.row}><Text style={styles.label}>Payment Method:</Text> {orderDetails.paymentMethod.toUpperCase()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered:</Text>
          {orderDetails.items.map((item: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>Qty: {item.quantity} x ₹{item.price}</Text>
              <Text style={styles.itemTotal}>Item Total: ₹{item.quantity * item.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Delivery Fee:</Text>
            <Text style={styles.value}>₹15</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>Handling Fee</Text>
            <Text style={styles.value}>₹5</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.label}>GST & Charges</Text>
            <Text style={styles.value}>₹2</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{orderDetails.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address:</Text>
          <Text style={styles.address}>{address}</Text>
          {addressDetails?.buildingName && <Text style={styles.addressLine}>Building: {addressDetails.buildingName}</Text>}
          {addressDetails?.floor && <Text style={styles.addressLine}>Floor: {addressDetails.floor}</Text>}
          {addressDetails?.landmark && <Text style={styles.addressLine}>Landmark: {addressDetails.landmark}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#10b981', marginTop: 12 }]} onPress={generatePDF}>
          <Text style={styles.buttonText}>📄 Download/Share PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#f59e0b', marginTop: 12 }]} onPress={handleSupport}>
          <Text style={styles.buttonText}>🛠 Help & Support</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modern Support Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={supportVisible}
        onRequestClose={closeSupport}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Need Help?</Text>
            <Text style={styles.modalText}>For any payment or delivery issues, contact us:</Text>

            <TouchableOpacity style={styles.modalButton} onPress={callSupport}>
              <Text style={styles.modalButtonText}>📞 Call Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#2563eb' }]} onPress={emailSupport}>
              <Text style={styles.modalButtonText}>📧 Email Support</Text>
            </TouchableOpacity>

            <Pressable onPress={closeSupport}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OrderInvoice;


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
  container: {
    padding: 20,
    backgroundColor: '#f7f9fc',
    flexGrow: 1,
  },
  companyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 4,
  },
  invoiceTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    color: '#374151',
  },
  row: {
    fontSize: 15,
    marginBottom: 4,
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  itemRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  itemDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  itemTotal: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    color: '#1f2937',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  address: {
    fontSize: 14,
    color: '#374151',
  },
  addressLine: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#1f2937',
},
modalText: {
  fontSize: 15,
  textAlign: 'center',
  marginBottom: 20,
  color: '#374151',
},
modalButton: {
  backgroundColor: '#10b981',
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 8,
  marginBottom: 10,
  width: '100%',
  alignItems: 'center',
},
modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
modalCancel: {
  marginTop: 12,
  color: '#6b7280',
  fontSize: 14,
},

});
