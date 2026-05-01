import { motion } from "framer-motion";

interface AITransformationRobotProps {
    progress: number;
}

export function AITransformationRobot({ progress }: AITransformationRobotProps) {
    const mood = progress < 35 ? "😵" : progress < 70 ? "🤖" : "✨";

    return (
        <div className="relative flex h-36 w-36 items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-blue-200"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dashed border-teal-300"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-[#0647d8] via-cyan-500 to-teal-500 text-4xl text-white shadow-[0_0_45px_rgba(20,184,166,0.35)]"
            >
                {mood}
            </motion.div>
            <motion.div
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-8 rounded-full bg-teal-300/30 blur-xl"
            />
        </div>
    );
}
