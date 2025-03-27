import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { CartContext } from "../context/Cart";

const Items = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useContext(CartContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (product) => {
    const updatedCart = { ...cart, [product._id]: (cart[product._id] || 0) + 1 };
    setCart(updatedCart);
    addToCart(product, updatedCart[product._id]);
  };

  const decreaseQuantity = (product) => {
    const updatedCart = { ...cart };
    if (updatedCart[product._id] > 1) {
      updatedCart[product._id] -= 1;
    } else {
      delete updatedCart[product._id];
    }
    setCart(updatedCart);
    addToCart(product, updatedCart[product._id] || 0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://grokart-2.onrender.com/api/v1/products/get-product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchTerm(query);
    setFilteredProducts(
      query.trim() === ""
        ? products
        : products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FF4081" />
      ) : (
        <FlatList
          data={filteredProducts.length > 0 ? filteredProducts : products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item: product }) => (
            <View style={{ flex: 1, margin: 8, padding: 16, backgroundColor: "white", borderRadius: 10, elevation: 3 }}>
              {product.discount > 0 && (
                <Text style={{ backgroundColor: "purple", color: "white", padding: 4, borderRadius: 5, alignSelf: "flex-start" }}>
                  {product.discount}% Off
                </Text>
              )}
              <Image
                source={{ uri: product.image || "https://via.placeholder.com/300" }}
                style={{ width: "100%", height: 120, resizeMode: "cover", borderRadius: 5 }}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{product.name}</Text>
              <Text>{product.weight || "500g"}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "green" }}>₹{product.discountedPrice || product.price}</Text>
                {product.discount > 0 && (
                  <Text style={{ marginLeft: 8, textDecorationLine: "line-through", color: "gray" }}>₹{product.price}</Text>
                )}
              </View>
              {cart[product._id] ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 8 }}>
                  <TouchableOpacity onPress={() => decreaseQuantity(product)}>
                    <Text style={{ fontSize: 20, color: "#FF4081" }}>−</Text>
                  </TouchableOpacity>
                  <Text>{cart[product._id]}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(product)}>
                    <Text style={{ fontSize: 20, color: "#FF4081" }}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    addToCart(product);
                    setCart((prev) => ({ ...prev, [product._id]: 1 }));
                  }}
                  style={{ backgroundColor: "#FF4081", padding: 10, borderRadius: 5, marginTop: 8 }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Items;
