import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

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

  // ✅ Specify the type of product explicitly
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <ActivityIndicator size="large" color="#FF4081" style={styles.loader} />;
  
  return product ? (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: "#FF4081",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProductDetails;
