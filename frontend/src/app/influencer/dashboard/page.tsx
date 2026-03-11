"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bot, LayoutDashboard, Briefcase, Star, DollarSign, Settings, LogOut, Search, Bell, Sparkles, Globe, Instagram, CheckCircle2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";

export default function InfluencerDashboard() {
    const { user, logout, isLoading, token, refreshUser } = useAuth();
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    // Verification states
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifyUsername, setVerifyUsername] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [verifiedProfile, setVerifiedProfile] = useState<any>(null);
    const [isSavingManual, setIsSavingManual] = useState(false);

    // Disconnect states
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
    const [disconnectUsername, setDisconnectUsername] = useState("");
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [disconnectError, setDisconnectError] = useState("");

    useEffect(() => {
        if (!isLoading && !user) router.push("/");
        if (!isLoading && user && user.role !== "influencer") router.push("/onboarding");

        if (!isLoading && user) {
            const searchParams = new URLSearchParams(window.location.search);
            const isConnected = searchParams.get("instagram_connected") === "true";
            const username = searchParams.get("username");
            const errorParam = searchParams.get("error");

            if (errorParam) {
                if (errorParam === "no_instagram_business_account") {
                    setErrorMsg("Your Facebook login worked, but it doesn't have a linked Instagram Professional Account. Convert your Instagram to Professional/Creator and link it to a Facebook Page to continue.");
                } else {
                    setErrorMsg(`Instagram connection failed: ${errorParam.replace(/_/g, ' ')}`);
                }
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (isConnected && username && !user.instagram_connected) {
                const fCount = searchParams.get("followers_count");
                const mCount = searchParams.get("media_count");

                const updatedUser = {
                    ...user,
                    instagram_connected: true,
                    instagram_username: username,
                    followers_count: fCount ? parseInt(fCount, 10) : 0,
                    media_count: mCount ? parseInt(mCount, 10) : 0
                };
                localStorage.setItem("la_user", JSON.stringify(updatedUser));
                refreshUser();

                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [user, isLoading, router, refreshUser]);

    const handleVerifyUsername = async () => {
        if (!verifyUsername.trim()) return;
        setIsVerifying(true);
        setVerifyError("");
        setVerifiedProfile(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/instagram/verify/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: verifyUsername.trim() }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to verify username");

            setVerifiedProfile(data);
        } catch (err: any) {
            setVerifyError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleManualConnect = async () => {
        if (!verifiedProfile) return;
        setIsSavingManual(true);
        setErrorMsg("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/instagram/manual/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    username: verifiedProfile.username,
                    followers_count: verifiedProfile.followers_count,
                    media_count: verifiedProfile.media_count,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to connect manually");

            const updatedUser = {
                ...user,
                instagram_connected: true,
                instagram_username: data.username,
                followers_count: data.followers_count || 0,
                media_count: data.media_count || 0
            };
            localStorage.setItem("la_user", JSON.stringify(updatedUser));
            refreshUser();
            setIsVerifyModalOpen(false);
            setVerifyUsername("");
            setVerifiedProfile(null);
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsSavingManual(false);
        }
    };

    const handleDisconnect = async () => {
        if (!disconnectUsername.trim()) return;
        setIsDisconnecting(true);
        setDisconnectError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/instagram/disconnect/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    confirm_username: disconnectUsername.trim(),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to disconnect");

            // Strip local storage of Instagram details safely
            const updatedUser = { ...user };
            delete updatedUser.instagram_connected;
            delete updatedUser.instagram_username;
            delete updatedUser.followers_count;
            delete updatedUser.media_count;

            localStorage.setItem("la_user", JSON.stringify(updatedUser));
            refreshUser();
            setIsDisconnectModalOpen(false);
            setDisconnectUsername("");
        } catch (err: any) {
            setDisconnectError(err.message);
        } finally {
            setIsDisconnecting(false);
        }
    };

    if (isLoading || !user) return null;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex text-black font-sans antialiased">
            {/* Sidebar - Precision Alignment */}
            <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col pt-10 px-8 pb-8 sticky top-0 h-screen z-20">
                <div className="flex items-center gap-3 mb-16">
                    <div className="w-8 h-8 bg-black rounded-[10px] flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[17px] font-bold tracking-tight">LaunchAngel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
                    <NavItem icon={<Briefcase size={18} />} label="Opportunities" />
                    <NavItem icon={<Star size={18} />} label="Performance" />
                    <NavItem icon={<DollarSign size={18} />} label="Earnings" />
                </nav>

                <div className="pt-8 space-y-2">
                    <NavItem icon={<Settings size={18} />} label="Settings" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-4 py-3 w-full text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-2xl transition-all font-bold text-[13px]"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-12 overflow-y-auto">
                <header className="flex items-center justify-between mb-20 bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                            {user.profile_picture ? <img src={user.profile_picture} alt="" /> : <div className="w-full h-full bg-apple-green/10" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none mb-1">Welcome, {user.first_name}.</h1>
                            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Global Status: Active</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {user.instagram_connected && (
                            <button
                                onClick={() => setIsDisconnectModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full border border-pink-100 hover:bg-pink-100 transition-colors shadow-sm mr-2"
                            >
                                <Instagram size={16} />
                                <span className="text-xs font-bold tracking-tight">@{user.instagram_username}</span>
                            </button>
                        )}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-zinc-50/50 border border-zinc-100 rounded-full py-2.5 pl-12 pr-6 w-64 text-[13px] font-medium focus:outline-none focus:bg-white focus:border-zinc-300 transition-all shadow-inner"
                            />
                        </div>
                        <button className="w-11 h-11 bg-white border border-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-50 transition-all shadow-sm">
                            <Bell size={18} className="text-zinc-400" />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <DashboardStat label="Current Offers" value="03" sub="2 from high-ROI brands" />
                    {user.instagram_connected ? (
                        <>
                            <DashboardStat
                                label="Instagram Followers"
                                value={user.followers_count ? formatNumber(user.followers_count) : "0"}
                                sub={user.followers_count === 0 ? "Pending API sync" : "Real-time Meta sync"}
                            />
                            <DashboardStat
                                label="Total Posts"
                                value={user.media_count ? formatNumber(user.media_count) : "0"}
                                sub={user.media_count === 0 ? "Pending API sync" : "from Public Profile"}
                            />
                        </>
                    ) : (
                        <>
                            <DashboardStat label="Projected Rev" value="$1.4k" sub="Next 14 day cycle" />
                            <DashboardStat label="Trust Score" value="98%" sub="Top 0.5% in platform" />
                        </>
                    )}
                </div>

                {errorMsg && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-[2rem] flex items-center gap-4 text-red-700">
                        <AlertTriangle className="w-8 h-8 shrink-0" />
                        <p className="font-bold text-sm leading-snug">{errorMsg}</p>
                    </div>
                )}

                {/* Instagram Integration Section (Only show if NOT connected) */}
                {!user.instagram_connected && (
                    <section className="mb-16 bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:shadow-xl hover:shadow-zinc-100 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                                <Instagram className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight mb-1 text-zinc-900">Instagram Integration</h3>
                                <p className="text-sm font-medium text-zinc-500">
                                    Connect your account to enable AI analytics and brand matching.
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex justify-end">
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.launchangel.app/api'}/users/auth/instagram/connect?token=${token}`}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-sm rounded-full shadow-xl hover:opacity-90 active:scale-95 transition-all w-full md:w-auto"
                                >
                                    Login with Instagram
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Section Activity */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-2 mb-6 text-black">
                        <h3 className="text-[18px] font-black tracking-tight">Agent Matching Opportunities</h3>
                        <Globe size={18} className="text-zinc-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <Opportunity brand="EcoWear" est="$450" tag="High Match" color="bg-apple-blue" />
                        <Opportunity brand="Lumina Tech" est="$1.2k+" tag="Script Ready" color="bg-apple-purple" />
                        <Opportunity brand="FreshBite" est="$300" tag="Automated" color="bg-apple-green" />
                    </div>
                </section>
            </main>

            {/* Disconnect Modal */}
            {isDisconnectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => { setIsDisconnectModalOpen(false); setDisconnectError(""); setDisconnectUsername(""); }}
                            className="absolute top-6 right-6 p-2 bg-zinc-50 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight mb-2">Disconnect Instagram</h2>
                        <p className="text-zinc-500 text-sm font-medium mb-6 leading-relaxed">
                            This will remove your account from our automated matching engine. Please type <span className="font-bold text-black border-b border-black/20 pb-0.5">@{user?.instagram_username}</span> to confirm.
                        </p>

                        {disconnectError && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                {disconnectError}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder={`@${user?.instagram_username}`}
                            value={disconnectUsername}
                            onChange={(e) => setDisconnectUsername(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:border-red-400 focus:bg-white transition-all mb-6"
                        />

                        <button
                            onClick={handleDisconnect}
                            disabled={isDisconnecting || disconnectUsername.replace("@", "") !== user?.instagram_username}
                            className="w-full py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                        >
                            {isDisconnecting ? "Disconnecting..." : "Confirm Disconnect"}
                        </button>
                    </div>
                </div>
            )}
            {/* Connect Username Modal */}
            {isVerifyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => { setIsVerifyModalOpen(false); setVerifyError(""); setVerifyUsername(""); setVerifiedProfile(null); }}
                            className="absolute top-6 right-6 p-2 bg-zinc-50 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                            <Instagram className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tight mb-2">Connect by Username</h2>

                        {verifyError && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                {verifyError}
                            </div>
                        )}

                        {!verifiedProfile ? (
                            <>
                                <p className="text-zinc-500 text-sm font-medium mb-6 leading-relaxed">
                                    Enter your public Instagram handle. We will securely fetch your public profile data for verification.
                                </p>
                                <input
                                    type="text"
                                    placeholder="@username"
                                    value={verifyUsername}
                                    onChange={(e) => setVerifyUsername(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all mb-6"
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyUsername(); }}
                                />
                                <button
                                    onClick={handleVerifyUsername}
                                    disabled={isVerifying || !verifyUsername.trim()}
                                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg"
                                >
                                    {isVerifying ? "Verifying Profile..." : "Verify Identity"}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-zinc-500 text-sm font-medium mb-6 leading-relaxed">
                                    Is this your correct Instagram account?
                                </p>

                                <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl mb-8 flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-200 shrink-0 bg-white flex items-center justify-center text-zinc-300">
                                        {verifiedProfile.profile_pic ? (
                                            <img src={verifiedProfile.profile_pic} alt="" className="w-full h-full object-cover" />
                                        ) : <Bot size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight mb-1">{verifiedProfile.name}</h4>
                                        <p className="text-sm font-medium text-zinc-500 mb-2">@{verifiedProfile.username}</p>
                                        <div className="flex gap-4 text-xs font-bold text-zinc-600">
                                            <span>{formatNumber(verifiedProfile.followers_count)} Followers</span>
                                            <span>{formatNumber(verifiedProfile.media_count)} Posts</span>
                                        </div>
                                    </div>
                                </div>

                                {verifiedProfile.warning && (
                                    <div className="mb-6 p-4 bg-amber-50 text-amber-700 text-sm font-medium rounded-xl border border-amber-100">
                                        Unable to actively fetch real-time analytics due to Meta scraping protections. Account will still connect internally.
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setVerifiedProfile(null)}
                                        className="flex-1 py-4 bg-zinc-100 text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                                        disabled={isSavingManual}
                                    >
                                        Not Me
                                    </button>
                                    <button
                                        onClick={handleManualConnect}
                                        disabled={isSavingManual}
                                        className="flex-[2] py-4 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg"
                                    >
                                        {isSavingManual ? "Saving..." : "Yes, Connect"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link
            href="#"
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-[13px] ${active ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black hover:bg-zinc-50"
                }`}
        >
            {icon} {label}
        </Link>
    );
}

function DashboardStat({ label, value, sub }: { label: string, value: string, sub: string }) {
    return (
        <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-100 transition-all group">
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-3">{label}</p>
            <h2 className="text-[42px] font-black tracking-tighter mb-4 text-black">{value}</h2>
            <p className="text-zinc-400 text-[12px] font-medium">{sub}</p>
        </div>
    );
}

function Opportunity({ brand, est, tag, color }: { brand: string, est: string, tag: string, color: string }) {
    return (
        <div className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between hover:border-black/10 hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-500">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl ${color} opacity-[0.08] flex items-center justify-center group-hover:opacity-100 transition-opacity`}>
                    <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                    <h4 className="font-black text-[18px] tracking-tight">{brand}</h4>
                    <p className="text-zinc-400 text-sm font-medium">{est} estimated earnings</p>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <span className="px-5 py-2 bg-zinc-50 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">{tag}</span>
                <button className="h-12 px-6 bg-black text-white font-bold text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 shadow-lg">
                    Review Script
                </button>
            </div>
        </div>
    );
}
