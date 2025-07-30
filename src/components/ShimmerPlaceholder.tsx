import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from 'react-native';

export default function ShimmerPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 16 }}>
        <View style={{ width: 100, height: 20 }} />
        <View style={{ width: 60, height: 20 }} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 }}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={{
              width: 160,
              height: 220,
              marginRight: 12,
              marginBottom: 20,
              borderRadius: 8,
            }}
          />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
}
