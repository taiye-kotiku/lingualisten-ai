import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import SkeletonLoader from './SkeletonLoader';

const CategorySkeleton = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={[styles.card, { borderColor: theme.COLORS.border }]}> 
      <SkeletonLoader width="60%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="100%" height={8} borderRadius={4} />
    </View>
  );
};

export const CategorySkeletonList = ({ count = 6 }: { count?: number }) => (
  <View>
    {Array.from({ length: count }).map((_, index) => (
      <CategorySkeleton key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
});

export default CategorySkeleton; 