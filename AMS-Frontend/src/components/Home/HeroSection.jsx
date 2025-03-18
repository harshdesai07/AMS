import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative text-center py-20 px-6 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#3b0764] text-white overflow-hidden mt-15">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.4)_0%,rgba(9,9,121,0)_80%)] pointer-events-none"></div>

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-16 h-16 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-20 h-20 bg-purple-500/10 blur-4xl rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-400/10 blur-2xl rounded-full animate-pulse"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg"
        >
          Welcome to AMS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-lg sm:text-xl font-light text-blue-200"
        >
          Effortless Attendance Tracking for Students & Employees
        </motion.p>
      </div>

      {/* Stats Section with Glow Effect */}
      <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-8 sm:gap-12">
        {[
          { label: "Students Tracked", count: 5000 },
          { label: "Employees Managed", count: 1000 },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 10px 25px rgba(138, 43, 226, 0.6)",
            }}
            className="relative p-6 sm:p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-400/40 
              text-center min-w-[200px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px] cursor-pointer hover:bg-white/20 transition-all duration-300"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-blue-400 drop-shadow-md">
              {item.count.toLocaleString()}+
            </h2>
            <p className="text-md sm:text-lg font-medium mt-2 text-gray-200">{item.label}</p>

            {/* Animated Glowing Border Effect on Hover */}
            <motion.div
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 border border-blue-400/40 rounded-2xl blur-md opacity-0 hover:opacity-100 transition-all"
            ></motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
