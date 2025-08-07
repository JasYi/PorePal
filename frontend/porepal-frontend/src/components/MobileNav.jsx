import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/results", label: "Results", emoji: "🔬" },
  // Add more as needed
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <motion.nav
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-md bg-primary text-primary-foreground rounded-2xl shadow-genz flex items-center justify-around py-2 px-3 md:hidden"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center text-primary-foreground font-heading text-lg px-2 py-1 transition-all ${
            pathname === item.href
              ? "scale-110"
              : "opacity-80 hover:opacity-100"
          }`}
          aria-label={item.label}>
          <span className="text-2xl mb-0.5">{item.emoji}</span>
          <span className="text-xs font-bold">{item.label}</span>
        </Link>
      ))}
    </motion.nav>
  );
}
