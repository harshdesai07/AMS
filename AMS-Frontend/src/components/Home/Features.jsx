import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { icon: "📝", title: "Sign Up & Log In", desc: "Create your account & access your dashboard." },
    { icon: "✅", title: "Mark Attendance", desc: "Easily mark attendance with a single click." },
    { icon: "📊", title: "View Reports", desc: "Check attendance summaries & trends in real-time." },
    { icon: "📤", title: "Export & Analyze", desc: "Download & analyze attendance data effortlessly." }
  ];

  return (
    <section className="relative py-12 px-6 bg-[#0d0d2b] text-white overflow-hidden">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.3)_0%,rgba(9,9,121,0)_60%)] pointer-events-none"></div>

      {/* Floating Glow Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-10 h-10 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-14 h-14 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
      </div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-3xl sm:text-4xl font-extrabold text-center text-blue-300 drop-shadow-lg"
      >
        Key Features
      </motion.h2>

      {/* Steps Grid */}
      <div className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <StepCard key={index} icon={step.icon} title={step.title} desc={step.desc} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{
        scale: 1.06, // Slightly smaller hover scale
        rotateX: 5,
        rotateY: 5,
        boxShadow: "0px 10px 25px rgba(61, 90, 254, 0.4)",
      }}
      className="relative p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-md border border-white/30 
        text-center max-w-xs sm:max-w-sm mx-auto transition-all duration-300 cursor-pointer hover:bg-white/30"
    >
      <div className="text-4xl mb-3 drop-shadow-lg text-blue-300">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-white/90 text-sm">{desc}</p>

      {/* Glowing Border Effect on Hover */}
      <motion.div
        animate={{
          opacity: 1,
          scale: 1.06,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 border border-blue-400/40 rounded-2xl blur-md opacity-0 hover:opacity-100"
      ></motion.div>
    </motion.div>
  );
}
