"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const topPillars = [
    { letter: "W", icon: "🌐", title: "Work From Anywhere" },
    { letter: "E", icon: "✦", title: "Expertise" },
    { letter: "B", icon: "◇", title: "Branding" },
    { letter: "M", icon: "▣", title: "Modern Workplace" },
    { letter: "E", icon: "◉", title: "Endless Support" },
    { letter: "D", icon: "⌁", title: "Digital" },
];

type AccentKey = 'teal' | 'indigo' | 'blue' | 'purple' | 'sky' | 'green';

type Service = {
    icon: string;
    title: string;
    desc: string;
    accent: AccentKey;
    outcome: string;
};

const services: Service[] = [
    {
        icon: "database",
        title: "ERP & Business Systems",
        desc: "Integrated ERP, CRM, invoicing and automation for better operational control.",
        accent: "teal",
        outcome: "Control operations",
    },
    {
        icon: "shield",
        title: "Security & Risk Management",
        desc: "Cybersecurity, backup and risk protection systems designed for business continuity.",
        accent: "indigo",
        outcome: "Protect business",
    },
    {
        icon: "cloud",
        title: "Modern Workplace & Cloud",
        desc: "Microsoft 365, Azure, cloud collaboration and secure productivity systems.",
        accent: "blue",
        outcome: "Empower teams",
    },
    {
        icon: "code",
        title: "Digital & Software Solutions",
        desc: "Websites, apps, portals, automations and custom software tailored around your process.",
        accent: "purple",
        outcome: "Build digital products",
    },
    {
        icon: "building",
        title: "Smart Infrastructure",
        desc: "ELV, CCTV, smart buildings, IoT and connected infrastructure for future-ready operations.",
        accent: "sky",
        outcome: "Connect spaces",
    },
    {
        icon: "leaf",
        title: "Smart Environment",
        desc: "Energy, smart agriculture, BMS and sustainability solutions for responsible digital growth.",
        accent: "green",
        outcome: "Improve sustainability",
    },
];

const accent = {
    teal: {
        text: "text-teal-600",
        bg: "bg-teal-500",
        light: "bg-teal-50",
        border: "border-teal-100",
        gradient: "from-teal-400/18 to-cyan-400/10",
    },
    indigo: {
        text: "text-indigo-600",
        bg: "bg-indigo-500",
        light: "bg-indigo-50",
        border: "border-indigo-100",
        gradient: "from-indigo-400/18 to-violet-400/10",
    },
    blue: {
        text: "text-blue-600",
        bg: "bg-blue-500",
        light: "bg-blue-50",
        border: "border-blue-100",
        gradient: "from-blue-400/18 to-sky-400/10",
    },
    purple: {
        text: "text-purple-600",
        bg: "bg-purple-500",
        light: "bg-purple-50",
        border: "border-purple-100",
        gradient: "from-purple-400/18 to-fuchsia-400/10",
    },
    sky: {
        text: "text-sky-600",
        bg: "bg-sky-500",
        light: "bg-sky-50",
        border: "border-sky-100",
        gradient: "from-sky-400/18 to-blue-400/10",
    },
    green: {
        text: "text-green-600",
        bg: "bg-green-500",
        light: "bg-green-50",
        border: "border-green-100",
        gradient: "from-green-400/18 to-emerald-400/10",
    },
};

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function Icon({ type }: { type: string }) {
    const common: React.SVGAttributes<SVGElement> = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2.1,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    const icons: Record<string, JSX.Element> = {
        database: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <ellipse {...common} cx="12" cy="5" rx="6" ry="2.6" />
                <path {...common} d="M6 5v5c0 1.5 2.7 2.6 6 2.6s6-1.1 6-2.6V5" />
                <path {...common} d="M6 10v5c0 1.5 2.7 2.6 6 2.6s6-1.1 6-2.6v-5" />
                <path {...common} d="M8.5 15.2 11 13l2 2 2.6-2.8" />
            </svg>
        ),
        shield: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path {...common} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <rect {...common} x="8.5" y="10.5" width="7" height="5.5" rx="1.2" />
                <path {...common} d="M10 10.5V9a2 2 0 0 1 4 0v1.5" />
            </svg>
        ),
        cloud: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path {...common} d="M17.5 16.5H8a4.4 4.4 0 1 1 1-8.65A5.5 5.5 0 0 1 19.2 11.7a2.9 2.9 0 0 1-1.7 4.8z" />
                <circle {...common} cx="8" cy="19" r="1.4" />
                <circle {...common} cx="16" cy="19" r="1.4" />
                <path {...common} d="M9.5 19h5M12 16.5V19" />
            </svg>
        ),
        code: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <rect {...common} x="3" y="4" width="18" height="16" rx="3" />
                <path {...common} d="M3 8h18M9 12l-2.5 2L9 16M15 12l2.5 2L15 16M13 11l-2 6" />
            </svg>
        ),
        building: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path {...common} d="M4 21V7l7-4 7 4v14M9 21v-5h5v5" />
                <path {...common} d="M8 9h.01M11 9h.01M14 9h.01M8 13h.01M14 13h.01" />
                <circle {...common} cx="19" cy="8" r="1.4" />
                <circle {...common} cx="20" cy="15" r="1.4" />
                <path {...common} d="M17.8 9.1 15 11M18.8 14.2 15 13" />
            </svg>
        ),
        leaf: (
            <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path {...common} d="M20 4c-8 0-14 4-14 10a6 6 0 0 0 10 4c4-4 4-10 4-14z" />
                <path {...common} d="M6 20c3-7 7-10 14-16" />
                <path {...common} d="m13 14 1.5-3 1.5 2h2" />
            </svg>
        ),
    };

    return icons[type] || icons.database;
}

export default function CoreServicesAppleMinimalSection() {
    const [active, setActive] = useState(0);
    const activeService = services[active];

    return (
        <section className="relative overflow-hidden bg-[#fbfdff] px-4 py-20 text-[#07123a]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(20,184,166,0.055),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(6,71,216,0.055),transparent_32%)]" />
            <div className="absolute left-1/2 top-0 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="relative mx-auto max-w-7xl">
                <BrandPillarStrip />

                <div className="mx-auto mt-16 max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#0647d8] backdrop-blur"
                    >
                        <span className="h-1 w-1 rounded-full bg-[#0647d8]" />
                        Powering Digital Transformation
                        <span className="h-1 w-1 rounded-full bg-[#0647d8]" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06 }}
                        className="text-4xl font-black tracking-tight md:text-6xl"
                    >
                        Our Core Solutions
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12 }}
                        className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-slate-500 md:text-lg"
                    >
                        A clean, connected service ecosystem built to help your business operate, protect, automate, and scale.
                    </motion.p>
                </div>

                <div className="mt-14 grid gap-5 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.title}
                            service={service}
                            index={index}
                            active={active === index}
                            onHover={() => setActive(index)}
                        />
                    ))}
                </div>

                <ElegantFocusBar activeService={activeService} />
                <ElegantCTA />
            </div>
        </section>
    );
}

function BrandPillarStrip() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[28px] border border-white/70 bg-white/45 p-3 shadow-[0_18px_70px_rgba(15,23,42,0.045)] backdrop-blur-xl"
        >
            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
                {topPillars.map((item, index) => (
                    <motion.div
                        key={`${item.letter}-${item.title}`}
                        whileHover={{ y: -3 }}
                        className="group relative flex items-center gap-3 rounded-2xl px-4 py-4 transition hover:bg-white/55"
                    >
                        {index < topPillars.length - 1 && (
                            <div className="absolute right-0 top-1/2 hidden h-9 w-px -translate-y-1/2 bg-slate-200/70 lg:block" />
                        )}

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/60 shadow-sm backdrop-blur">
                            <span className="absolute left-2 top-1.5 text-[10px] font-black text-slate-400">{item.letter}</span>
                            <motion.span
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, delay: index * 0.2 }}
                                className="text-lg text-slate-700"
                            >
                                {item.icon}
                            </motion.span>
                        </div>

                        <div className="text-xs font-black uppercase leading-5 tracking-wide text-slate-600">{item.title}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function ServiceCard(props: { service: Service; index: number; active: boolean; onHover: () => void }) {
    const { service, index, active, onHover } = props;
    const a = accent[service.accent];

    return (
        <motion.article
            onMouseEnter={onHover}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.055 }}
            whileHover={{ y: -6 }}
            className="group relative min-h-[290px] overflow-hidden rounded-[30px] border border-slate-200/60 bg-white/70 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.055)] backdrop-blur-xl"
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition duration-500 group-hover:opacity-100", a.gradient)} />
            <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                    <PremiumMinimalIcon type={service.icon} accentKey={service.accent} active={active} />
                    <div className={cn("rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider", a.light, a.border, a.text)}>
                        {service.outcome}
                    </div>
                </div>

                <h3 className="mt-7 max-w-sm text-2xl font-black uppercase leading-tight tracking-tight">{service.title}</h3>
                <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-slate-500">{service.desc}</p>

                <motion.div whileHover={{ x: 4 }} className={cn("mt-7 inline-flex cursor-pointer items-center gap-2 text-sm font-black", a.text)}>
                    Learn More <span>→</span>
                </motion.div>
            </div>

            <motion.div
                animate={active ? { opacity: [0.18, 0.34, 0.18], scale: [1, 1.08, 1] } : { opacity: 0.12 }}
                transition={{ repeat: active ? Infinity : 0, duration: 3.4 }}
                className={cn("absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl", a.bg)}
            />
        </motion.article>
    );
}

function PremiumMinimalIcon(props: { type: string; accentKey: AccentKey; active?: boolean }) {
    const { type, accentKey, active } = props;
    const a = accent[accentKey];

    return (
        <div className="relative h-16 w-16">
            <motion.div
                animate={active ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: active ? Infinity : 0, duration: 9, ease: "linear" }}
                className={cn("absolute inset-0 rounded-2xl border opacity-60", a.border)}
            />
            <motion.div
                animate={active ? { y: [0, -4, 0], scale: [1, 1.04, 1] } : {}}
                transition={{ repeat: active ? Infinity : 0, duration: 3.2 }}
                className={cn("relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)]", a.border, a.text)}
            >
                <div className={cn("absolute inset-1 rounded-xl opacity-80", a.light)} />
                <div className="relative z-10">
                    <Icon type={type} />
                </div>
            </motion.div>
        </div>
    );
}

function ElegantFocusBar(props: { activeService: Service }) {
    const { activeService } = props;
    const a = accent[activeService.accent];

    return (
        <motion.div
            layout
            className="mt-8 overflow-hidden rounded-[26px] border border-white/70 bg-white/55 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.045)] backdrop-blur-xl"
        >
            <div className="grid items-center gap-5 md:grid-cols-[auto_1fr_auto]">
                <PremiumMinimalIcon type={activeService.icon} accentKey={activeService.accent} active />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="text-lg font-black">Recommended focus: {activeService.title}</div>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                            Build this as part of a complete WEBME operating system: website, ERP, cloud, security and automation working together.
                        </p>
                    </motion.div>
                </AnimatePresence>
                <button className={cn("rounded-2xl px-7 py-4 text-sm font-black text-white shadow-[0_14px_36px_rgba(15,23,42,0.10)] transition hover:scale-105", a.bg)}>
                    Get Solution Plan →
                </button>
            </div>
        </motion.div>
    );
}

function ElegantCTA() {
    return (
        <div className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[#07123a] p-8 text-white shadow-[0_22px_70px_rgba(7,18,58,0.18)]">
            <div className="grid items-center gap-6 md:grid-cols-[auto_1fr_auto]">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3.8 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/10"
                >
                    ✦
                </motion.div>
                <div>
                    <h3 className="text-3xl font-black">Ready to Transform Your Business?</h3>
                    <p className="mt-2 font-medium text-blue-100">Let’s build elegant, scalable digital systems that drive growth and long-term value.</p>
                </div>
                <button className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-[#07123a] shadow-lg transition hover:scale-105">
                    Get In Touch →
                </button>
            </div>
        </div>
    );
}
