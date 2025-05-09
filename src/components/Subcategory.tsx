import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CategorySkeleton } from './CategorySkeleton';

// Simple in-memory cache for API responses
const cache = new Map();

// Define TypeScript interfaces
interface Subcategory {
  _id: string;
  category: string;
  subcategory: string;
  image?: string;
}

type CategoryMap = Record<string, Subcategory[]>;

// Define type for FlatList item
interface CategoryItem {
  categoryName: string;
  subcategories: Subcategory[];
}

const CsCards: React.FC = () => {
  // Declare all hooks at the top level, before any early returns
  const [categories, setCategories] = useState<CategoryMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const handleCategoryRedirect = useCallback((subcategory: string) => {
    navigation.navigate("Category", { subCategory: subcategory });
  }, [navigation]);

  useEffect(() => {
    const fetchCategories = async () => {
      const cacheKey = 'categories';

      // Check if data is in cache
      if (cache.has(cacheKey)) {
        setCategories(cache.get(cacheKey));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://grokart-2.onrender.com/api/v1/category/get-all-categories');
        const data: Subcategory[] = response.data;

        // Group subcategories by their category
        const groupedCategories = data.reduce((acc: CategoryMap, item: Subcategory) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});

        // Cache the data
        cache.set(cacheKey, groupedCategories);
        setCategories(groupedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Early return after all hooks are called
  if (loading) {
    return <CategorySkeleton />;
  }

  // Convert categories object to array for FlatList
  const categoryList: CategoryItem[] = Object.entries(categories).map(([categoryName, subcategories]) => ({
    categoryName,
    subcategories,
  }));

  // Render each category section
  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{item.categoryName}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // Hide scrollbar for cleaner look
        style={styles.subcategoryScroll}
      >
        {item.subcategories.map((subcategory) => (
          <TouchableOpacity
            onPress={() => handleCategoryRedirect(subcategory.subcategory)}
            key={subcategory._id}
            style={styles.card}
          >
            <Image
              source={{ uri: subcategory.image || 'https://via.placeholder.com/200' }}
              style={styles.image}
              resizeMode="cover"
              defaultSource={{ uri: 'https://via.placeholder.com/200' }} // Placeholder for faster perceived loading
            />
            <Text style={styles.subcategoryText}>{subcategory.subcategory}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shop by Category</Text>
      <FlatList
        data={categoryList}
        renderItem={renderCategory}
        keyExtractor={(item) => item.categoryName}
        showsVerticalScrollIndicator={false} // Hide scrollbar for cleaner look
        initialNumToRender={5} // Render only 5 items initially
        maxToRenderPerBatch={5} // Control batch rendering
        windowSize={5} // Limit the number of items in memory
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15, // Reduced padding for efficiency
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 15, // Reduced margin
  },
  categorySection: {
    marginBottom: 20, // Reduced margin
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    marginBottom: 5, // Reduced margin
  },
  subcategoryScroll: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  card: {
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // Reduced margin
  },
  image: {
    width: 140, // Slightly reduced size for faster rendering
    height: 140,
    borderRadius: 12,
  },
  subcategoryText: {
    marginTop: 8, // Reduced margin
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default React.memo(CsCards); // Memoize the component