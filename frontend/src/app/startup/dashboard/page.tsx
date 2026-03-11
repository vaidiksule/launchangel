"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bot, LayoutDashboard, Send, Users, BarChart3, Settings, LogOut, Search, Bell, Globe, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function StartupDashboard() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.push("/");
        if (!isLoading && user && user.role !== "startup") router.push("/onboarding");
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex text-black font-sans antialiased">
            {/* Sidebar - Precision Grid Alignment */}
            <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col pt-10 px-8 pb-8 sticky top-0 h-screen z-20">
                <div className="flex items-center gap-3 mb-16 px-2">
                    <div className="w-9 h-9 bg-black rounded-[12px] flex items-center justify-center shadow-xl">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[18px] font-bold tracking-tight">LaunchAngel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
                    <NavItem icon={<Send size={18} />} label="Campaigns" />
                    <NavItem icon={<Users size={18} />} label="Creator Pool" />
                    <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
                </nav>

                <div className="pt-8 space-y-2 border-t border-zinc-50">
                    <NavItem icon={<Settings size={18} />} label="Settings" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3.5 w-full text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-2xl transition-all font-bold text-[13px]"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-12 overflow-y-auto">
                <header className="flex items-center justify-between mb-20 bg-white/40 backdrop-blur-md p-6 rounded-[3rem] border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-5 pl-4">
                        <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-inner">
                            {user.profile_picture ? <img src={user.profile_picture} alt="" /> : <div className="w-full h-full bg-apple-blue/10 flex items-center justify-center font-bold text-apple-blue">LA</div>}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight leading-none mb-2">Welcome, {user.first_name}.</h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">AI Agents Initializing...</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="bg-zinc-50/50 border border-zinc-100 rounded-full py-3.5 pl-14 pr-8 w-80 text-[13px] font-medium focus:outline-none focus:bg-white focus:border-zinc-300 transition-all"
                            />
                        </div>
                        <button className="w-12 h-12 bg-white border border-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-50 transition-all shadow-sm">
                            <Bell size={18} className="text-zinc-400" />
                        </button>
                    </div>
                </header>

                {/* Global Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <StatBox label="Active Campaigns" value="04" delta="+2 this cycle" />
                    <StatBox label="Total Reach" value="2.4M" delta="+120k week-over-week" />
                    <StatBox label="Conversion Est." value="4.2x" delta="Market leading" />
                </div>

                {/* Action Board */}
                <section className="grid grid-cols-12 gap-10">
                    <div className="col-span-8">
                        <div className="bg-white rounded-[4rem] border border-zinc-100 p-16 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-700">
                            <div className="w-24 h-24 bg-apple-blue/5 rounded-[2.5rem] flex items-center justify-center mb-10 transform hover:rotate-12 transition-transform">
                                <BarChart3 className="w-12 h-12 text-apple-blue" />
                            </div>
                            <h3 className="text-[28px] font-black tracking-tight mb-4">Deploy First Agent</h3>
                            <p className="text-zinc-500 text-lg max-w-sm mb-12 font-medium leading-relaxed">
                                Configure your growth objectives and let our agents curate the perfect creator workforce.
                            </p>
                            <button className="h-16 px-12 bg-black text-white font-bold rounded-2xl shadow-2xl hover:bg-zinc-900 transition-all active:scale-[0.98] flex items-center gap-3 text-lg">
                                Launch Agent <ArrowPointer size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="bg-white rounded-[3rem] border border-zinc-100 p-10 h-full shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black tracking-tight">Recent Intelligence</h3>
                                <Sparkles size={20} className="text-zinc-200" />
                            </div>
                            <div className="space-y-10">
                                <FeedItem text="Agent discovered 8 niche influencers" time="2h ago" type="discovery" />
                                <FeedItem text="Content script 'Summer Launch' ready" time="5h ago" type="content" />
                                <FeedItem text="Infrastructure verification complete" time="Yesterday" type="system" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ArrowPointer({ size }: { size: number }) {
    return <ChevronRight size={size} />;
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href="#"
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-[13px] ${active ? "bg-black text-white shadow-xl" : "text-zinc-400 hover:text-black hover:bg-zinc-50"
                }`}
        >
            {icon} {label}
        </Link>
    );
}

function StatBox({ label, value, delta }: { label: string, value: string, delta: string }) {
    return (
        <div className="bg-white p-12 rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-zinc-100 transition-all group">
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em] mb-4">{label}</p>
            <h2 className="text-[48px] font-black tracking-tighter mb-4 text-black">{value}</h2>
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-apple-green" />
                <p className="text-apple-green text-[12px] font-black uppercase tracking-widest">{delta}</p>
            </div>
        </div>
    );
}

function FeedItem({ text, time, type }: { text: string, time: string, type: string }) {
    return (
        <div className="flex gap-5 group">
            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${type === "discovery" ? "bg-apple-blue" : type === "content" ? "bg-apple-purple" : "bg-zinc-200"
                }`} />
            <div>
                <p className="text-[14px] font-bold leading-relaxed text-black group-hover:text-zinc-600 transition-colors">{text}</p>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mt-1.5">{time}</p>
            </div>
        </div>
    );
}
