import { motion } from "framer-motion";
import { useState } from "react";

export default function Testimonials() {
  const testimonials = [
    { name: "John Doe", feedback: "AMS has made attendance tracking effortless for our team!", rating: 5 },
    { name: "Sarah Lee", feedback: "User-friendly interface and real-time updates. Highly recommended!", rating: 4 },
    { name: "Michael Chen", feedback: "Best attendance system we've used. Clean UI & powerful features!", rating: 5 },
    { name: "Emma Watson", feedback: "Very intuitive and efficient. Simplifies attendance tracking a lot!", rating: 4 },
  ];

  return (
    <section className="relative py-16 px-6 bg-[#0d0d2b] text-white text-center overflow-hidden">
      {/* Neon Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.3)_0%,rgba(9,9,121,0)_60%)] pointer-events-none"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-10 h-10 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-16 h-16 bg-white/10 blur-3xl rounded-full animate-pulse"></div>
      </div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-4xl sm:text-5xl font-extrabold tracking-wide text-blue-300 drop-shadow-lg"
      >
        What Users Say
      </motion.h2>

      {/* Testimonials Grid */}
      <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            feedback={testimonial.feedback}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ name, feedback, rating }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{
        scale: 1.08,
        rotateX: hovered ? 6 : 0,
        rotateY: hovered ? 6 : 0,
        boxShadow: "0px 12px 30px rgba(61, 90, 254, 0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30
      text-center max-w-sm mx-auto transition-all duration-300 cursor-pointer hover:bg-white/30"
    >
      {/* Star Rating */}
      <div className="flex justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: i < rating ? 1.2 : 1 }}
            className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-400"}`}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <p className="italic text-white/90">"{feedback}"</p>
      <h3 className="mt-4 font-bold text-lg text-blue-300">{name}</h3>

      {/* Glowing Border Effect on Hover */}
      <motion.div
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 border-2 border-blue-400/50 rounded-2xl blur-md"
      ></motion.div>
    </motion.div>
  );
}
