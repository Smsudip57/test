export function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-2xl font-black text-white">W</div>
                    <div>
                        <div className="text-2xl font-black leading-none">webme</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.45em] text-slate-500">digital</div>
                    </div>
                </div>
                <nav className="hidden items-center gap-8 text-sm font-black text-slate-700 lg:flex">
                    <a>Home</a><a>Solutions</a><a>Pricing</a><a>How It Works</a><a>About Us</a><a>Resources</a>
                </nav>
                <div className="flex items-center gap-3">
                    <a href="https://wa.me/971561234567" target="_blank" rel="noreferrer" className="hidden rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-black text-green-700 md:block">💬 +971 56 123 4567</a>
                    <button className="rounded-2xl bg-[#0647d8] px-5 py-3 text-sm font-black text-white shadow-[0_16px_40px_rgba(6,71,216,0.20)]">Book a Demo</button>
                </div>
            </div>
        </header>
    );
}
