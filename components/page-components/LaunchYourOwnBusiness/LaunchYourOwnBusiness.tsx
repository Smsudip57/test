"use client"
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "./sections/Navbar";
import { Input } from "./sections/Input";
import { BrandTrust } from "./sections/BrandTrust";
import { Footer } from "./sections/Footer";
import { WhatsAppButton } from "./sections/WhatsAppButton";
import { LeadPopup } from "./sections/LeadPopup";
import { AITransformationRobot } from "./sections/AITransformationRobot";

interface Form {
    name: string;
    company: string;
    email: string;
    industry: string;
}

interface HeroProps {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    submitLead: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface ProblemSolutionProps {
    setLeadOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PricingProps {
    setLeadOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FinalCTAProps {
    setLeadOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const pains = [
    "Managing everything in Excel & WhatsApp",
    "No proper customer and invoice system",
    "Expensive or complex software setup",
    "No technical support when you need it",
    "Wasting time on repeated manual work",
];

const outcomes = [
    "All-in-one business system",
    "Automated invoicing & CRM",
    "Professional business website",
    "Microsoft 365 business email",
    "Local UAE setup support",
];

const packageItems = [
    {
        icon: "🌐",
        title: "Business Website",
        subtitle: "Professional, mobile-ready website",
        points: ["5-page website", "SEO-ready structure", "Fast & secure", "Contact forms"],
        visual: "Website Preview",
    },
    {
        icon: "⚙️",
        title: "ERP System",
        subtitle: "CRM, invoices, customers & reports",
        points: ["Invoicing & payments", "CRM tracking", "Inventory management", "Real-time reports"],
        visual: "ERP Dashboard",
    },
    {
        icon: "📧",
        title: "Microsoft 365",
        subtitle: "Business email, Teams & cloud storage",
        points: ["Professional email", "Teams collaboration", "OneDrive storage", "Secure & reliable"],
        visual: "M365 Apps",
    },
];

const steps = [
    ["📝", "Submit Details", "Tell us about your business in a few minutes."],
    ["🧩", "We Set Everything Up", "Our team configures your website, ERP and Microsoft 365."],
    ["🚀", "Delivered in 48 Hours", "We deliver everything ready to use."],
    ["📈", "You Start Operating", "Log in and start running your business easier."],
];

const plans = [
    {
        name: "Starter",
        price: "AED 99",
        icon: "✈️",
        features: ["Website landing page", "Business email", "Basic support"],
    },
    {
        name: "Growth",
        price: "AED 299",
        icon: "🚀",
        popular: true,
        features: ["Website 5+ pages", "ERP system", "Microsoft 365 setup", "Automation", "Priority support"],
    },
    {
        name: "Pro",
        price: "AED 999",
        icon: "👑",
        features: ["Everything in Growth", "Advanced automation", "Custom integrations", "Dedicated support"],
    },
];

const testimonials = [
    {
        name: "Ahmed R.",
        role: "CEO, Al Huda Trading",
        quote: "WEBME set up our entire business system in 48 hours. Everything is organized and easy to manage.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80",
    },
    {
        name: "Sara M.",
        role: "Founder, Click Interiors",
        quote: "From website to invoicing and email — everything works seamlessly. Highly recommended for UAE businesses.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    },
    {
        name: "Zain A.",
        role: "Operations Manager, TechBox LLC",
        quote: "Great support, fast setup and very affordable. The best decision for our growing company.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    },
];

export default function WebmeOfferLandingPage() {
    const [leadOpen, setLeadOpen] = useState(false);
    const [form, setForm] = useState({ name: "", company: "", email: "", industry: "" });

    const submitLead = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLeadOpen(true);
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#f7fbff] text-[#07123a]">
            <Navbar />
            <Hero form={form} setForm={setForm} submitLead={submitLead} />
            <PackageSection />
            <BrandTrust />
            <ProblemSolution setLeadOpen={setLeadOpen} />
            <HowItWorks />
            <Pricing setLeadOpen={setLeadOpen} />
            <Testimonials />
            <FinalCTA setLeadOpen={setLeadOpen} />
            <Footer />
            <WhatsAppButton />
            <LeadPopup open={leadOpen} setOpen={setLeadOpen} form={form} />
        </main>
    );
}

function Hero({ form, setForm, submitLead }: HeroProps) {
    return (
        <section className="relative overflow-hidden px-4 py-10 md:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,251,255,0.98)_0%,rgba(247,251,255,0.88)_42%,rgba(247,251,255,0.55)_100%),url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(0,95,255,0.12),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(20,184,166,0.12),transparent_28%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f7fbff] to-transparent" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                    <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-wider text-blue-700 shadow-sm backdrop-blur">◎ Abu Dhabi-ready all-in-one business system</div>
                    <h1 className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                        Launch Your Complete Business System in <span className="text-[#0647d8]">48 Hours</span> 🚀
                    </h1>
                    <p className="mt-5 text-xl font-black text-[#07123a]">Website + ERP + Microsoft 365</p>
                    <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">Everything you need to start, run and grow your business — in one affordable package built for UAE startups and growing companies.</p>

                    <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-[auto_1fr]">
                        <div className="rounded-[28px] border border-emerald-100 bg-white/90 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur">
                            <div className="text-xs font-black uppercase text-emerald-600">Starting from</div>
                            <div className="mt-2 text-4xl font-black text-emerald-600">AED 99</div>
                            <div className="text-xs font-bold text-slate-500">/month</div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[["⏱️", "Setup in 48 Hours"], ["🛡️", "No Commitment"], ["🎧", "UAE Based Support"]].map(([icon, text]) => (
                                <div key={text} className="rounded-2xl border border-white bg-white/85 p-4 text-center shadow-sm backdrop-blur">
                                    <div className="text-2xl">{icon}</div>
                                    <div className="mt-2 text-xs font-black text-slate-700">{text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative">
                    <div className="absolute -inset-8 rounded-[42px] bg-gradient-to-br from-blue-200/30 via-white to-teal-200/30 blur-2xl" />
                    <div className="relative overflow-hidden rounded-[34px] border border-slate-100 bg-white/92 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100 blur-3xl" />
                        <h2 className="relative text-2xl font-black">Start Your Free Business Setup</h2>
                        <p className="relative mt-2 text-sm font-semibold text-slate-500">No credit card required. 100% free consultation.</p>
                        <form onSubmit={submitLead} className="relative mt-6 space-y-4">
                            <Input icon="👤" placeholder="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                            <Input icon="🏢" placeholder="Company Name" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                            <Input icon="✉️" placeholder="Your Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                            <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                                <option value="">Select Industry</option>
                                <option>Startup</option><option>Retail</option><option>Trading</option><option>Services</option><option>Manufacturing</option><option>Construction</option>
                            </select>
                            <button className="w-full rounded-2xl bg-[#0647d8] px-6 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(6,71,216,0.25)] transition hover:scale-[1.01]">Start Free Setup →</button>
                        </form>
                        <div className="relative mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-slate-500">
                            <span>✅ 100% Free</span><span>✉️ No Credit Card</span><span>⚡ Instant Setup</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function ProblemSolution({ setLeadOpen }: ProblemSolutionProps) {
    const painIcons = ["📊", "🧾", "💸", "🆘", "⏳"];
    const outcomeIcons = ["🧩", "⚙️", "🌐", "📧", "🎧"];
    const [progress, setProgress] = useState(0);
    const [direction, setDirection] = useState(1);
    const [vibe, setVibe] = useState(false);
    const [auto, setAuto] = useState(true);

    const stageText = progress < 35 ? "Business Chaos" : progress < 75 ? "WEBME is simplifying..." : "Full Business Control";
    const stageColor = progress < 35 ? "text-red-500" : progress < 75 ? "text-[#0647d8]" : "text-green-600";

    useEffect(() => {
        if (!auto) return;

        const id = setInterval(() => {
            setProgress((current) => {
                let next = current + direction;

                if (next >= 100) {
                    next = 100;
                    setDirection(-1);
                    setVibe(true);
                    window.setTimeout(() => setVibe(false), 250);
                }

                if (next <= 0) {
                    next = 0;
                    setDirection(1);
                }

                return next;
            });
        }, progress >= 96 ? 160 : 70);

        return () => clearInterval(id);
    }, [auto, direction, progress]);

    const snap = (val: any) => {
        const points = [0, 50, 100];
        return points.reduce((closest, point) => (Math.abs(point - val) < Math.abs(closest - val) ? point : closest), 0);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuto(false);
        setProgress(Number(e.target.value));
        setVibe(true);
        window.setTimeout(() => setVibe(false), 120);
    };

    const onRelease = () => setProgress((current) => snap(current));

    return (
        <section className="relative overflow-hidden px-4 py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(239,68,68,0.08),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(34,197,94,0.08),transparent_28%)]" />
            <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(7,18,58,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(7,18,58,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />

            <div className="relative mx-auto max-w-7xl text-center">
                <div className="mx-auto mb-4 inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-wider text-blue-700 shadow-sm">
                    Interactive Transformation Demo
                </div>
                <h2 className="text-3xl font-black md:text-5xl">From Chaos → Control</h2>
                <motion.p
                    key={stageText}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-lg font-black ${stageColor}`}
                >
                    {stageText}
                </motion.p>

                <div className="mt-10 flex justify-center" onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
                    <motion.div animate={vibe ? { x: [0, -4, 4, -2, 2, 0] } : {}} transition={{ duration: 0.16 }} className="w-full max-w-xl">
                        <div className="relative h-3 rounded-full bg-slate-200 shadow-inner">
                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.18 }}
                                className="absolute left-0 top-0 h-3 rounded-full bg-gradient-to-r from-[#0647d8] via-cyan-400 to-teal-500 shadow-[0_0_25px_rgba(20,184,166,0.35)]"
                            />
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={onChange}
                                onMouseUp={onRelease}
                                onTouchEnd={onRelease}
                                className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
                            />
                            <motion.div
                                animate={{ left: `${progress}%` }}
                                transition={{ duration: 0.18 }}
                                className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#0647d8] shadow-[0_10px_30px_rgba(6,71,216,0.35)]"
                            />
                        </div>
                        <div className="mt-4 flex justify-between text-xs font-black text-slate-400">
                            <span>Chaos</span><span>WEBME Setup</span><span>Control</span>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
                    <motion.div
                        style={{ opacity: Math.max(0.22, 1 - progress / 100) }}
                        className="rounded-[30px] border border-red-100 bg-white/80 p-6 text-left shadow-lg backdrop-blur"
                    >
                        <div className="mb-5 text-xs font-black uppercase tracking-wider text-red-500">Before WEBME</div>
                        {pains.map((pain, i) => (
                            <motion.div
                                key={pain}
                                animate={{ x: progress < 40 ? [0, -3, 3, 0] : 0 }}
                                transition={{ repeat: progress < 40 ? Infinity : 0, duration: 2.5, delay: i * 0.15 }}
                                className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                            >
                                <span className="text-xl">{painIcons[i]}</span>
                                <span className="text-sm font-bold">{pain}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="relative flex flex-col items-center justify-center">
                        <AITransformationRobot progress={progress} />
                        <div className="mt-5 grid gap-2 text-sm font-black">
                            <div>Efficiency: <span className="text-green-600">+{Math.floor(progress * 0.6)}%</span></div>
                            <div>Cost Saving: <span className="text-green-600">+{Math.floor(progress * 0.4)}%</span></div>
                        </div>
                        {progress >= 96 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 rounded-full border border-green-100 bg-green-50 px-5 py-2 text-xs font-black text-green-700 shadow-sm"
                            >
                                Ready to launch 🚀
                            </motion.div>
                        )}
                    </div>

                    <motion.div
                        style={{ opacity: Math.max(0.22, progress / 100) }}
                        className="rounded-[30px] border border-green-100 bg-green-50/80 p-6 text-left shadow-lg backdrop-blur"
                    >
                        <div className="mb-5 text-xs font-black uppercase tracking-wider text-green-600">After WEBME</div>
                        {outcomes.map((outcome, i) => (
                            <motion.div
                                key={outcome}
                                animate={{ y: progress > 60 ? [0, -5, 0] : 0 }}
                                transition={{ repeat: progress > 60 ? Infinity : 0, duration: 3, delay: i * 0.18 }}
                                className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                            >
                                <span className="text-xl">{outcomeIcons[i]}</span>
                                <span className="text-sm font-bold">{outcome}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-10">
                    <button
                        onClick={() => setLeadOpen(true)}
                        className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-500 px-8 py-4 text-lg font-black text-white shadow-[0_0_40px_rgba(20,184,166,0.4)] transition hover:scale-105"
                    >
                        Unlock My Business Transformation 🚀
                    </button>
                </div>
            </div>
        </section>
    );
}

function PackageSection() {
    return (
        <section className="relative z-10 -mt-2 px-4 py-14">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-wider text-blue-700 shadow-sm">Complete Launch Package</div>
                    <h2 className="text-3xl font-black md:text-5xl">Everything You Need — In One Powerful Package</h2>
                    <p className="mt-3 text-base font-semibold leading-7 text-slate-600">A website, business system and professional email stack designed to help UAE businesses start operating fast.</p>
                </div>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {packageItems.map((item, index) => (
                        <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[34px] border border-white/70 bg-white/90 p-7 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                            <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl transition group-hover:bg-teal-200/40" />
                            <div className="relative flex items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-4xl shadow-sm">{item.icon}</div>
                                <div><h3 className="text-xl font-black">{item.title}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{item.subtitle}</p></div>
                            </div>
                            <div className="relative mt-6 space-y-3">{item.points.map((p) => <div key={p} className="flex gap-3 text-sm font-semibold text-slate-700"><span className="text-green-600">✓</span>{p}</div>)}</div>
                            <div className="relative mt-6 flex h-36 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#07123a] to-[#0b3a78] text-sm font-black text-white">
                                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:24px_24px]" />
                                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: index * 0.2 }} className="relative rounded-2xl bg-white/10 px-8 py-5 backdrop-blur">{item.visual}</motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="relative overflow-hidden px-4 py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,71,216,0.08),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.08),transparent_28%)]" />
            <div className="relative mx-auto max-w-7xl text-center">
                <div className="mx-auto mb-4 inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-wider text-blue-700 shadow-sm">Fast Launch Journey</div>
                <h2 className="text-3xl font-black md:text-5xl">How It Works — Simple & Fast</h2>
                <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">A guided 4-step journey from enquiry to live business system.</p>
                <div className="relative mt-16">
                    <div className="absolute left-0 right-0 top-16 hidden h-1 rounded-full bg-gradient-to-r from-blue-200 via-teal-300 to-green-300 md:block" />
                    <div className="grid gap-8 md:grid-cols-4">
                        {steps.map(([icon, title, desc], index) => (
                            <motion.div key={title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="relative">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: index * 0.18 }} className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-blue-100 bg-white text-5xl shadow-[0_20px_70px_rgba(6,71,216,0.12)]"><div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0647d8] text-sm font-black text-white">{index + 1}</div>{icon}</motion.div>
                                <h3 className="mt-6 text-lg font-black">{title}</h3>
                                <p className="mx-auto mt-2 max-w-xs text-sm font-semibold leading-6 text-slate-500">{desc}</p>
                                {index < steps.length - 1 && <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute right-[-20px] top-14 hidden text-3xl font-black text-[#0647d8] md:block">→</motion.div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Pricing({ setLeadOpen }: PricingProps) {
    return (
        <section className="px-4 py-16">
            <div className="mx-auto max-w-7xl text-center">
                <div className="flex flex-col items-center justify-center gap-3 md:flex-row"><h2 className="text-3xl font-black md:text-4xl">Simple Pricing That Grows With You</h2><span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">Save 20% with yearly billing</span></div>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <motion.div key={plan.name} whileHover={{ y: -8 }} className={`relative rounded-[30px] border bg-white p-8 text-left shadow-[0_22px_70px_rgba(15,23,42,0.07)] ${plan.popular ? "border-emerald-400 ring-4 ring-emerald-100" : "border-slate-100"}`}>
                            {plan.popular && <div className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white">MOST POPULAR</div>}
                            <div className="text-4xl">{plan.icon}</div><h3 className="mt-4 text-2xl font-black">{plan.name}</h3>
                            <div className="mt-4 text-4xl font-black">{plan.price}<span className="text-sm font-bold text-slate-500"> /month</span></div>
                            <div className="mt-6 space-y-3">{plan.features.map((f) => <div key={f} className="flex gap-3 text-sm font-semibold"><span className="text-green-600">✓</span>{f}</div>)}</div>
                            <button onClick={() => setLeadOpen(true)} className={`mt-8 w-full rounded-xl px-6 py-4 font-black ${plan.popular ? "bg-[#0647d8] text-white" : "border border-[#0647d8] text-[#0647d8]"}`}>Get Started</button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section className="px-4 py-20">
            <div className="mx-auto max-w-7xl">
                <div className="grid items-end gap-6 lg:grid-cols-[0.75fr_1.25fr]">
                    <div><div className="mb-4 inline-flex rounded-full border border-yellow-100 bg-yellow-50 px-5 py-2 text-xs font-black uppercase tracking-wider text-yellow-700">Client Reviews</div><h2 className="text-3xl font-black md:text-5xl">Trusted by Businesses Across UAE</h2><p className="mt-4 text-sm font-semibold leading-6 text-slate-600">We help startups and growing businesses save time, reduce errors and grow faster.</p><div className="mt-6 text-2xl">⭐⭐⭐⭐⭐ <span className="text-base font-black">5.0 Average Rating on Google</span></div></div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {testimonials.map((item, index) => (
                            <motion.div key={item.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -8 }} className="relative overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)]"><div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-100 blur-3xl" /><div className="relative flex items-center gap-4"><Image src={item.image} alt={item.name} width={56} height={56} className="h-14 w-14 rounded-2xl object-cover shadow-md" /><div><div className="font-black">{item.name}</div><div className="text-xs font-semibold text-slate-500">{item.role}</div></div></div><div className="relative mt-5 text-4xl text-blue-300">“</div><p className="relative mt-2 text-sm font-semibold leading-6 text-slate-600">{item.quote}</p></motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FinalCTA({ setLeadOpen }: FinalCTAProps) {
    return <section className="px-4 py-12"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-[32px] bg-gradient-to-r from-[#07123a] to-[#0647d8] p-8 text-white shadow-[0_25px_90px_rgba(6,71,216,0.25)] md:flex-row"><div><h2 className="text-3xl font-black">Ready to Launch Your Business?</h2><p className="mt-2 font-semibold text-blue-100">Start your free setup today and get your complete business system live in 48 hours.</p></div><button onClick={() => setLeadOpen(true)} className="rounded-2xl bg-white px-8 py-4 font-black text-[#0647d8]">Start Free Setup →</button></div></section>;
}
