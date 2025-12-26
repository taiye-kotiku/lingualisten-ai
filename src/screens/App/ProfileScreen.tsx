import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { getTheme } from '../../constants/theme';
import CustomSwitch from '../../components/common/CustomSwitch';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { updateProfile } from 'firebase/auth';
import StyledButton from '../../components/common/StyledButton';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useUsage } from '../../context/UsageContext';
import TargetPickerModal from '../../components/common/TargetPickerModal';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const { logout, profile, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const theme = getTheme(isDark);

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(profile?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showTargetModal, setShowTargetModal] = useState(false);

    const { secondsToday, targetMinutes, setTargetMinutes } = useUsage();

    const minutesToday = Math.floor(secondsToday / 60);
    const reachedTarget = minutesToday >= targetMinutes;

    const handleChangeTarget = () => {
        setShowTargetModal(true);
    };

    const userName = profile?.name || 'User';
    const userEmail = profile?.email || '';
    const avatarLetter = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        setShowLogoutModal(false);
        await logout();
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleSupport = () => {
        navigation.navigate('HelpSupport');
    };

    const handlePrivacy = () => {
        navigation.navigate('PrivacyPolicy');
    };

    const handleStartEditing = () => {
        setNewName(profile?.name || '');
        setIsEditingName(true);
    };

    const handleCancelEditing = () => {
        setNewName(profile?.name || '');
        setIsEditingName(false);
        Keyboard.dismiss();
    };

    const handleUpdateName = async () => {
        if (!newName.trim() || !user) return;

        // Dismiss keyboard before processing
        Keyboard.dismiss();

        setIsUpdating(true);
        try {
            // Update Firestore profile first (this is what the UI shows)
            await updateDoc(doc(db, 'users', user.uid), {
                name: newName.trim()
            });

            // Update Firebase Auth profile in background (no await)
            updateProfile(user, { displayName: newName.trim() }).catch(console.error);

            setIsEditingName(false);
            showToast('Your name has been updated successfully.', { type: 'success' });
        } catch (error) {
            showToast('Failed to update your name. Please try again.', { type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const SettingItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showArrow = true,
        rightComponent,
        isLast = false
    }: {
        icon: keyof typeof Feather.glyphMap;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        showArrow?: boolean;
        rightComponent?: React.ReactNode;
        isLast?: boolean;
    }) => {
        const itemStyle = [
            styles.settingItem,
            { borderBottomColor: theme.COLORS.border },
            isLast && { borderBottomWidth: 0 }
        ];

        if (rightComponent) {
            return (
                <View style={itemStyle}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: theme.COLORS.background }]}>
                            <Feather name={icon} size={20} color={theme.COLORS.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                            {subtitle && <Text style={[styles.settingSubtitle, { color: theme.COLORS.textSecondary }]}>{subtitle}</Text>}
                        </View>
                    </View>
                    <View style={styles.settingRight}>
                        {rightComponent}
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity style={itemStyle} onPress={onPress} disabled={!onPress}>
                <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: theme.COLORS.background }]}>
                        <Feather name={icon} size={20} color={theme.COLORS.textSecondary} />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: theme.COLORS.textPrimary }]}>{title}</Text>
                        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.COLORS.textSecondary }]}>{subtitle}</Text>}
                    </View>
                </View>
                <View style={styles.settingRight}>
                    {showArrow && (
                        <Feather name="chevron-right" size={20} color={theme.COLORS.textSecondary} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={[styles.profileHeader, { backgroundColor: theme.COLORS.background }]}>
                    <View style={[styles.avatarContainer, { backgroundColor: theme.COLORS.primary }]}>
                        <Text style={[styles.avatarText, { color: theme.COLORS.background }]}>{avatarLetter}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        {isEditingName ? (
                            <View style={styles.editingContainer}>
                                <TextInput
                                    style={[styles.nameInput, {
                                        color: theme.COLORS.textPrimary,
                                        borderColor: theme.COLORS.border,
                                        backgroundColor: theme.COLORS.lightGray
                                    }]}
                                    value={newName}
                                    onChangeText={setNewName}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={theme.COLORS.textSecondary}
                                    autoFocus
                                    returnKeyType="done"
                                    onSubmitEditing={handleUpdateName}
                                />
                                <View style={styles.editingButtons}>
                                    <TouchableOpacity
                                        style={[styles.editActionButton, styles.cancelEditButton, { borderColor: theme.COLORS.border }]}
                                        onPress={handleCancelEditing}
                                        disabled={isUpdating}
                                    >
                                        <Feather name="x" size={16} color={theme.COLORS.textSecondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.editActionButton, styles.saveEditButton, { backgroundColor: theme.COLORS.primary }]}
                                        onPress={handleUpdateName}
                                        disabled={!newName.trim() || newName.trim() === profile?.name || isUpdating}
                                    >
                                        {isUpdating ? (
                                            <Feather name="loader" size={16} color="#fff" />
                                        ) : (
                                            <Feather name="check" size={16} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <>
                                <Text style={[styles.userName, { color: theme.COLORS.textPrimary }]}>{userName}</Text>
                                {userEmail ? <Text style={[styles.userEmail, { color: theme.COLORS.textSecondary }]}>{userEmail}</Text> : null}
                            </>
                        )}
                    </View>
                    {!isEditingName && (
                        <TouchableOpacity style={styles.editButton} onPress={handleStartEditing}>
                            <Feather name="edit-2" size={18} color={theme.COLORS.primary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Appearance Settings */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Appearance</Text>
                    <View style={[styles.settingsCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <SettingItem
                            icon="moon"
                            title="Dark Mode"
                            subtitle="Switch theme"
                            showArrow={false}
                            isLast={true}
                            rightComponent={
                                <CustomSwitch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Usage Settings */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Usage</Text>
                    <View style={[styles.settingsCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <SettingItem
                            icon="clock"
                            title="Daily Target"
                            subtitle={`${minutesToday}/${targetMinutes} minutes`}
                            onPress={handleChangeTarget}
                        />
                        <SettingItem
                            icon="check-circle"
                            title="Target Reached"
                            subtitle={reachedTarget ? "Yes" : "No"}
                            showArrow={false}
                            isLast={true}
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.supportSection}>
                    <Text style={[styles.sectionTitle, { color: theme.COLORS.textPrimary }]}>Support</Text>
                    <View style={[styles.settingsCard, { backgroundColor: theme.COLORS.lightGray, borderColor: theme.COLORS.border }]}>
                        <SettingItem
                            icon="help-circle"
                            title="Help & Support"
                            subtitle="Get help with the app"
                            onPress={handleSupport}
                        />
                        <SettingItem
                            icon="shield"
                            title="Privacy Policy"
                            subtitle="How we protect your data"
                            onPress={handlePrivacy}
                        />
                        <SettingItem
                            icon="info"
                            title="About"
                            subtitle="App version and info"
                            onPress={() => navigation.navigate('About')}
                            isLast={true}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* Logout confirmation modal */}
            <ConfirmModal
                visible={showLogoutModal}
                title="Logout"
                message="Are you sure you want to logout?"
                confirmLabel="Logout"
                cancelLabel="Cancel"
                type="destructive"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
            <TargetPickerModal
                visible={showTargetModal}
                selectedMinutes={targetMinutes}
                onSelect={async (m) => {
                    await setTargetMinutes(m);
                }}
                onClose={() => setShowTargetModal(false)}
            />
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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        lineHeight: 26,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginTop: 2,
        lineHeight: 18,
    },
    editButton: {
        padding: 8,
    },
    settingsSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    supportSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        fontWeight: '600',
        marginBottom: 16,
    },
    settingsCard: {
        borderRadius: 12,
        borderWidth: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        marginTop: 2,
        lineHeight: 18,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#EF4444',
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },
    editingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    editingButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    editActionButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    cancelEditButton: {
        borderWidth: 1,
        marginRight: 8,
    },
    saveEditButton: {
        borderWidth: 0,
    },
    nameInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        minHeight: 44,
    },
});

export default ProfileScreen; 