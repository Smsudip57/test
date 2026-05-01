"use client"
import React, { useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type IconName = "user" | "gift" | "arrow" | "search" | "spark" | "shield" | "cloud" | "chart" | "headset";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const icons = {
    user: (
      <svg {...props}>
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21c0-4 14-4 14 0" />
      </svg>
    ),
    gift: (
      <svg {...props}>
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8v13" />
        <path d="M3 12h18" />
        <path d="M7.5 8A2.5 2.5 0 1 1 12 6.5V8" />
        <path d="M16.5 8A2.5 2.5 0 1 0 12 6.5V8" />
      </svg>
    ),
    arrow: (
      <svg {...props}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),
    search: (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
      </svg>
    ),
    spark: (
      <svg {...props}>
        <path d="M12 3 9.7 8.8 4 11l5.7 2.2L12 19l2.3-5.8L20 11l-5.7-2.2Z" />
        <path d="M5 3v4" />
        <path d="M3 5h4" />
      </svg>
    ),
    shield: (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    cloud: (
      <svg {...props}>
        <path d="M17.5 19H7a5 5 0 1 1 1.2-9.85A7 7 0 0 1 21 13a4 4 0 0 1-3.5 6Z" />
      </svg>
    ),
    chart: (
      <svg {...props}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
        <path d="M17 7h2v2" />
      </svg>
    ),
    headset: (
      <svg {...props}>
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <path d="M21 14v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
        <path d="M3 14v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2Z" />
      </svg>
    ),
  };

  return icons[name] || icons.spark;
}

const navItems = ["Solutions", "Packages", "Industries", "Resources", "Company"];
const features: Array<{ label: string; icon: IconName }> = [
  { label: "AI-Powered\nAutomation", icon: "spark" },
  { label: "Enterprise\nSecurity", icon: "shield" },
  { label: "Cloud-Native\nSolutions", icon: "cloud" },
  { label: "Scalable\nGrowth", icon: "chart" },
  { label: "24/7 Expert\nSupport", icon: "headset" },
];
const technologies = ["Microsoft", "Odoo", "Google Cloud"];

console.assert(navItems.length === 5, "Navigation should contain five items.");
console.assert(features.length === 5, "Hero should contain five feature cards.");
console.assert(technologies.length === 3, "Technology section should contain three items.");
console.assert(features.every((feature) => feature.label && feature.icon), "Each feature requires a label and icon.");
console.assert(typeof Icon === "function", "Icon component should be available.");

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
  },
};

function StripeMotionBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F3F5F9]">
      <motion.div
        className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#2ED6C9]/20 blur-3xl"
        animate={{ x: [0, 80, 20, 0], y: [0, 40, 90, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-120px] top-20 h-[560px] w-[560px] rounded-full bg-[#C8F22A]/20 blur-3xl"
        animate={{ x: [0, -70, -20, 0], y: [0, 70, 20, 0], scale: [1, 0.94, 1.12, 1] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-220px] left-1/3 h-[560px] w-[560px] rounded-full bg-[#3CE0B5]/20 blur-3xl"
        animate={{ x: [0, 40, -60, 0], y: [0, -40, -20, 0], scale: [1, 1.1, 0.98, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.18]"
        animate={{ backgroundPosition: ["0px 0px", "110px 70px"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(46,214,201,.22) 1px, transparent 1px), linear-gradient(25deg, rgba(15,23,42,.08) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />
    </div>
  );
}

function PremiumMeshCharacter() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 18 });
  const sy = useSpring(y, { stiffness: 90, damping: 18 });
  const rotateX = useTransform(sy, [-20, 20], [6, -6]);
  const rotateY = useTransform(sx, [-20, 20], [-6, 6]);

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.06);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.06);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy, rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="absolute left-[34px] top-[150px] hidden h-[520px] w-[470px] lg:block xl:left-[62px]"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        <div className="absolute bottom-[40px] left-[-80px] h-[210px] w-[620px] overflow-hidden opacity-90">
          <svg viewBox="0 0 620 210" className="h-full w-full">
            <defs>
              <linearGradient id="waveLine" x1="0" x2="1">
                <stop offset="0" stopColor="#2ED6C9" stopOpacity="0.05" />
                <stop offset="0.5" stopColor="#2ED6C9" stopOpacity="0.85" />
                <stop offset="1" stopColor="#C8F22A" stopOpacity="0.18" />
              </linearGradient>
            </defs>
            {Array.from({ length: 16 }).map((_, row) => {
              const waveY = 40 + row * 9;
              return (
                <motion.path
                  key={`wave-${row}`}
                  d={`M0 ${waveY} C 90 ${waveY - 45}, 160 ${waveY + 42}, 250 ${waveY} S 430 ${waveY - 36}, 620 ${waveY + 8}`}
                  fill="none"
                  stroke="url(#waveLine)"
                  strokeWidth="1"
                  initial={{ pathLength: 0.2, opacity: 0.25 }}
                  animate={{ pathLength: [0.35, 1, 0.35], opacity: [0.25, 0.85, 0.25] }}
                  transition={{ duration: 7 + row * 0.15, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })}
            {Array.from({ length: 70 }).map((_, i) => (
              <motion.circle
                key={`dot-${i}`}
                cx={(i * 43) % 620}
                cy={80 + Math.sin(i) * 44 + (i % 7) * 10}
                r="1.6"
                fill="#2ED6C9"
                animate={{ opacity: [0.18, 0.9, 0.18] }}
                transition={{ duration: 2.8 + (i % 5) * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>

        <motion.div
          className="absolute left-[88px] top-[86px] h-[330px] w-[330px] rounded-full border border-[#2ED6C9]/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-[62px] top-[120px] h-[340px] w-[390px] rounded-[50%] border border-dashed border-[#2ED6C9]/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute left-[130px] top-[12px] h-[210px] w-[235px] drop-shadow-[0_0_30px_rgba(46,214,201,.55)]"
          animate={{ rotate: [0, 3, -3, 0], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 240 220" className="h-full w-full">
            <defs>
              <radialGradient id="polyGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0" stopColor="#2ED6C9" stopOpacity="0.28" />
                <stop offset="1" stopColor="#021314" stopOpacity="0.04" />
              </radialGradient>
              <linearGradient id="polyStroke" x1="0" x2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#2ED6C9" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
            <polygon points="120,8 204,48 224,136 158,208 70,194 18,122 42,40" fill="url(#polyGlow)" stroke="url(#polyStroke)" strokeWidth="2.2" />
            <g stroke="url(#polyStroke)" strokeWidth="1.6" fill="none" opacity="0.95">
              <path d="M120 8 70 194 224 136 42 40 158 208 204 48 18 122 120 8" />
              <path d="M42 40 70 194 204 48 224 136 18 122 158 208" />
              <path d="M70 194 120 8 158 208 42 40 224 136 204 48" />
              <path d="M18 122 120 8 204 48 158 208 70 194" />
              <path d="M74 86 116 54 166 82 174 132 128 162 82 142Z" />
              <path d="M74 86 174 132 M116 54 128 162 M166 82 82 142" />
            </g>
            {[
              [120, 8], [204, 48], [224, 136], [158, 208], [70, 194], [18, 122], [42, 40],
              [74, 86], [116, 54], [166, 82], [174, 132], [128, 162], [82, 142],
            ].map(([cx, cy], index) => (
              <circle key={index} cx={cx} cy={cy} r="3" fill="#ffffff" opacity="0.9" />
            ))}
          </svg>
        </motion.div>

        <motion.div
          className="absolute left-[136px] top-[230px] h-[230px] w-[220px] drop-shadow-[0_0_38px_rgba(46,214,201,.65)]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 220 250" className="h-full w-full">
            <defs>
              <linearGradient id="prismFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.58" />
                <stop offset="0.5" stopColor="#2ED6C9" stopOpacity="0.18" />
                <stop offset="1" stopColor="#061718" stopOpacity="0.42" />
              </linearGradient>
              <linearGradient id="prismStroke" x1="0" x2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#2ED6C9" />
                <stop offset="1" stopColor="#C8F22A" />
              </linearGradient>
            </defs>
            <path d="M14 24 204 2 118 236Z" fill="url(#prismFill)" stroke="url(#prismStroke)" strokeWidth="3" />
            <path d="M14 24 118 236 74 68Z" fill="#ffffff" opacity="0.12" />
            <path d="M204 2 118 236 152 80Z" fill="#2ED6C9" opacity="0.16" />
            <path d="M14 24 152 80 204 2" fill="#ffffff" opacity="0.22" />
            <g stroke="url(#prismStroke)" strokeWidth="1.8" fill="none" opacity="0.88">
              <path d="M14 24 152 80 118 236" />
              <path d="M204 2 74 68 118 236" />
              <path d="M74 68 152 80" />
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function MagneticButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-20, 20], [6, -6]);
  const rotateY = useTransform(x, [-20, 20], [-6, 6]);

  return (
    <motion.button
      type="button"
      style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function WebmeAppleStripeHero() {
  const [q, setQ] = useState("");

  return (
    <div className="min-h-screen bg-[#F3F5F9] px-8 py-6 text-[#0F172A] selection:bg-[#2ED6C9]/25">
      <StripeMotionBackground />

      <div className="relative mx-auto max-w-[1180px]">
        <PremiumMeshCharacter />

        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex items-center justify-between"
        >
          <motion.a whileHover={{ scale: 1.02 }} href="#" className="flex items-center gap-2" aria-label="Webmedigital Home">
            <div className="relative h-16 w-12">
              <motion.div
                animate={{ rotate: [45, 48, 45] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute left-3 top-0 h-8 w-8 rotate-45 border border-[#0F172A]/60"
              />
              <div className="absolute bottom-0 left-1 h-11 w-11 rotate-45 border-b-2 border-l-2 border-[#0F172A]" />
              <div className="absolute bottom-6 left-7 h-2 w-2 rounded-full bg-[#2ED6C9]" />
            </div>
            <span className="font-semibold">Webmedigital</span>
          </motion.a>

          <nav className="hidden gap-6 text-sm md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href="#"
                whileHover={{ y: -2, color: "#0FAF9F" }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,.72)" }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg border border-white/60 bg-white/35 px-6 py-2 backdrop-blur"
            >
              Book a Demo
            </motion.button>
            <MagneticButton className="relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#2ED6C9] via-[#3CE0B5] to-[#C8F22A] px-4 py-2 font-semibold text-[#0F172A] shadow-lg shadow-[#2ED6C9]/25">
              <motion.span
                className="absolute inset-0 bg-white/35"
                initial={{ x: "-120%" }}
                whileHover={{ x: "120%" }}
                transition={{ duration: 0.65 }}
              />
              <span className="relative flex items-center gap-2">
                <Icon name="user" /> Customer Portal
              </span>
            </MagneticButton>
          </div>
        </motion.header>

        <motion.main
          initial="hidden"
          animate="show"
          variants={container}
          className="relative z-10 mx-auto mt-10 max-w-[760px] text-center"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.015 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/45 px-5 py-2 text-sm text-[#0FAF9F] shadow-sm backdrop-blur"
          >
            <motion.span
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.16, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Icon name="spark" />
            </motion.span>
            Smart, Scalable, Human-Centric Digital Operating System
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 bg-gradient-to-r from-[#19D7D1] via-[#4ADE80] to-[#E5E600] bg-clip-text text-6xl font-black text-transparent"
          >
            Build. Automate. Secure. Scale.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-gray-700">
            All-in-one Digital Transformation Platform for
            <br /> Websites, ERP, Microsoft 365, Cybersecurity & More.
          </motion.p>

          <motion.a
            variants={fadeUp}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            href="#startup"
            className="group relative mx-auto mt-6 flex max-w-xl items-center justify-between overflow-hidden rounded-xl border border-white/70 bg-white/55 px-6 py-4 shadow-[0_20px_70px_rgba(46,214,201,.14)] backdrop-blur"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-[#2ED6C9]/18 via-transparent to-[#C8F22A]/18"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-4">
              <motion.span
                animate={{
                  y: [0, -3, 0],
                  boxShadow: [
                    "0 8px 20px rgba(46,214,201,.25)",
                    "0 14px 35px rgba(46,214,201,.38)",
                    "0 8px 20px rgba(46,214,201,.25)",
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#2ED6C9] to-[#3CE0B5] text-[#0F172A]"
              >
                <Icon name="gift" />
              </motion.span>
              <span className="text-left">
                <span className="block font-semibold">Ready to Transform Your Journey?</span>
                <span className="block font-bold text-[#0FAF9F]">Get Your Startup Package</span>
              </span>
            </span>
            <motion.span className="relative" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <Icon name="arrow" />
            </motion.span>
          </motion.a>

          <motion.div variants={container} className="mx-auto mt-6 grid max-w-xl grid-cols-5 gap-4 text-xs">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.04, boxShadow: "0 18px 40px rgba(15,23,42,.10)" }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className="rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur"
              >
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto flex justify-center text-[#0FAF9F]"
                >
                  <Icon name={feature.icon} size={30} />
                </motion.div>
                <p className="mt-2 whitespace-pre-line leading-4">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => event.preventDefault()}
            whileHover={{ scale: 1.01 }}
            className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur focus-within:shadow-[0_0_0_4px_rgba(46,214,201,.15)]"
          >
            <Icon name="search" size={30} />
            <span className="h-7 w-px bg-slate-300" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              className="flex-1 bg-transparent text-center outline-none"
              placeholder="How can we help your business grow today?"
              aria-label="Search services"
            />
            <motion.button
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.92 }}
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2ED6C9] to-[#C8F22A] text-[#0F172A] shadow-lg shadow-[#2ED6C9]/25"
            >
              <Icon name="spark" size={18} />
            </motion.button>
          </motion.form>
        </motion.main>

        <motion.section
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto mt-10 grid max-w-4xl gap-6 rounded-xl border border-white/70 bg-white/40 p-6 text-sm shadow-sm backdrop-blur md:grid-cols-2"
        >
          <div>
            <p className="font-bold">
              TRUSTED BY <span className="text-[#0FAF9F]">100+</span> BUSINESSES ACROSS UAE
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {["AL NOOR CLINIC", "ROYAL REAL ESTATE"].map((name, index) => (
                <motion.div
                  key={name}
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className="rounded-lg border border-white/70 bg-white/75 p-3 text-xs shadow-sm backdrop-blur"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    className="tracking-widest text-[#C8F22A]"
                  >
                    ★★★★★
                  </motion.div>
                  <p className="mt-1 text-[9px] leading-3 text-slate-600">
                    “Webmedigital transformed our operations. Everything is now automated and efficient.”
                  </p>
                  <p className="mt-1 text-[9px] font-semibold text-[#0FAF9F]">— Dr. Noor, {name}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold">POWERED BY WORLDCLASS TECHNOLOGIES</p>
            <div className="mt-8 flex justify-between font-semibold text-gray-500">
              {technologies.map((item) => (
                <motion.span key={item} whileHover={{ y: -3, color: "#0FAF9F" }}>
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
