import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../constants/theme';
import StyledTextInput from '../../components/common/StyledTextInput';
import StyledButton from '../../components/common/StyledButton';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const theme = getTheme(isDark);

    // Initialize with current user data
    const [formData, setFormData] = useState({
        name: 'Adeola',
        email: 'adeolaibi@example.com',
        phone: '+234 801 234 5678',
        bio: 'Learning Yoruba to connect with my heritage.',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                'Profile Updated',
                'Your profile has been successfully updated.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 1500);
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Changes',
            'Are you sure you want to discard your changes?',
            [
                { text: 'Keep Editing', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                        <Feather name="x" size={24} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.COLORS.textPrimary }]}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <Feather name="check" size={24} color={theme.COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Profile Avatar */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.COLORS.primary }]}>
                        <Text style={[styles.avatarText, { color: theme.COLORS.background }]}>
                            {formData.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.changePhotoButton}>
                        <Text style={[styles.changePhotoText, { color: theme.COLORS.primary }]}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <View style={styles.fieldGroup}>
                        <Text style={[styles.fieldLabel, { color: theme.COLORS.textPrimary }]}>Full Name</Text>
                        <StyledTextInput
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.fieldLabel, { color: theme.COLORS.textPrimary }]}>Email</Text>
                        <StyledTextInput
                            placeholder="Enter your email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.fieldLabel, { color: theme.COLORS.textPrimary }]}>Phone Number</Text>
                        <StyledTextInput
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.fieldLabel, { color: theme.COLORS.textPrimary }]}>Bio</Text>
                        <StyledTextInput
                            placeholder="Tell us about yourself"
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100 }}
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <StyledButton
                        title="Save Changes"
                        onPress={handleSave}
                        loading={isLoading}
                    />
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={[styles.cancelButtonText, { color: theme.COLORS.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    headerButton: {
        padding: 8,
        width: 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 28,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
    changePhotoButton: {
        padding: 8,
    },
    changePhotoText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 20,
    },
    formSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 8,
    },
    actionButtons: {
        paddingHorizontal: 20,
        gap: 16,
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        lineHeight: 22,
    },
});

export default EditProfileScreen; 