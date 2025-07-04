import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import Navbar from './Navbar';
import CsCards from './Subcategory';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useCart } from '../context/Cart';
import PaanCorner from './PaanCornerBanner';
import LocationSelector from './LocationSelector';


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
        <LocationSelector/>
         <PaanCorner />
        <MemoizedCsCards refreshKey={refreshKey} />
      </ScrollView>

       {cartCount > 0 && (
        
  <TouchableOpacity
    style={styles.cartBarContainer}
    activeOpacity={0.85}
    onPress={() => navigation.navigate('Cart')}
  >
    {/* Banner */}
    <View style={styles.bannerRow}>
      <Text style={styles.bannerEmoji}>🎉</Text>
      <Text style={styles.bannerText}>
        Hooray! {/*<Text style={styles.bold}>FREE DELIVERY</Text> unlocked!*/}
        <Text style={styles.bold}>Items Added to Cart!</Text> 
      </Text>
    </View>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Cart Row */}
    <View style={styles.cartContent}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {cart.slice(0, 5).map((item, index) => (
          <Image
            key={index}
            source={{ uri: item.image || 'https://via.placeholder.com/40' }}
            style={styles.cartImage}
          />
        ))}
      </ScrollView>

      <View style={styles.itemInfo}>
        <Text style={styles.itemCount}>
          {cartCount} Item{cartCount > 1 ? 's' : ''}
        </Text>
        <Text style={styles.savings}>
          You save ₹{cart.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0)}
        </Text>
      </View>

      {/* CTA Button styled as box, but no touch handler since outer one handles it */}
      <View style={styles.cartButton}>
        <Text style={styles.buttonText}>Go to cart</Text>
      </View>
    </View>
  </TouchableOpacity>
  
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
  cartBarContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingVertical: 22,
  paddingHorizontal: 14,
  elevation: 20,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: -2 },
  zIndex: 999,
},

freeDeliveryBanner: {
  paddingHorizontal: 16,
  paddingTop: 10,
},

freeDeliveryText: {
  fontSize: 13,
  color: '#10B981',
},

cartBar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
},

leftSection: {
  flexDirection: 'row',
  alignItems: 'center',
},

productImage: {
  width: 40,
  height: 40,
  borderRadius: 6,
  marginRight: 10,
},

itemText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111',
},

savingsText: {
  fontSize: 12,
  color: '#10B981',
},

ctaButton: {
  backgroundColor: '#10B981',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
},

ctaText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
bannerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},

bannerEmoji: {
  fontSize: 16,
  marginRight: 6,
},

bannerText: {
  fontSize: 13,
  color: '#111',
},

bold: {
  fontWeight: 'bold',
},

divider: {
  height: 1,
  backgroundColor: '#ddd',
  marginBottom: 8,
},

cartContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

imageRow: {
  flexDirection: 'row',
  marginRight: 10,
  maxWidth: 120,
},

cartImage: {
  width: 36,
  height: 36,
  borderRadius: 8,
  marginRight: 6,
  borderWidth: 1,
  borderColor: '#eee',
},

itemInfo: {
  flex: 1,
  justifyContent: 'center',
},

itemCount: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111',
},

savings: {
  fontSize: 12,
  color: '#10B981',
},

cartButton: {
  backgroundColor: '#10B981',
  paddingHorizontal: 18,
  paddingVertical: 10,
  borderRadius: 10,
},

buttonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},

});

export default Home;
