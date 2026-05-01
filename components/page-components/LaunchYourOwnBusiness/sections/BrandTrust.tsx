const brands = ["Microsoft 365", "Odoo", "AWS", "Google Cloud", "Intel", "Cloudflare"];

export function BrandTrust() {
    return (
        <section className="border-y border-slate-100 bg-white px-4 py-8">
            <div className="mx-auto max-w-7xl text-center">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Trusted by 100+ businesses in UAE</div>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-6">
                    {brands.map((brand) => <div key={brand} className="rounded-2xl bg-white p-4 text-lg font-black text-slate-600 shadow-sm">{brand}</div>)}
                </div>
            </div>
        </section>
    );
}
