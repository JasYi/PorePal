import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-12 px-4 text-black mb-8">
      <motion.h1
        className="text-5xl md:text-6xl font-heading font-extrabold text-center drop-shadow-lg mb-4"
        style={{
          background:
            "linear-gradient(90deg, #3A7CFF, #FF3AFD, #8B5CF6, #3A7CFF)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "gradient-wrap 10s linear infinite",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}>
        PorePal <span className="text-gray-600">✨</span>
      </motion.h1>
      <motion.p
        className="text-lg md:text-2xl font-sans text-black/80 text-center max-w-xl mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 200,
          damping: 18,
        }}>
        AI-powered skincare. Snap, upload, and glow up instantly! 🚀
      </motion.p>
      <style jsx>{`
        @keyframes gradient-wrap {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </section>
  );
}
