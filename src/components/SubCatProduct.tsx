import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCart } from "../context/Cart"; // Import Cart Context

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  image: string;
}

const SubCatProduct = () => {
  const route = useRoute();
  const { subCategory } = route.params || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for subCategory:", subCategory);
        const response = await fetch(
          `https://grokart-2.onrender.com/api/v1/products/subCategory/${subCategory}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.message === "Products fetched" && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory]);

  const handleDetails = (id: string) => {
    navigation.navigate("ProductDetails", { productId: id });
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      removeFromCart(id); // Remove item if quantity is 1
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const renderItem = ({ item }: { item: Product }) => {
    const cartItem = cart.find((cartItem) => cartItem._id === item._id);

    return (
      <TouchableOpacity style={styles.productCard} onPress={() => handleDetails(item._id)}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>

        {cartItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item._id, cartItem.quantity)}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item._id, cartItem.quantity + 1)}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => addToCart({ ...item, quantity: 1 })}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products in {subCategory}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF4081" style={styles.loader} />
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      ) : (
        <Text>No products found. Try another category.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  loader: {
    marginTop: 20,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF4081",
    borderRadius: 6,
    padding: 5,
  },
  quantityButton: {
    fontSize: 18,
    color: "#FF4081",
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
});

export default SubCatProduct;
