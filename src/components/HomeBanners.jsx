import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Paan from "../assets/images/Paan.png"
import Fruits from "../assets/images/Fruits.jpg"
import Ciggaretes from "../assets/images/Ciggaretes.jpg"
import Snacks from "../assets/images/Snacks.jpg"

const banners = [
  {
    id: '1',
    image: Ciggaretes,
     isLocal: true,
    title: 'Instant Paan',
    subCategory: 'Pan Corner',
  },
  {
    id: '2',
    image: Fruits,
    isLocal: true,
    title: 'Fresh Vegetables',
    subCategory: 'Fruits & Vegetables',
  },
  {
    id: '3',
    image: 'https://cdn.zeptonow.com/app/images/home/categories/dairy.png',
    title: 'Dairy & Milk',
    subCategory: 'Dairy, Bread & Eggs',
  },
  {
    id: '4',
    image: Snacks,
    isLocal: true,
    title: 'Snacks & Chips',
    subCategory: 'Munchies',
  },
  // Add more banners as needed
];

const HomeBanners: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const handlePress = (subCategory: string) => {
    navigation.navigate('Category', { subCategory });
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: width - 32 }]}
            activeOpacity={0.9}
            onPress={() => handlePress(item.subCategory)}
          >
            <Image
  source={item.isLocal ? item.image : { uri: item.image }}
  style={styles.image}
  resizeMode="cover"
/>

            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 140,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeBanners;
