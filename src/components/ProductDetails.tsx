import React, { useEffect, useState, memo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/Cart";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from "react-native-vector-icons/Ionicons";
import FastImage from "react-native-fast-image";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category?: string;
  subCategory?: string;
  quantityLabel?: string;
  stock: number;
}

const ProductDetails = () => {
  const { productId } = useRoute().params as { productId: string };
  const navigation = useNavigation();
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const cartItem = cart.find((item) => item._id === productId);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://grokart-2.onrender.com/api/v1/products/${productId}`);
        const data = await res.json();
        if (isMounted) setProduct(data.product);
      } catch (error) {
        ToastAndroid.show("Failed to load product", ToastAndroid.SHORT);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => { isMounted = false; };
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart(productId);
      ToastAndroid.show("Removed from cart", ToastAndroid.SHORT);
    } else {
      updateQuantity(productId, quantity - 1);
    }
  };

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <SkeletonPlaceholder borderRadius={8}>
          <SkeletonPlaceholder.Item margin={16}>
            <SkeletonPlaceholder.Item height={340} borderRadius={12} />
            <SkeletonPlaceholder.Item marginTop={16} height={20} width={200} />
            <SkeletonPlaceholder.Item marginTop={10} height={20} width={120} />
            <SkeletonPlaceholder.Item marginTop={20} height={48} width={240} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </ScrollView>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Image */}
      <FastImage
      source={
    product.image
      ? {
          uri: product.image.includes('http://')
            ? product.image.replace('http://', 'https://').replace(/\.avif$/, '.jpg')
            : product.image.replace(/\.avif$/, '.jpg'),
        }
      : require('../assets/images/Grokart.png')
  }
        
        style={styles.image}
        resizeMode={FastImage.resizeMode.contain}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
        {product.stock > 0 && product.stock < 5 && (
          <Text style={styles.lowStock}>Only {product.stock} left</Text>
        )}
        {product.quantityLabel && <Text style={styles.label}>{product.quantityLabel}</Text>}
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Available Offers</Text>
        <View style={styles.offers}>
          <Text style={styles.offer}>💰 Up to ₹200 off on orders above ₹1499</Text>
          <Text style={styles.offer}>🏦 Flat 12% off with Kotak Bank Credit Card</Text>
          <Text style={styles.offer}>🎁 Get rewards using CRED Pay</Text>
        </View>

        <View style={styles.action}>
          {product.stock === 0 ? (
            <View style={styles.disabledBtn}>
              <Text style={styles.disabledText}>Out of Stock</Text>
            </View>
          ) : quantity > 0 ? (
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => quantity < product.stock && updateQuantity(productId, quantity + 1)}
                style={styles.qtyBtn}
                disabled={quantity >= product.stock}
              >
                <Text style={[styles.qtyText, quantity >= product.stock && styles.disabledText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
              <Icon name="cart" color="#fff" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
    </>
  );
};

export default memo(ProductDetails);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  navbarTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  image: {
    width: "100%",
    height: 340,
    backgroundColor: "#f4f4f4",
  },
  content: { padding: 16 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#10B981",
    marginVertical: 6,
  },
  lowStock: { color: "#EF4444", fontWeight: "500", marginBottom: 6 },
  label: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  description: { fontSize: 14, color: "#4B5563", fontWeight: "500", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  offers: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  offer: { fontSize: 14, color: "#374151", marginBottom: 6 },
  action: { alignItems: "center" },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  disabledText: { color: "#9CA3AF", fontWeight: "600", fontSize: 16 },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  qtyBtn: { paddingHorizontal: 12 },
  qtyText: { fontSize: 20, fontWeight: "700", color: "#2563EB" },
  quantity: { fontSize: 16, fontWeight: "600", marginHorizontal: 12 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#9CA3AF", fontSize: 16 },
});
