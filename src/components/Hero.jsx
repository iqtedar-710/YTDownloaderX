import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-40">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-6xl"
      >

        <h1 className="text-5xl md:text-8xl font-black leading-tight">
          Download YouTube Videos
          <span className="gradient-text block mt-2">
            Instantly & Beautifully
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-2xl mt-8 max-w-3xl mx-auto leading-relaxed">
          Experience the most premium futuristic YouTube downloader platform
          with ultra-fast downloads, HD quality, audio extraction, and cinematic UI.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-5 justify-center mt-12">

          <button className="px-10 py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 transition duration-300 glow text-lg font-semibold">
            Start Downloading
          </button>

          <button className="px-10 py-5 rounded-2xl glass hover:bg-white/10 transition duration-300 text-lg font-semibold">
            Explore Features
          </button>

        </div>

      </motion.div>
    </section>
  );
}