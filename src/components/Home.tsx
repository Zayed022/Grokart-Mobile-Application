import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import Navbar from './Navbar';
import Subcategory from './Subcategory';
import CsCards from './Subcategory';
import Items from './Items';

export class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Navbar />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <CsCards />
          <Items />
          <Text style={styles.text}>Home Component </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 20, // Adds spacing at the bottom for better scrolling
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Home;
