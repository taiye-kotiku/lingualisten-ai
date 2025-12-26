import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface TargetPickerModalProps {
    visible: boolean;
    selectedMinutes: number;
    onSelect: (minutes: number) => void;
    onClose: () => void;
}

const OPTIONS = [10, 15, 30, 60];

const TargetPickerModal: React.FC<TargetPickerModalProps> = ({ visible, selectedMinutes, onSelect, onClose }) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 0.8, duration: 150, useNativeDriver: true }),
            ]).start();
        }
    }, [visible, opacity, scale]);

    const handleSelect = (m: number) => {
        onSelect(m);
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.overlay, { opacity }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <Animated.View
                    style={[styles.container, { backgroundColor: theme.COLORS.background, borderColor: theme.COLORS.border, transform: [{ scale }] }]}
                >
                    <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>Set Daily Target</Text>
                    <View style={styles.options}>
                        {OPTIONS.map((m) => {
                            const isSelected = m === selectedMinutes;
                            return (
                                <TouchableOpacity
                                    key={m}
                                    style={[styles.optionButton, {
                                        borderColor: isSelected ? theme.COLORS.primary : theme.COLORS.border,
                                        backgroundColor: isSelected ? `${theme.COLORS.primary}15` : theme.COLORS.lightGray,
                                    }]}
                                    onPress={() => handleSelect(m)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.optionText, { color: isSelected ? theme.COLORS.primary : theme.COLORS.textPrimary }]}>{m} min</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: Math.min(width - 40, 320),
        borderRadius: 16,
        borderWidth: 1,
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionButton: {
        width: '47%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
    },
});

export default TargetPickerModal; 