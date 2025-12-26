import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import StyledButton from '../../components/common/StyledButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';

const SignUpScreen = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const { resetOnboarding } = useOnboarding();
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const theme = getTheme(isDark);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            showToast('Please fill in all fields.', { type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            // Ensure onboarding shows immediately after account creation
            await resetOnboarding();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            // Save profile to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                email,
                createdAt: serverTimestamp(),
            });
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
                        <Text style={[styles.title, { color: theme.COLORS.textPrimary }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: theme.COLORS.textSecondary }]}>Start your language learning adventure with us.</Text>
                    </View>

                    <View style={styles.form}>
                        <StyledTextInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        <View style={{ height: 16 }} />
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
                    </View>

                    <View style={styles.footer}>
                        <StyledButton title="Sign Up" onPress={handleSignUp} loading={isLoading} />
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                            <Text style={[styles.signInText, { color: theme.COLORS.textSecondary }]}>
                                Already have an account? <Text style={[styles.signInLink, { color: theme.COLORS.primary }]}>Log In</Text>
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
        textAlign: 'center',
    },
    form: {
        marginBottom: 32,
    },
    footer: {
        alignItems: 'center',
    },
    signInText: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        lineHeight: 18,
        marginTop: 24,
    },
    signInLink: {
        fontFamily: 'Inter-Medium',
    },
});

export default SignUpScreen;
