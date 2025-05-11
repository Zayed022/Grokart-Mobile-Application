import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/Cart";
import ProductSkeleton from "../components/ProductSkeleton";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  subCategory?: string;
  image: string;
}

interface ProductCardProps {
  item: Product;
  onPress: () => void;
  cartItem: any;
  handleAddToCart: () => void;
  handleDecreaseQuantity: () => void;
  handleIncreaseQuantity: () => void;
}

const ProductCard = React.memo(
  ({
    item,
    onPress,
    cartItem,
    handleAddToCart,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
  }: ProductCardProps) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityLabel={`Product: ${item.name}, price: ₹${item.price}`}
      accessibilityHint="Tap to view product details"
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={`Image of ${item.name}`}
      />
      <Text
        style={styles.productName}
        numberOfLines={2}
        accessibilityLabel={`Product name: ${item.name}`}
      >
        {item.name}
      </Text>
      <Text
        style={styles.description}
        numberOfLines={1}
        accessibilityLabel={`Description: ${item.description}`}
      >
        {item.description}
      </Text>
      <Text
        style={styles.price}
        accessibilityLabel={`Price: ₹${item.price}`}
      >
        ₹ {item.price}
      </Text>

      {cartItem ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={handleDecreaseQuantity}
            activeOpacity={0.8}
            accessibilityLabel={`Decrease quantity of ${item.name}`}
            accessibilityHint="Reduces the quantity of this item in the cart"
          >
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text
            style={styles.quantityText}
            accessibilityLabel={`Quantity: ${cartItem.quantity}`}
          >
            {cartItem.quantity}
          </Text>
          <TouchableOpacity
            onPress={handleIncreaseQuantity}
            activeOpacity={0.8}
            accessibilityLabel={`Increase quantity of ${item.name}`}
            accessibilityHint="Increases the quantity of this item in the cart"
          >
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddToCart}
          activeOpacity={0.8}
          accessibilityLabel={`Add ${item.name} to cart`}
          accessibilityHint="Adds this product to your cart"
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  ),
  (prevProps, nextProps) =>
    prevProps.item._id === nextProps.item._id &&
    prevProps.cartItem?.quantity === nextProps.cartItem?.quantity
);

const SubCatProduct = () => {
  const route = useRoute();
  const { subCategory } = route.params || {};
  const navigation = useNavigation();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const cartLookup = useMemo(() => {
    const lookup: { [key: string]: any } = {};
    cart.forEach((item) => {
      lookup[item._id] = item;
    });
    return lookup;
  }, [cart]);

  const cacheProducts = useCallback(async (subCategory: string, products: Product[]) => {
    try {
      await AsyncStorage.setItem(`products_${subCategory}`, JSON.stringify(products));
    } catch (error) {
      console.error("Error caching products:", error);
    }
  }, []);

  const getCachedProducts = useCallback(async (subCategory: string) => {
    try {
      const cached = await AsyncStorage.getItem(`products_${subCategory}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error retrieving cached products:", error);
      return null;
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    let abortController = new AbortController();
    setError("");
    try {
      const cached = await getCachedProducts(subCategory);
      if (cached) {
        setProducts(cached);
        setLoading(false);
      }

      const response = await fetch(
        `https://grokart-2.onrender.com/api/v1/products/subCategory/${subCategory}`,
        { signal: abortController.signal }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message === "Products fetched" && Array.isArray(data.products)) {
        setProducts(data.products);
        await cacheProducts(subCategory, data.products);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again.");
      if (!cached) setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    return () => abortController.abort();
  }, [subCategory, cacheProducts, getCachedProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleRetry = () => {
    setLoading(true);
    fetchProducts();
  };

  const handleDetails = useCallback(
    (id: string) => {
      navigation.navigate("ProductDetails", { productId: id });
    },
    [navigation]
  );

  const handleAddToCart = useCallback(
    (item: Product) => {
      addToCart({ ...item, quantity: 1 });
    },
    [addToCart]
  );

  const handleDecreaseQuantity = useCallback(
    (id: string, currentQuantity: number) => {
      if (currentQuantity === 1) {
        removeFromCart(id);
      } else {
        updateQuantity(id, currentQuantity - 1);
      }
    },
    [removeFromCart, updateQuantity]
  );

  const handleIncreaseQuantity = useCallback(
    (id: string, currentQuantity: number) => {
      updateQuantity(id, currentQuantity + 1);
    },
    [updateQuantity]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      const cartItem = cartLookup[item._id];
      return (
        <ProductCard
          item={item}
          onPress={() => handleDetails(item._id)}
          cartItem={cartItem}
          handleAddToCart={() => handleAddToCart(item)}
          handleDecreaseQuantity={() =>
            handleDecreaseQuantity(item._id, cartItem?.quantity || 0)
          }
          handleIncreaseQuantity={() =>
            handleIncreaseQuantity(item._id, cartItem?.quantity || 0)
          }
        />
      );
    },
    [
      cartLookup,
      handleDetails,
      handleAddToCart,
      handleDecreaseQuantity,
      handleIncreaseQuantity,
    ]
  );

  return (
    <View style={styles.container}>
      <Text
        style={styles.header}
        accessibilityLabel={`Products in ${subCategory}`}
        accessibilityRole="header"
      >
        Products in {subCategory}
      </Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text
            style={styles.errorText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}
            accessibilityLabel="Retry loading products"
            accessibilityHint="Attempts to reload the product list"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading && !refreshing ? (
        <FlatList
          data={Array.from({ length: 6 })}
          renderItem={() => <ProductSkeleton />}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          initialNumToRender={6}
          removeClippedSubviews
          maxToRenderPerBatch={6}
          windowSize={5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={styles.emptyText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            No products found.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
            accessibilityLabel="Try another category"
            accessibilityHint="Navigates to the home screen to select a different category"
          >
            <Text style={styles.emptyButtonText}>Try Another Category</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#111827",
  },
  list: {
    paddingBottom: 30,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: "47%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FF4081",
    paddingVertical: 8,
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF4081",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  quantityButton: {
    fontSize: 18,
    color: "#FF4081",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default React.memo(SubCatProduct);