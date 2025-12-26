import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let profileUnsub: (() => void) | null = null;

        const unsubAuth = onAuthStateChanged(auth, (u) => {
            setUser(u);

            // Cleanup previous profile listener
            if (profileUnsub) {
                profileUnsub();
                profileUnsub = null;
            }

            if (u) {
                // Listen to Firestore profile in real-time
                profileUnsub = onSnapshot(
                    doc(db, 'users', u.uid),
                    (snap) => {
                        if (snap.exists()) {
                            setProfile(snap.data() as UserProfile);
                        } else if (u.displayName) {
                            // Fallback to auth profile if Firestore doc doesn't exist
                            setProfile({ name: u.displayName, email: u.email || '' });
                        }
                    },
                    (err) => console.log('Profile listener error', err)
                );
            } else {
                setProfile(null);
            }

            setIsLoading(false);
        });

        return () => {
            unsubAuth();
            if (profileUnsub) profileUnsub();
        };
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 