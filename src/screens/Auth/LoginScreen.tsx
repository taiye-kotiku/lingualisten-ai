import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import StyledButton from '../../components/common/StyledButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useToast } from '../../context/ToastContext';

const LoginScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { showToast } = useToast();

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Please fill in all fields.', { type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigation will be handled by the AuthContext listener
        } catch (error: any) {
            showToast(error.message, { type: 'error' });
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
                        <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>Welcome Back!</Text>
                        <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>Log in to continue your language journey.</Text>
                    </View>

                    <View style={styles.form}>
                        <StyledTextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={{ height: 16 }} />
                        <StyledTextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                            rightIcon={isPasswordVisible ? 'eye' : 'eye-off'}
                            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
                            <Text style={[styles.forgotPasswordText, { color: theme.COLORS.primary }]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <StyledButton title="Login" onPress={handleLogin} loading={isLoading} />
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
                            <Text style={[styles.signUpText, { color: theme.COLORS.textSecondary }]}>
                                Don't have an account? <Text style={[styles.signUpLink, { color: theme.COLORS.primary }]}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
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
    },
    form: {
        marginBottom: 32,
    },
    footer: {
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        marginTop: 24,
    },
    signUpLink: {
        fontFamily: 'Inter-Medium',
    },
    forgotPasswordText: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        lineHeight: 16,
        textAlign: 'right',
        marginTop: 12,
    },
});

export default LoginScreen;
