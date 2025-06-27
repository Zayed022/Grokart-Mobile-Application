import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Navbar from './Navbar';
import CsCards from './Subcategory';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useCart } from '../context/Cart';
import PaanCorner from './PaanCornerBanner';

const MemoizedCsCards = React.memo(CsCards);

const Home = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
         <PaanCorner />
        <MemoizedCsCards refreshKey={refreshKey} />
      </ScrollView>

      {cartCount > 0 && (
        <View style={styles.cartBarContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Feather name="shopping-cart" size={20} color="#fff" />
            <Text style={styles.cartText}>Your Cart</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    paddingBottom: 100, // To avoid being hidden behind the cart bar
    paddingTop: 10,
  },
  cartBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }],
    zIndex: 999,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent:'center',
    backgroundColor: '#28a745', // Green color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 14,
    elevation: 4,
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#28a745',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Home;
