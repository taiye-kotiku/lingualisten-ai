import React, { useEffect, useRef } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';

interface ConfirmModalProps {
    visible: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'default' | 'destructive';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    type = 'default',
}) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const confirmButtonColor = type === 'destructive' ? theme.COLORS.error : theme.COLORS.primary;
    const iconName = type === 'destructive' ? 'alert-triangle' : 'help-circle';

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onCancel}>
            <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.COLORS.background,
                            borderColor: theme.COLORS.border,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: `${confirmButtonColor}15` }]}>
                        <Feather name={iconName} size={24} color={confirmButtonColor} />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {title && (
                            <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                        )}
                        <Text style={[styles.message, { color: theme.COLORS.textSecondary }]}>{message}</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.cancelButton,
                                {
                                    backgroundColor: theme.COLORS.lightGray,
                                    borderColor: theme.COLORS.border,
                                }
                            ]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.cancelText, { color: theme.COLORS.textSecondary }]}>
                                {cancelLabel}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.confirmButton,
                                { backgroundColor: confirmButtonColor }
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.confirmText, { color: theme.COLORS.background }]}>
                                {confirmLabel}
                            </Text>
                        </TouchableOpacity>
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
        width: Math.min(width - 40, 340),
        borderRadius: 16,
        borderWidth: 1,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 26,
    },
    message: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    cancelButton: {
        borderWidth: 1,
    },
    confirmButton: {
        borderWidth: 0,
    },
    cancelText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
    confirmText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
});

export default ConfirmModal; 