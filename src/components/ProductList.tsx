import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category: string;
};

const LIMIT = 10;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  

  const navigation = useNavigation();

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `https://grokart-2.onrender.com/api/v1/products/?page=${page}&limit=${LIMIT}`
      );

      const newProducts = res.data.products;
      const totalPages = res.data.totalPages;

      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prev) => prev + 1);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    // Placeholder for cart logic
    ToastAndroid.show(`${product.name} added to cart!`, ToastAndroid.SHORT);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ProductDetails" as never, {
          productId: item._id,
        } as never)
      }
    >
      <Image
       source={
    item.image
      ? {
          uri: item.image.includes('http://')
            ? item.image.replace('http://', 'https://').replace(/\.avif$/, '.jpg')
            : item.image.replace(/\.avif$/, '.jpg'),
        }
      : require('../assets/images/Grokart.png')
  }
        
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{item.description}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (hasMore && !loading) fetchProducts();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Products</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#00BFA6" /> : null
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No Products Found</Text> : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  card: {
    width: SCREEN_WIDTH / 2 - 22,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#00BFA6",
    marginBottom: 8,
  },
  cartButton: {
    backgroundColor: "#00BFA6",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
    fontSize: 16,
  },
});
