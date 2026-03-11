"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsOfServicePage() {
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
                    <Scale size={18} className="text-zinc-400" />
                    <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Legal</span>
                </div>
            </nav>

            {/* Content */}
            <main className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-24 flex flex-col">
                <div className="bg-white/60 backdrop-blur-xl border border-zinc-200/80 rounded-[32px] p-12 md:p-16 shadow-sm">
                    <h1 className="text-[32px] md:text-[42px] font-semibold tracking-[-0.03em] mb-4 text-zinc-900">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500 mb-12 font-medium">Last updated: March 2026</p>

                    <div className="space-y-12 text-[15px] leading-relaxed text-zinc-600">
                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">1. Agreement to Terms</h2>
                            <p className="mb-4">
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and LaunchAngel Corp ("Company," "we," "us," or "our"), concerning your access to and use of the LaunchAngel web application.
                            </p>
                            <p>
                                You agree that by accessing the App, you have read, understood, and agreed to be bound by all of these Terms of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">2. Intellectual Property Rights</h2>
                            <p className="mb-4">
                                Unless otherwise indicated, the App is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">3. User Representations</h2>
                            <p className="mb-4">
                                By using the App, you represent and warrant that:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You will not use the App for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">4. AI Capabilities and Fair Use</h2>
                            <p className="mb-4">
                                Our autonomous agents operate on advanced AI models. Brands and Creators using automated script generation, reach prediction, or outreach systems agree to review all generated content. LaunchAngel Corp is not liable for errors in factual accuracy generated by autonomous sub-agents on behalf of your brand.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">5. AI Model and Usage Restrictions</h2>
                            <p className="mb-4">
                                Accessing our AI-driven systems through unauthorized APIs, reverse-engineering our autonomous orchestrations, or extracting proprietary matching weights is strictly prohibited and will result in immediate termination of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-semibold text-zinc-900 mb-4 tracking-tight">6. Contact Us</h2>
                            <p className="mb-4">
                                In order to resolve a complaint regarding the App or to receive further information regarding use of the App, please contact us at terms@launchangel.app.
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
