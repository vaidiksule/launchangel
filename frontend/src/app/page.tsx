"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";
import { Bot, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  const { login, user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-black font-sans antialiased overflow-hidden flex flex-col">
      {/* Delicate Grid Background */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-[0.2] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#fafafa_80%)] pointer-events-none z-0" />

      {/* Ambient Glows */}
      <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-teal-300/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[15%] w-[700px] h-[700px] bg-green-400/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Robust Capsule Navbar */}
      <header className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-8">
        <div className="flex items-center justify-between h-14 min-w-[480px] px-8 bg-white/70 backdrop-blur-2xl rounded-full border border-zinc-200/50 shadow-[0_12px_44px_-10px_rgba(0,0,0,0.06)] relative">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-[11px] flex items-center justify-center shadow-md">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[14px] font-bold tracking-tight">LaunchAngel</span>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user.role ? (user.role === "startup" ? "/startup/dashboard" : "/influencer/dashboard") : "/onboarding"}
                  className="h-10 px-6 flex items-center justify-center bg-black text-white text-[12px] font-bold rounded-full hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-10 h-10 flex items-center justify-center text-zinc-300 hover:text-black transition-colors"
                >
                  <span className="text-2xl font-light leading-none">&times;</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="h-10 px-8 bg-black text-white text-[12px] font-bold rounded-full hover:bg-zinc-900 transition-all shadow-lg active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mathematically Centered Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-24">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/60 shadow-sm mb-12"
          >
            <Sparkles size={14} className="text-zinc-400" />
            <span className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">The AI Growth Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[44px] sm:text-[64px] md:text-[84px] font-semibold tracking-[-0.03em] leading-[1.05] text-zinc-900 mb-8"
          >
            Hire an AI marketing team
            <br />
            <span className="text-zinc-400">for your next campaign.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[18px] md:text-[21px] text-zinc-500 font-normal leading-[1.6] max-w-2xl mb-16"
          >
            LaunchAngel discovers hidden viral creators, negotiates rates automatically, and predicts campaign ROI—letting you scale your brand effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <button
              onClick={() => login()}
              className="h-[72px] px-16 bg-black text-white font-bold rounded-[22px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] hover:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.35)] hover:bg-zinc-900 transition-all flex items-center justify-center gap-4 text-[18px] active:scale-[0.98]"
            >
              Launch App <ChevronRight size={22} />
            </button>
          </motion.div>

        </div>
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="relative z-10 py-16 px-12 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-zinc-50 mx-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-apple-green shadow-[0_0_10px_rgba(52,199,89,0.35)]" />
          <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em]">Operational Readiness 100%</span>
        </div>
        <div className="flex gap-16 text-[12px] font-medium text-zinc-400 tracking-wide">
          <Link href="/privacy-policy" className="hover:text-black transition-colors cursor-pointer">Privacy Policy</Link>
          <Link href="/terms-and-service" className="hover:text-black transition-colors cursor-pointer">Terms of Service</Link>
          <span className="text-zinc-400">&copy; 2026 LaunchAngel Corp</span>
        </div>
      </footer>

    </div>
  );
}
