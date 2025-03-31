import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useCart } from "../context/Cart";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const ProductDetails = () => {
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const cartItem = cart.find((item) => item._id === productId);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://grokart-2.onrender.com/api/v1/products/${productId}`);
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      removeFromCart(id); // Remove item if quantity is 1
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#FF4081" style={styles.loader} />;

  return product ? (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {quantity > 0 ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleDecreaseQuantity(product._id, quantity)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(product._id, quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => addToCart(product)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <Text style={styles.errorText}>Product not found</Text>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 300, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  price: { fontSize: 18, color: "#FF4081", marginVertical: 5 },
  description: { fontSize: 16, color: "#555" },
  loader: { marginTop: 20 },
  errorText: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 20 },
  button: { backgroundColor: "#FF4081", paddingVertical: 10, width: "100%", borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", borderWidth: 1, borderColor: "#FF4081", borderRadius: 6, padding: 5 },
  quantityButton: { paddingHorizontal: 10 },
  quantityText: { fontSize: 18, color: "#FF4081", fontWeight: "bold" },
});

export default ProductDetails;
