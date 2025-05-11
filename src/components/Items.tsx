import React from "react";
import { 
  View, Text, Image, FlatList, TouchableOpacity, 
  ActivityIndicator, StyleSheet, Dimensions 
} from "react-native";
import { useCart } from "../context/Cart";
import ProductSkeleton from "./ProductSkeleton";

const screenWidth = Dimensions.get("window").width;

interface Product {
  _id: string;
  name: string;
  price: number;
  description:string,
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
        
        <View style={styles.infoContainer}>
          <Text >{item.description}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.price}>₹{item.price}</Text>

          {/* Add to Cart & Quantity Selector */}
          {quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecreaseQuantity(item._id, quantity)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item._id, quantity + 1)} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    const skeletonArray = Array.from({ length: 6 });
    return (
      <FlatList
        data={skeletonArray}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <ProductSkeleton />}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    );
  }
  

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No products found</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={products} 
      renderItem={renderItem} 
      keyExtractor={(item) => item._id} 
      numColumns={2} 
      columnWrapperStyle={styles.row} 
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productCard: {
    width: (screenWidth / 2) - 20,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#222",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4d4d",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  quantityButton: {
    paddingHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4d",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});

export default Items;
