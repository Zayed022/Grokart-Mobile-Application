import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const CartDisplay = () => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Oranges', price: 60, quantity: 5 },
    { id: '2', name: 'Lady Finger', price: 60, quantity: 1 },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₹{item.price} per unit</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ₹{totalPrice}</Text>
      <TouchableOpacity style={styles.proceedButton}>
        <Text style={styles.proceedText}>Add Address to Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  cartItem: { padding: 10, backgroundColor: '#f8f8f8', marginVertical: 5, borderRadius: 8 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, color: '#666' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  button: { backgroundColor: '#ddd', padding: 8, borderRadius: 5, marginHorizontal: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { fontSize: 18, fontWeight: 'bold' },
  total: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  proceedButton: { backgroundColor: 'red', padding: 15, borderRadius: 8, alignItems: 'center' },
  proceedText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CartDisplay;
