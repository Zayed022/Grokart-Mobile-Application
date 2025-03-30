import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define TypeScript interfaces
interface Subcategory {
  _id: string;
  category: string;
  subcategory: string;
  image?: string;
}

type CategoryMap = Record<string, Subcategory[]>;

const CsCards: React.FC = () => {
  const [categories, setCategories] = useState<CategoryMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
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

        setCategories(groupedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }
  const handleCategoryRedirect = (subcategory: string) => {
    navigation.navigate("Category", { subCategory: subcategory });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Shop by Category</Text>

      {Object.entries(categories).map(([categoryName, subcategories]) => (
        <View key={categoryName} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{categoryName}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.subcategoryScroll}>
            {subcategories.map((subcategory) => (
              <TouchableOpacity onPress={() => handleCategoryRedirect(subcategory.subcategory)}
                key={subcategory._id}
                //onPress={() => navigation.navigate('SubCategory', { subcategory: subcategory.subcategory })}
                style={styles.card}
              >
                <Image 
                  source={{ uri: subcategory.image || 'https://via.placeholder.com/200' }}
                  style={styles.image}
                />
                <Text style={styles.subcategoryText}>{subcategory.subcategory}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  subcategoryScroll: {
    paddingLeft: 10,
    flexDirection:'row',
    marginTop:5
  },
  card: {
    alignItems: 'center',
    marginRight: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  subcategoryText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CsCards;
