import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import SkeletonLoader from './SkeletonLoader';

const PhraseCardSkeleton = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={[styles.card, { backgroundColor: theme.COLORS.lightGray }]}> 
      <SkeletonLoader width={36} height={36} borderRadius={18} style={{ alignSelf: 'center', marginBottom: 12 }} />
      <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ alignSelf: 'center' }} />
    </View>
  );
};

export const PhraseCardSkeletonList = ({ count = 6 }: { count?: number }) => (
  <View style={styles.list}> 
    {Array.from({ length: count }).map((_, idx) => (
      <PhraseCardSkeleton key={idx} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    minHeight: 120,
    marginBottom: 16,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default PhraseCardSkeleton; 