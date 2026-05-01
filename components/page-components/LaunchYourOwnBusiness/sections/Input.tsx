interface InputProps {
    icon: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export function Input({ icon, placeholder, value, onChange }: InputProps) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <span className="text-xl">{icon}</span>
            <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400" />
        </div>
    );
}
