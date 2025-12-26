import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions } from 'react-native';
import { getTheme } from '../constants/theme';
import { useTheme } from './ThemeContext';

interface ToastOptions {
    type?: 'info' | 'success' | 'error';
    duration?: number; // ms
}

interface ToastContextValue {
    showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    const [message, setMessage] = useState<string>('');
    const [type, setType] = useState<ToastOptions['type']>('info');
    const opacity = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hideToast = useCallback(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setMessage('');
        });
    }, [opacity]);

    const showToast = useCallback(
        (msg: string, options?: ToastOptions) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setMessage(msg);
            setType(options?.type || 'info');
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();

            const duration = options?.duration ?? 3000;
            timeoutRef.current = setTimeout(() => {
                hideToast();
            }, duration);
        },
        [opacity, hideToast]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const backgroundColor =
        type === 'error'
            ? theme.COLORS.error
            : type === 'success'
                ? theme.COLORS.success
                : theme.COLORS.primary;

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {message ? (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.toast,
                        {
                            backgroundColor,
                            opacity,
                            top: 60,
                        },
                    ]}
                >
                    <Text style={[styles.toastText, { color: theme.COLORS.background }]}>{message}</Text>
                </Animated.View>
            ) : null}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        left: 20,
        right: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    toastText: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Inter-Medium',
    },
}); 