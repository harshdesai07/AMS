import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { number: "1️⃣", title: "Sign Up & Log In" },
    { number: "2️⃣", title: "Mark Attendance" },
    { number: "3️⃣", title: "View Reports" },
    { number: "4️⃣", title: "Export & Analyze" },
  ];

  return (
    <section className="relative text-center py-16 px-6 bg-[#0d0d2b] text-white overflow-hidden">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.3)_0%,rgba(9,9,121,0)_60%)] pointer-events-none"></div>

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-10 h-10 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-16 h-16 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
      </div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-3xl sm:text-4xl font-extrabold tracking-wide text-blue-300 drop-shadow-lg"
      >
        How It Works
      </motion.h2>

      {/* Steps Grid */}
      <div className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <StepCard key={index} number={step.number} title={step.title} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ number, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{
        scale: 1.07,
        rotateX: 5,
        rotateY: 5,
        boxShadow: "0px 10px 20px rgba(61, 90, 254, 0.4)",
      }}
      className="relative p-4 sm:p-5 md:p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 
        text-center max-w-[180px] sm:max-w-[220px] mx-auto transition-all duration-300 cursor-pointer hover:bg-white/30"
    >
      <h3 className="text-3xl sm:text-4xl font-bold drop-shadow-lg text-blue-300">{number}</h3>
      <p className="mt-2 text-md sm:text-lg font-semibold">{title}</p>

      {/* Glowing Border Effect on Hover */}
      <motion.div
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 border border-blue-400/40 rounded-2xl blur-md opacity-0 hover:opacity-100"
      ></motion.div>
    </motion.div>
  );
}
