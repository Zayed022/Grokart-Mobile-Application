import React, { useContext, useEffect, useState ,createContext} from "react";
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/Cart";

const SubcategoryPage = () => {
    type Product = {
        id: string;
        image: string;
        name: string;
        price: number;
      };
      
    interface CartContextType {
        cart: any[];
        addToCart: (item: any) => void;
      }
      
      
      
  const route = useRoute();
  const navigation = useNavigation();
  const { subCategory } = route.params as { subCategory: string };

 
const { addToCart } = useContext<CartContextType>(CartContext);


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    if (!subCategory) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://grokart-2.onrender.com/api/v1/products/subCategory/${encodeURIComponent(subCategory)}`
        );
        const data = await response.json();

        if (data.message === "Products fetched" && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();
  }, []);

  const updateCart = async (newCart) => {
    setCart(newCart);
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const increaseQuantity = (product: any) => {
    const updatedCart = { ...cart };
    updatedCart[product._id] = (updatedCart[product._id] || 0) + 1;
  
    // Update the cart with only one argument
    updateCart(updatedCart);
  
    // Optional: If you need to update with product info, adjust the function
    addToCart(product);
  };
  
  const decreaseQuantity = (product) => {
    const updatedCart = { ...cart };

    if (updatedCart[product._id] > 1) {
      updatedCart[product._id] -= 1;
    } else {
      delete updatedCart[product._id];
    }

    updateCart(updatedCart);
    addToCart(product || 0);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF69B4" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
        Products in {subCategory || "this category"}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item: product }: { item: Product }) => (
          <View
            style={{
              backgroundColor: "#fff",
              marginBottom: 16,
              padding: 16,
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                //navigation.navigate("ProductDetail", { productId: product._id })
              }
            >
              {product.image && (
                <Image
                  source={{ uri: product.image }}
                  style={{ width: "100%", height: 150, borderRadius: 10 }}
                />
              )}
              <Text style={{ fontWeight: "bold", marginTop: 8 }}>{product.name}</Text>
              <Text style={{ color: "gray" }}>₹{product.price}</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 12 }}>
              {cart[product.id] ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity onPress={() => decreaseQuantity(product)}>
                    <Text style={{ fontSize: 24, color: "#FF69B4" }}>−</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 18 }}>{cart[product.id]}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(product)}>
                    <Text style={{ fontSize: 24, color: "#FF69B4" }}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF69B4",
                    padding: 10,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => increaseQuantity(product)}
                >
                  <Text style={{ color: "#fff" }}>Add to Cart</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No products found in this subcategory.</Text>}
      />
    </View>
  );
};

export default SubcategoryPage;
