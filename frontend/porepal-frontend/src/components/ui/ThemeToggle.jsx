import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";
  return (
    <motion.button
      className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-hot-pink shadow-genz flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.1 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: isDark ? 360 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}>
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            role="img"
            aria-label="moon">
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="img"
            aria-label="sun">
            ☀️
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
