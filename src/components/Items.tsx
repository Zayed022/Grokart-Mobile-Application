import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, TouchableOpacity, 
  ActivityIndicator, StyleSheet 
} from "react-native";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  image: string;
}

const Items = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()

  useEffect(() => {
    fetch("https://grokart-2.onrender.com/api/v1/products/get-product")
      .then(response => response.json())
      .then(data => {
        console.log("Received products:", data); // Debug log
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, []);
  const handleDetails = (id: string)=>{
    navigation.navigate("ProductDetails",{productId: id})
  }

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity 
        style={styles.productCard} 
        onPress={() => handleDetails(item._id)}
      >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
        defaultSource={{ uri: 'https://via.placeholder.com/150' }}
      />
      </TouchableOpacity>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No products found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4081",
    marginBottom: 10,
  },
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

export default Items;
