import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OrderContext } from '../context/OrderContext';
import { useCart } from '../context/Cart';
import Ionicons from "react-native-vector-icons/Ionicons"; // or `react-native-vector-icons`

const MyOrders = () => {
  const { orders } = useContext(OrderContext);
  const { addMultipleToCart } = useCart();
  const navigation = useNavigation();

  const handleReorder = (items: any[]) => {
    if (!items || items.length === 0) {
      Alert.alert('Oops', 'This order has no items to reorder.');
      return;
    }
    addMultipleToCart(items);
    Alert.alert('Success', 'Items added to cart!');
    navigation.navigate('Cart');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order ID: <Text style={styles.bold}>{item._id}</Text></Text>
          <Text style={styles.date}>
            Placed on: {new Date(item.placedAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.badge}>{item.paymentMethod.toUpperCase()}</Text>
          <Text
            style={[
              styles.badge,
              item.paymentStatus === 'Success'
                ? styles.successBadge
                : styles.pendingBadge,
            ]}
          >
            {item.paymentStatus || 'Pending'}
          </Text>
        </View>
      </View>

      {/* Address */}
      <Text style={styles.address}>
        <Text style={styles.bold}>Delivery Address: </Text>
        {item.address}
      </Text>

      {/* Items */}
      <View style={styles.itemSection}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="cart-outline" size={16} /> Items Ordered:
        </Text>
        {item.items.map((product: any, index: number) => (
          <View key={index} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{product.name} × {product.quantity}</Text>
              <Text style={styles.itemDesc}>
                {product.description || 'No description'}
              </Text>
            </View>
            <Text style={styles.itemPrice}>₹{product.price * product.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalAmount}>
          Total Paid: <Text style={styles.totalValue}>₹{item.totalAmount}</Text>
        </Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => handleReorder(item.items)}
          >
            <Ionicons name="autorenew" size={16} color="#fff" />
            <Text style={styles.btnText}>Reorder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.invoiceBtn}
            onPress={() =>
              navigation.navigate("OrderInvoice", {
                orderId: item._id,
                orderDetails: item,
              })
            }
          >
            <Ionicons name="document-text-outline" size={16} color="#fff" />
            <Text style={styles.btnText}>Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          📦 You haven’t placed any orders yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.screenTitle}>📦 My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id || index.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    color: '#444',
  },
  bold: {
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    fontSize: 11,
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    color: '#444',
  },
  successBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  pendingBadge: {
    backgroundColor: '#fef9c3',
    color: '#92400e',
  },
  address: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  itemSection: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 6,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
    color: '#222',
  },
  itemDesc: {
    fontSize: 11,
    color: '#666',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MyOrders;
