"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

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
    login: (token: string, role?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Rehydrate auth state
        const savedToken = Cookies.get("la_token");
        const savedUser = localStorage.getItem("la_user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (googleToken: string, role: string = "startup") => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/auth/google/`, {
                token: googleToken,
                role: role
            });

            const { token: backendToken, user: userData } = response.data;

            setToken(backendToken);
            setUser(userData);

            // Save to storage
            Cookies.set("la_token", backendToken, { expires: 7 });
            localStorage.setItem("la_user", JSON.stringify(userData));
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        Cookies.remove("la_token");
        localStorage.removeItem("la_user");
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
