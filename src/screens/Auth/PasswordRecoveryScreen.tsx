import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import StyledButton from '../../components/common/StyledButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useToast } from '../../context/ToastContext';

const PasswordRecoveryScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const theme = getTheme(isDark);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSendLink = async () => {
        if (!email.trim()) {
            showToast('Please enter your email address.', { type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setIsSent(true);
            showToast('Password reset email sent.', { type: 'success' });
        } catch (error: any) {
            // Firebase provides error codes – map to user-friendly message
            let message = error.message;
            if (error.code === 'auth/user-not-found') {
                message = 'No user found with this email.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'The email address is not valid.';
            }
            showToast(message, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>Reset Password</Text>
                        {isSent ? (
                            <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>
                                If an account exists for {email}, you will receive an email with instructions.
                            </Text>
                        ) : (
                            <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>
                                Enter your email and we'll send you a link to get back into your account.
                            </Text>
                        )}
                    </View>

                    {!isSent && (
                        <View style={styles.form}>
                            <StyledTextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    )}

                    <View style={styles.footer}>
                        <StyledButton
                            title={isSent ? 'Back to Login' : 'Send Reset Link'}
                            onPress={isSent ? () => navigation.navigate('Login') : handleSendLink}
                            loading={isLoading}
                        />
                        {!isSent && (
                            <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                                <Text style={[styles.backToLoginText, { color: theme.COLORS.primary }]}>
                                    Back to Login
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 30,
        fontFamily: 'Nunito-Bold',
        lineHeight: 36,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        lineHeight: 20,
        textAlign: 'center',
    },
    form: {
        marginBottom: 32,
    },
    footer: {
        alignItems: 'center',
    },
    backToLoginText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        lineHeight: 18,
        marginTop: 24,
    },
});

export default PasswordRecoveryScreen;
