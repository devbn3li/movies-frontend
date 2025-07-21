"use client";
import { motion } from "framer-motion";
import TrendingNow from "@/components/TrendingNow";
import AuthModal from "@/components/AuthModal";
import poster from "@/assets/larg_bg_en.jpg";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={poster}
            alt="Movie Zone - Stream unlimited movies and TV shows"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black/60 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        <motion.header
          className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, staggerChildren: 0.3 }}
        >
          <motion.h1
            className="text-[4rem] font-bold text-white drop-shadow-md max-w-3xl"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Unlimited movies, TV shows, and more
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            Discover thousands of movies and TV shows. Stream the latest releases, classic films, and popular series - all free, no ads, no interruptions.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <AuthModal>
              <motion.button
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 shimmer-effect"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start Watching
              </motion.button>
            </AuthModal>
          </motion.div>
        </motion.header>
      </section>

      <section className="p-5 sm:px-20 pb-20 flex flex-col">
        <div>
          <TrendingNow type="movie" title="Movies" isLarge={true} />
        </div>

        <div>
          <TrendingNow type="tv" title="TV Shows" isLarge={true} />
        </div>
      </section>
    </main>
  );
}
