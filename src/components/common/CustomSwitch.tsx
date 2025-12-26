import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange, disabled = false }) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.switchContainer,
                {
                    backgroundColor: value ? theme.COLORS.primary : theme.COLORS.border,
                    opacity: disabled ? 0.5 : 1,
                }
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <View
                style={[
                    styles.switchThumb,
                    {
                        backgroundColor: theme.COLORS.background,
                        transform: [{ translateX: value ? 20 : 2 }],
                    }
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        padding: 2,
    },
    switchThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default CustomSwitch; 