import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/Cart";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category?: string;
  subCategory?: string;
  quantityLabel?: string;
}

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as { productId: string };
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const cartItem = cart.find((item) => item._id === productId);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://grokart-2.onrender.com/api/v1/products/${productId}`
        );
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

  const handleDecreaseQuantity = () => {
    if (quantity === 1) removeFromCart(productId);
    else updateQuantity(productId, quantity - 1);
  };

  const handleAddToCart = () => {
    if (product) addToCart({ ...product, quantity: 1 });
  };

  const renderSkeleton = () => (
    <SkeletonPlaceholder borderRadius={8}>
      <SkeletonPlaceholder.Item width="100%" height={300} />
      <SkeletonPlaceholder.Item padding={16}>
        <SkeletonPlaceholder.Item width="80%" height={24} marginBottom={10} />
        <SkeletonPlaceholder.Item width="40%" height={20} marginBottom={10} />
        <SkeletonPlaceholder.Item width="60%" height={20} marginBottom={20} />
        <SkeletonPlaceholder.Item width="100%" height={50} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );

  if (loading) return <View style={styles.container}>{renderSkeleton()}</View>;

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumbContainer}>
        <Text style={styles.breadcrumbText} onPress={() => navigation.navigate("Home")}>
          Home
        </Text>
        <Text style={styles.breadcrumbSeparator}>›</Text>
        {product.category && (
          <>
            <Text style={styles.breadcrumbText}>{product.category}</Text>
            <Text style={styles.breadcrumbSeparator}>›</Text>
          </>
        )}
        {product.subCategory && (
          <>
            <Text style={styles.breadcrumbText}>{product.subCategory}</Text>
            <Text style={styles.breadcrumbSeparator}>›</Text>
          </>
        )}
        <Text style={[styles.breadcrumbText, styles.breadcrumbCurrent]} numberOfLines={1}>
          {product.name}
        </Text>
      </View>

      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
        {product.quantityLabel && (
          <Text style={styles.quantityLabel}>{product.quantityLabel}</Text>
        )}

        <Text style={styles.description}>Net Qty: {product.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Available Offers</Text>
        <View style={styles.offerCard}>
          <Text style={styles.offerText}>💰 Up to ₹200 off on orders above ₹1499</Text>
          <Text style={styles.offerText}>🏦 Flat 12% off with Kotak Bank Credit Card</Text>
          <Text style={styles.offerText}>🎁 Get rewards using CRED Pay</Text>
        </View>

        <View style={styles.bottomAction}>
          {quantity > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={handleDecreaseQuantity}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(productId, quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  image: { width: "100%", height: 300, resizeMode: "contain", backgroundColor: "#f3f3f3" },
  details: { padding: 16 },
  name: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 4 },
  price: { fontSize: 22, fontWeight: "bold", color: "#FF4081", marginBottom: 4 },
  quantityLabel: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  description: { fontSize: 15, color: "#4B5563", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  offerCard: { backgroundColor: "#f3f4f6", padding: 12, borderRadius: 8, marginBottom: 24 },
  offerText: { fontSize: 14, color: "#374151", marginBottom: 6 },
  bottomAction: { alignItems: "center" },
  addToCartBtn: {
    backgroundColor: "#FF4081",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: "center",
  },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF4081",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityBtn: { paddingHorizontal: 12 },
  quantityBtnText: { fontSize: 20, color: "#FF4081", fontWeight: "bold" },
  quantityText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 8, color: "#1f2937" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#666" },
  breadcrumbContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 5,
  },
  breadcrumbText: {
    color: "#6B7280",
    fontSize: 13,
  },
  breadcrumbSeparator: {
    marginHorizontal: 5,
    color: "#6B7280",
    fontSize: 13,
  },
  breadcrumbCurrent: {
    color: "#111827",
    fontWeight: "600",
  },
});
export default React.memo(ProductDetails);
