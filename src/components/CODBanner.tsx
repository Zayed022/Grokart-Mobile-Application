import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CODBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        COD available · COD available · COD available · COD available
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: '#FEF3C7', // Tailwind's yellow-100
    paddingVertical: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#92400E', // Tailwind's yellow-700
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CODBanner;
