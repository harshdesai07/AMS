import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="relative py-16 px-6 bg-[#0d0d2b] text-white text-center overflow-hidden">
      {/* Neon Glow Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(61,90,254,0.3)_0%,rgba(9,9,121,0)_60%)] pointer-events-none"></div>

      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-extrabold tracking-wide text-blue-300 drop-shadow-lg relative z-10"
      >
        Contact Us
      </motion.h2>

      {/* Contact Details */}
      <div className="relative z-10 mt-6 flex flex-col items-center space-y-4 text-lg">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 bg-white/10 p-3 rounded-lg shadow-lg hover:bg-white/20 transition"
        >
          <FaEnvelope className="text-blue-300 text-xl" /> support@ams.com
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 bg-white/10 p-3 rounded-lg shadow-lg hover:bg-white/20 transition"
        >
          <FaMapMarkerAlt className="text-blue-300 text-xl" /> Bhopal, India
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 p-3 rounded-lg shadow-lg hover:bg-white/20 transition"
        >
          📲 Follow us on social media
        </motion.p>

        {/* Social Media Icons */}
        <div className="flex space-x-6 mt-3">
          {[FaFacebook, FaTwitter, FaLinkedin].map((Icon, index) => (
            <motion.a
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5, color: "#3D5AFE" }}
              className="text-blue-300 text-3xl cursor-pointer transition-all duration-300 hover:text-blue-500"
              href="#"
            >
              <Icon />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
