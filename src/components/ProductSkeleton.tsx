import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ProductSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.lineShort} />
      <View style={styles.lineMedium} />
      <View style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth / 2 - 20,
    backgroundColor: "#fff",
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  lineShort: {
    width: "60%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginTop: 10,
  },
  lineMedium: {
    width: "80%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  button: {
    width: "100%",
    height: 36,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginTop: 12,
  },
});

export default ProductSkeleton;
