import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const placeholderSuggestions = [
  "Search for Curd",
  "Search for Chips",
  "Search for Milk",
  "Search for Bread",
  "Search for Fruits",
  
];

const SearchBar: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholderSuggestions.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity
      style={styles.searchContainer}
      onPress={() => navigation.navigate("Search" as never)}
      activeOpacity={0.8}
    >
      <MaterialIcon name="search" size={20} color="#888" />
      <Text style={styles.searchPlaceholder}>{placeholderSuggestions[currentIndex]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9", // Tailwind slate-100
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: "#6b7280", // Tailwind gray-500
    fontSize: 15,
    fontWeight: "500",
  },
});

export default SearchBar;
