import { motion, AnimatePresence } from "framer-motion";

interface Form {
    name: string;
    company: string;
    email: string;
    industry: string;
}

interface LeadPopupProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    form: Form;
}

export function LeadPopup({ open, setOpen, form }: LeadPopupProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                >
                    <motion.div
                        initial={{ y: 30, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 30, scale: 0.95 }}
                        className="max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl"
                    >
                        <div className="text-5xl">🚀</div>
                        <h3 className="mt-4 text-2xl font-black">Your free setup request is ready</h3>
                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Send this request to WEBME on WhatsApp and our team will contact you.</p>
                        <div className="mt-6 flex gap-3">
                            <a
                                href={`https://wa.me/971561234567?text=${encodeURIComponent(
                                    `Hi WEBME, I want the AED 99 business setup. Name: ${form.name}. Company: ${form.company}. Email: ${form.email}. Industry: ${form.industry}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 rounded-xl bg-green-500 px-5 py-3 font-black text-white"
                            >
                                Send WhatsApp
                            </a>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-xl border px-5 py-3 font-black"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
