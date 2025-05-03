import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
export const CategorySkeleton = () => (
  <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
    {[1, 2].map((_, i) => (
      <View key={i} style={{ marginBottom: 30 }}>
        <SkeletonPlaceholder>
          <View style={{ marginLeft: 10, marginBottom: 10, width: 120, height: 24, borderRadius: 4 }} />
        </SkeletonPlaceholder>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 10 }}>
          {[1, 2, 3].map((_, j) => (
            <View key={j} style={{ alignItems: 'center', marginRight: 20 }}>
              <SkeletonPlaceholder>
                <View style={{ width: 150, height: 150, borderRadius: 12 }} />
                <View style={{ marginTop: 10, width: 100, height: 20, borderRadius: 4 }} />
              </SkeletonPlaceholder>
            </View>
          ))}
        </ScrollView>
      </View>
    ))}
  </ScrollView>
);
