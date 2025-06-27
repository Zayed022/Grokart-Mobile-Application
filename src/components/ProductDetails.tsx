import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/Cart";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from "react-native-vector-icons/Ionicons";
import CartBar from "./CartBar";

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

const { width } = Dimensions.get("window");

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
        ToastAndroid.show("Failed to load product", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleDecreaseQuantity = () => {
    if (quantity === 1) {
      removeFromCart(productId);
      ToastAndroid.show("Removed from cart", ToastAndroid.SHORT);
    } else {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
    }
  };

  const renderSkeleton = () => (
  <View style={styles.card}>
    <SkeletonPlaceholder borderRadius={8} backgroundColor="#E5E7EB" highlightColor="#F3F4F6">
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item width="100%" height={380} />

        <SkeletonPlaceholder.Item padding={16}>
          <SkeletonPlaceholder.Item width="80%" height={24} marginBottom={10} borderRadius={6} />
          <SkeletonPlaceholder.Item width="40%" height={20} marginBottom={10} borderRadius={6} />
          <SkeletonPlaceholder.Item width="60%" height={20} marginBottom={20} borderRadius={6} />
          <SkeletonPlaceholder.Item width="100%" height={50} borderRadius={10} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </View>
);


 

  if (loading) {
  return (
    <>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumbLink}>Home</Text>
          <Text style={styles.separator}>›</Text>
          <Text style={[styles.breadcrumb, styles.breadcrumbCurrent]}>Loading...</Text>
        </View>
        {renderSkeleton()}
      </ScrollView>
    </>
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
    {/* Navbar */}
            <View style={styles.navbar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.navbarTitle}>Product Details</Text>
              <View style={{ width: 24 }} />
            </View>
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Breadcrumb */}
    <View style={styles.breadcrumbContainer}>
      <Text style={styles.breadcrumbLink} onPress={() => navigation.navigate("Home")}>Home</Text>
      <Text style={styles.separator}>›</Text>
      {product.category && <Text style={styles.breadcrumb}>{product.category}</Text>}
      {product.subCategory && <>
        <Text style={styles.separator}>›</Text>
        <Text style={styles.breadcrumb}>{product.subCategory}</Text>
      </>}
      <Text style={[styles.breadcrumb, styles.breadcrumbCurrent]} numberOfLines={1}>
        {product.name}
      </Text>
    </View>

    {/* Card */}
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
       <Text style={styles.price}>₹{product.price}</Text>
{product.stock > 0 && product.stock < 5 && (
  <Text style={styles.lowStockText}>Only {product.stock} left</Text>
)}

        {product.quantityLabel && <Text style={styles.qtyLabel}>{product.quantityLabel}</Text>}
        <Text style={styles.description}>Net Qty: {product.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Available Offers</Text>
        <View style={styles.offerBox}>
          <Text style={styles.offer}>💰 Up to ₹200 off on orders above ₹1499</Text>
          <Text style={styles.offer}>🏦 Flat 12% off with Kotak Bank Credit Card</Text>
          <Text style={styles.offer}>🎁 Get rewards using CRED Pay</Text>
        </View>

        <View style={styles.actionRow}>
  {product.stock === 0 ? (
    <View style={styles.disabledCartButton}>
      <Text style={styles.disabledCartButtonText}>Out of Stock</Text>
    </View>
  ) : quantity > 0 ? (
    <View style={styles.quantityControls}>
      <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.qtyBtn}>
        <Text style={styles.qtyText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        onPress={() =>
          quantity < product.stock
            ? updateQuantity(productId, quantity + 1)
            : null
        }
        disabled={quantity >= product.stock}
        style={styles.qtyBtn}
      >
        <Text
          style={[
            styles.qtyText,
            quantity >= product.stock && styles.disabledCartButtonText,
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
      <Text style={styles.cartButtonText}>Add to Cart</Text>
    </TouchableOpacity>
  )}
</View>

      </View>
    </View>
    
  </ScrollView>
  
  
  </>
);

};

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
  container: { backgroundColor: "#fff", flex: 1 },
  card: {
  margin: 16,
  borderRadius: 12,
  backgroundColor: "#fff",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
  overflow: "hidden",
},
image: {
  width: "100%",
  height: 380,
  resizeMode: "contain",
  backgroundColor: "#F3F4F6",
},

  details: { padding: 16 },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  price: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#10B981", // A vibrant red for strong visual appeal
  marginVertical: 6,
},

  qtyLabel: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  description: { fontSize: 14,fontWeight: "bold", color: "#4B5563", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  offerBox: { backgroundColor: "#F9FAFB", padding: 12, borderRadius: 8 },
  offer: { fontSize: 14, color: "#374151", marginBottom: 6 },
  actionRow: { alignItems: "center", marginTop: 24 },
  cartButton: {
  backgroundColor: "#EF4444",
  paddingVertical: 14,
  paddingHorizontal: 60,
  borderRadius: 14,
  elevation: 4,
  minWidth: 200,
},

  cartButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  quantityControls: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F9FAFB",
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 3,
},

  qtyBtn: { paddingHorizontal: 12 },
  qtyText: { fontSize: 20, color: "#EF4444", fontWeight: "700" },
  quantity: { fontSize: 16, fontWeight: "600", color: "#111827", marginHorizontal: 8 },
  loader: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
},
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "#9CA3AF" },
  breadcrumbContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
  },
  breadcrumbLink: { color: "#2563EB", fontSize: 13 },
  breadcrumb: { color: "#6B7280", fontSize: 13 },
  breadcrumbCurrent: { fontWeight: "600", color: "#111827" },
  separator: { marginHorizontal: 5, color: "#6B7280" },
  lowStockText: {
  fontSize: 13,
  color: "#EF4444",
  fontWeight: "500",
  marginBottom: 6,
},

disabledCartButton: {
  backgroundColor: "#E5E7EB",
  paddingVertical: 14,
  paddingHorizontal: 60,
  borderRadius: 14,
  elevation: 4,
  minWidth: 200,
  alignItems: "center",
},

disabledCartButtonText: {
  color: "#9CA3AF",
  fontSize: 16,
  fontWeight: "600",
},

});

export default React.memo(ProductDetails);
