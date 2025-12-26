import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import SkeletonLoader from './SkeletonLoader';

const RecentActivitySkeleton = () => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <View style={[styles.card, { backgroundColor: theme.COLORS.lightGray }]}>
            <View style={styles.iconContainer}>
                <SkeletonLoader width={48} height={48} borderRadius={24} />
            </View>
            <View style={styles.textContainer}>
                <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonLoader width="60%" height={14} borderRadius={4} />
            </View>
            <View style={styles.timestampContainer}>
                <SkeletonLoader width={40} height={12} borderRadius={4} />
            </View>
        </View>
    );
};

const RecentActivitySkeletonList = ({ count = 3 }: { count?: number }) => {
    return (
        <View>
            {Array.from({ length: count }).map((_, index) => (
                <RecentActivitySkeleton key={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    timestampContainer: {
        marginLeft: 8,
    },
});

export { RecentActivitySkeleton, RecentActivitySkeletonList };
export default RecentActivitySkeleton; 