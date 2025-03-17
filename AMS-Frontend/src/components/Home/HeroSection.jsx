import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative text-center py-20 px-6 bg-[#0d0d2b] text-white overflow-hidden mt-15">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.3)_0%,rgba(9,9,121,0)_60%)] pointer-events-none"></div>

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-12 h-12 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-16 h-16 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-wide text-blue-300 drop-shadow-lg"
        >
          Welcome to AMS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-lg sm:text-xl font-light text-blue-100"
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
              boxShadow: "0px 10px 20px rgba(61, 90, 254, 0.4)",
            }}
            className="relative p-6 sm:p-8 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 
              text-center min-w-[200px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px] cursor-pointer hover:bg-white/30 transition-all duration-300"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-300 drop-shadow-lg">
              {item.count.toLocaleString()}+
            </h2>
            <p className="text-md sm:text-lg font-medium mt-2">{item.label}</p>

            {/* Glowing Border Effect on Hover */}
            <motion.div
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 border border-blue-400/40 rounded-2xl blur-md opacity-0 hover:opacity-100"
            ></motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
