import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useCart } from "../context/Cart";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  image: string;
}

const Items = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  React.useEffect(() => {
    fetch("https://grokart-2.onrender.com/api/v1/products/get-product")
      .then((response) => response.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const renderItem = ({ item }: { item: Product }) => {
    const cartItem = cart.find((cartItem) => cartItem._id === item._id);
    const quantity = cartItem?.quantity || 0;

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.image} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>

        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecreaseQuantity(item._id, quantity)}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item._id, quantity + 1)}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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

  return <FlatList data={products} renderItem={renderItem} keyExtractor={(item) => item._id} numColumns={2} />;
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  productCard: { flex: 1, backgroundColor: "#fff", margin: 8, borderRadius: 12, padding: 12, alignItems: "center" },
  image: { width: 140, height: 140, borderRadius: 8, marginBottom: 10, resizeMode: "cover" },
  productName: { fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#333", marginBottom: 4 },
  price: { fontSize: 16, fontWeight: "bold", color: "#FF4081", marginBottom: 10 },
  button: { backgroundColor: "#FF4081", paddingVertical: 10, width: "100%", borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  quantityContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", borderWidth: 1, borderColor: "#FF4081", borderRadius: 6, padding: 5 },
  quantityButton: { fontSize: 18, color: "#FF4081", paddingHorizontal: 10 },
  quantityText: { fontSize: 16, fontWeight: "bold", paddingHorizontal: 10 },
});

export default Items;