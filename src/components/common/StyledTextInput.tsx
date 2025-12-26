import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Platform, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface StyledTextInputProps extends TextInputProps {
    leftIcon?: keyof typeof Feather.glyphMap;
    rightIcon?: keyof typeof Feather.glyphMap;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
    secureTextEntry?: boolean;
}

const StyledTextInput = ({
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    secureTextEntry,
    ...props
}: StyledTextInputProps) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    return (
        <View style={[styles.inputContainer, {
            backgroundColor: theme.COLORS.lightGray,
            borderColor: theme.COLORS.border,
        }]}>
            {leftIcon && (
                <TouchableOpacity onPress={onLeftIconPress} style={styles.leftIconContainer}>
                    <Feather name={leftIcon} size={20} color={theme.COLORS.textSecondary} />
                </TouchableOpacity>
            )}
            <TextInput
                style={[
                    styles.input,
                    secureTextEntry && styles.secureTextInput,
                    leftIcon && styles.inputWithLeftIcon,
                    { color: theme.COLORS.textPrimary }
                ]}
                placeholderTextColor={theme.COLORS.textSecondary}
                autoCorrect={false}
                spellCheck={false}
                secureTextEntry={secureTextEntry}
                autoComplete="off"
                {...props}
            />
            {rightIcon && (
                <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
                    <Feather name={rightIcon} size={22} color={theme.COLORS.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        fontSize: 14,
        fontFamily: 'Inter-Regular',
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    secureTextInput: {
        letterSpacing: 0.5,
    },
    leftIconContainer: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    rightIconContainer: {
        paddingHorizontal: 16,
    },
});

export default StyledTextInput; 