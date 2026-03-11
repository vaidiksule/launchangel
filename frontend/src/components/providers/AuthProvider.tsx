"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: "startup" | "influencer" | null;
    profile_picture?: string;
    instagram_connected?: boolean;
    instagram_username?: string;
    followers_count?: number;
    media_count?: number;
    startup_profile?: any;
    influencer_profile?: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (role?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = () => {
        const savedUser = localStorage.getItem("la_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    };

    useEffect(() => {
        // Handle Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get the latest ID token from Firebase
                    const firebaseToken = await firebaseUser.getIdToken();
                    const savedUser = localStorage.getItem("la_user");

                    if (savedUser) {
                        setToken(firebaseToken);
                        setUser(JSON.parse(savedUser));
                    }

                    // Always sync with backend to ensure the user's role and data are up-to-date
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/google/`, {
                        token: firebaseToken,
                    });

                    const { token: backendToken, user: userData } = response.data;
                    setToken(firebaseToken);
                    setUser(userData);
                    Cookies.set("la_token", firebaseToken, { expires: 7 });
                    localStorage.setItem("la_user", JSON.stringify(userData));

                } catch (error) {
                    console.error("Failed to sync auth state with backend:", error);
                }
            } else {
                setToken(null);
                setUser(null);
                localStorage.removeItem("la_user");
                Cookies.remove("la_token");
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (defaultValue: string = "") => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseToken = await result.user.getIdToken();

            // We don't send a role here anymore, let the user choose in onboarding if they don't have one
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/google/`, {
                token: firebaseToken,
            });

            const { token: backendToken, user: userData } = response.data;

            setToken(firebaseToken);
            setUser(userData);

            // Save to storage
            Cookies.set("la_token", firebaseToken, { expires: 7 });
            localStorage.setItem("la_user", JSON.stringify(userData));

            // Role-based redirection
            if (!userData.role) {
                router.push("/onboarding");
            } else if (userData.role === "startup") {
                router.push("/startup/dashboard");
            } else if (userData.role === "influencer") {
                router.push("/influencer/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setToken(null);
        setUser(null);
        Cookies.remove("la_token");
        localStorage.removeItem("la_user");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
