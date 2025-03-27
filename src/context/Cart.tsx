import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext({} as any);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage (if applicable)
    return {};
  });

  useEffect(() => {
    // Persist cart data if needed
    // localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prevCart) => ({
      ...prevCart,
      [product._id]: (prevCart[product._id] || 0) + 1,
    }));
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  // Update Quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevCart) => ({
        ...prevCart,
        [productId]: quantity,
      }));
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
