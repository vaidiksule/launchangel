"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-sans antialiased flex flex-col items-center">
            {/* Delicate Grid Background */}
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-[0.2] z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#fafafa_80%)] pointer-events-none z-0" />

            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-apple-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-apple-purple/5 blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Nav */}
            <nav className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-medium">
                    <ArrowLeft size={18} />
                    <span>Back to Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Shield size={18} className="text-zinc-400" />
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Legal</span>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-24 flex flex-col">
                <div className="bg-white/60 backdrop-blur-xl border border-zinc-200/80 rounded-[32px] p-12 md:p-16 shadow-sm">
                    <h1 className="text-[32px] md:text-[42px] font-semibold tracking-[-0.03em] mb-4 text-zinc-900">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500 mb-12 font-medium">Last updated: March 2026</p>

                    <div className="space-y-12 text-[15px] leading-relaxed text-zinc-600">
                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">1. Information We Collect</h2>
                            <p className="mb-4">
                                At LaunchAngel, we collect information that you voluntarily provide to us when you register on the LaunchAngel App, express an interest in obtaining information about us or our products and Services, when you participate in activities on the App or otherwise when you contact us.
                            </p>
                            <p>
                                The personal information that we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">2. How We Use Your Information</h2>
                            <p className="mb-4">
                                We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To facilitate account creation and logon process.</li>
                                <li>To post testimonials with your consent.</li>
                                <li>Request feedback and contact you about your use of our App.</li>
                                <li>To enable user-to-user communications with your consent.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">3. Data Security & Storage</h2>
                            <p className="mb-4">
                                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, given the nature of the internet, we cannot guarantee that unauthorized parties will never be able to defeat our security measures and improperly collect, access, steal, or modify your personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">4. AI and Autonomous Agents</h2>
                            <p className="mb-4">
                                LaunchAngel utilizes autonomous AI agents to research and orchestrate creator workflows. Data processed by our AI agents is anonymized where possible and utilized specifically for the explicit marketing goals bound within the application. We do not sell your personal data to external AI training repositories.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">5. Contact Us</h2>
                            <p className="mb-4">
                                If you have questions or comments about this notice, you may email us at privacy@launchangel.app or by post to:
                            </p>
                            <p className="font-medium text-zinc-800">
                                LaunchAngel Corp.<br />
                                100 Innovation Drive<br />
                                San Francisco, CA 94111
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
