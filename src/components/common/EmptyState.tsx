import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface EmptyStateProps {
    icon: keyof typeof Feather.glyphMap;
    message: string;
}

const EmptyState = ({ icon, message }: EmptyStateProps) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <View style={[styles.container, { backgroundColor: theme.COLORS.lightGray }]}>
            <Feather name={icon} size={48} color={theme.COLORS.textSecondary} style={styles.icon} />
            <Text style={[styles.message, { color: theme.COLORS.textSecondary }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
    },
    icon: {
        marginBottom: 16,
    },
    message: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default EmptyState; 