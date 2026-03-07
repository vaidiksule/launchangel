"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: "startup" | "influencer";
    profile_picture?: string;
    startup_profile?: any;
    influencer_profile?: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (role?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Handle Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Get the latest ID token from Firebase
                const firebaseToken = await firebaseUser.getIdToken();
                const savedUser = localStorage.getItem("la_user");

                if (savedUser) {
                    setToken(firebaseToken);
                    setUser(JSON.parse(savedUser));
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

    const login = async (role: string = "startup") => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseToken = await result.user.getIdToken();

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/auth/google/`, {
                token: firebaseToken,
                role: role
            });

            const { token: backendToken, user: userData } = response.data;

            setToken(firebaseToken);
            setUser(userData);

            // Save to storage (persistent user data)
            Cookies.set("la_token", firebaseToken, { expires: 7 });
            localStorage.setItem("la_user", JSON.stringify(userData));
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
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
