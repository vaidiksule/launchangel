"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, UserCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
    const { user, isLoading, token, refreshUser } = useAuth();
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!isLoading && user?.role) {
            router.push(user.role === "startup" ? "/startup/dashboard" : "/influencer/dashboard");
        }
    }, [user, isLoading, router]);

    const handleRoleSelection = async (role: "startup" | "influencer") => {
        if (!token) return;
        setIsUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-role/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, role }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("la_user", JSON.stringify(data.user));
                refreshUser();
                router.push(role === "startup" ? "/startup/dashboard" : "/influencer/dashboard");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to update role. Please try again.");
            }
        } catch (error) {
            console.error("Failed to update role:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-sans antialiased flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Delicate Grid Background */}
            <div className="absolute inset-0 bg-grid pointer-events-none opacity-[0.2] z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#fafafa_80%)] pointer-events-none z-0" />

            {/* Ambient Glows */}
            <div className="absolute top-[5%] left-[15%] w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-teal-300/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[30%] left-[30%] w-[700px] h-[700px] bg-green-400/5 blur-[140px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-4xl w-full flex flex-col items-center"
            >
                {/* Soft Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/60 shadow-sm mb-8">
                    <Sparkles size={14} className="text-zinc-400" />
                    <span className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">Account Setup</span>
                </div>

                {/* Refined Typography */}
                <h1 className="text-[36px] sm:text-[44px] md:text-[52px] font-semibold tracking-[-0.03em] mb-4 text-center text-zinc-900">
                    How will you use LaunchAngel?
                </h1>
                <p className="text-zinc-500 text-[16px] md:text-[18px] font-normal mb-16 text-center max-w-xl leading-relaxed">
                    Select your primary goal to help us tailor your dashboard and autonomous agent capabilities.
                </p>

                {/* Premium Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
                    <RoleItem
                        icon={<Building2 size={32} className="text-zinc-800 group-hover:text-black transition-colors" />}
                        title="Brand / Company"
                        desc="Discover authentic voices. Leverage AI agents to analyze creator performance, negotiate rates, and track campaign ROI in real-time."
                        onClick={() => !isUpdating && handleRoleSelection("startup")}
                        loading={isUpdating}
                    />
                    <RoleItem
                        icon={<UserCircle2 size={32} className="text-zinc-800 group-hover:text-black transition-colors" />}
                        title="Creator / Influencer"
                        desc="Simplify your brand deals. Get incoming collaboration requests, automate your script drafting, and track your pending payments."
                        onClick={() => !isUpdating && handleRoleSelection("influencer")}
                        loading={isUpdating}
                    />
                </div>

                <div className="mt-20">
                    <p className="text-zinc-400 text-[12px] font-medium tracking-wide">LaunchAngel Intelligence Platform &copy; 2026</p>
                </div>
            </motion.div>
        </div>
    );
}

function RoleItem({ icon, title, desc, onClick, loading }: {
    icon: React.ReactNode,
    title: string,
    desc: string,
    onClick: () => void,
    loading: boolean
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            aria-disabled={loading}
            className={`group relative p-8 rounded-[24px] bg-white/60 backdrop-blur-xl border border-zinc-200/80 text-left hover:border-zinc-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-zinc-400 cursor-pointer overflow-hidden ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Subtle top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon Container */}
            <div className="mb-6 transform group-hover:scale-105 transition-transform duration-500">
                {icon}
            </div>

            {/* Card Content - Refined weights */}
            <h3 className="text-[20px] font-semibold mb-2 tracking-tight text-zinc-900 w-full">{title}</h3>
            <p className="text-zinc-500 text-[14px] font-normal leading-[1.6] mb-8 w-full">
                {desc}
            </p>

            {/* Subtle Action Link */}
            <div className="mt-auto flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 font-medium text-[13px] transition-colors w-full">
                Continue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
}
