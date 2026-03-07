"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap, TrendingUp, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LandingPage() {
  const { login, user, logout } = useAuth();


  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            LaunchAngel
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400 font-sans">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 font-sans">
              <span className="text-zinc-400 text-sm">Hi, {user.first_name}</span>
              <button
                onClick={logout}
                className="px-5 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all font-sans"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => login("startup")}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all text-sm font-sans"
            >
              <Bot className="w-4 h-4" />
              Continue with Google
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Next-Gen Influencer Marketing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8"
        >
          Autonomous <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
            Growth Agents
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-12"
        >
          Stop managing influencers. Start managing growth. Our AI agents autonomously plan,
          execute, and optimize your marketing campaigns from start to finish.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="h-14 px-8 flex items-center gap-2 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 transition-all text-lg shadow-2xl shadow-white/5">
            Launch Your Campaign <ArrowRight size={20} />
          </button>
          <button className="h-14 px-8 flex items-center gap-2 bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg">
            Watch Demo
          </button>
        </motion.div>

        {/* Floating UI Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 40 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 w-full max-w-5xl aspect-video rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-2xl overflow-hidden relative shadow-2xl shadow-purple-500/10"
        >
          <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="p-12 text-left grid grid-cols-3 gap-8 h-full">
            <div className="col-span-1 space-y-4 pt-4">
              <div className="h-4 w-2/3 bg-white/10 rounded-md" />
              <div className="h-32 w-full bg-white/5 rounded-xl border border-white/10" />
              <div className="h-4 w-1/2 bg-white/10 rounded-md" />
              <div className="h-24 w-full bg-white/5 rounded-xl border border-white/10" />
            </div>
            <div className="col-span-2 pt-4 flex flex-col items-center justify-center border-l border-white/5 pl-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full mb-6 blur-2xl opacity-20 absolute" />
              <Zap className="w-12 h-12 text-purple-500 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold mb-2">Analyzing Content DNA...</h3>
              <p className="text-zinc-500 text-sm">Identifying top 30 hooks and audience sentiment</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="text-blue-500" />}
            title="Predictive Analytics"
            description="Our agents use historical performance data to predict the ROI of every creator before you spend a dime."
          />
          <FeatureCard
            icon={<Bot className="text-purple-500" />}
            title="Style-Matched Hooks"
            description="AI generates scripts that perfectly mirror a creator's natural content style for maximum authenticity."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-cyan-500" />}
            title="Auto-Review Pipeline"
            description="Forget manual checking. Our agents verify video quality, hook strength, and brand safety automatically."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-8 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe size={16} />
          <span>Deployed worldwide via Google Cloud Run</span>
        </div>
        <p>&copy; 2026 LaunchAngel. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
