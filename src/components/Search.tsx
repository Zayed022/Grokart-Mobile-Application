import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

const Search = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://grokart-2.onrender.com/api/v1/products/get-product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetails", { productId: product._id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Products</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍  Search for groceries or essentials..."
        value={searchTerm}
        onChangeText={handleSearch}
        placeholderTextColor="#888"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={styles.loadingIndicator} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>No products found matching "{searchTerm}"</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item)}>
              <Image source={{ uri: item.image || "https://via.placeholder.com/300" }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f8",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#10b981",
  },
});


export default Search;
