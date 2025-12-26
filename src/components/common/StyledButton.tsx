import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface StyledButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
}

const StyledButton = ({ title, loading = false, ...props }: StyledButtonProps) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.COLORS.primary }]}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={theme.COLORS.background} />
            ) : (
                <Text style={[styles.buttonText, { color: theme.COLORS.background }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        lineHeight: 22,
    },
});

export default StyledButton; 