import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-50 bg-[#050816]/70 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black gradient-text">
          YTDownloaderX
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <a href="#" className="hover:text-white transition duration-300">
            Features
          </a>

          <a href="#" className="hover:text-white transition duration-300">
            Downloads
          </a>

          <a href="#" className="hover:text-white transition duration-300">
            FAQ
          </a>
        </div>
      </div>
    </motion.nav>
  );
}