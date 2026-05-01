export function Footer() {
    return (
        <footer className="bg-[#07123a] px-4 py-10 text-white">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
                <div>
                    <div className="text-3xl font-black">webme</div>
                    <p className="mt-3 text-sm text-slate-300">All-in-one business system for startups and SMEs in UAE.</p>
                </div>
                {["Solutions", "Company", "Support"].map((h) => (
                    <div key={h}>
                        <h4 className="font-black">{h}</h4>
                        <div className="mt-3 space-y-2 text-sm text-slate-300">
                            <div>Website</div>
                            <div>ERP System</div>
                            <div>Microsoft 365</div>
                        </div>
                    </div>
                ))}
                <div>
                    <h4 className="font-black">Get in Touch</h4>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                        <div>📞 +971 56 123 4567</div>
                        <div>✉️ hello@webmedigital.ae</div>
                        <div>📍 Abu Dhabi, UAE</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
