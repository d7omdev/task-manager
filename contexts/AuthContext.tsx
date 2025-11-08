import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { getAuthInstance } from '@/services/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuthInstance();
        if (!auth) {
            // Firebase not configured, use app without auth
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // Auto-sign in anonymously if no user
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error('Failed to sign in anonymously:', error);
                    setLoading(false);
                }
            } else {
                setUser(user);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignInAnonymously = async () => {
        const auth = getAuthInstance();
        if (!auth) return;
        await signInAnonymously(auth);
    };

    const handleSignOut = async () => {
        const auth = getAuthInstance();
        if (!auth) return;
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signInAnonymously: handleSignInAnonymously,
                signOut: handleSignOut,
            }}
        >
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

