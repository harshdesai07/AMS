import { motion } from "framer-motion";
import { GraduationCap, LogIn, User, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Login Button with smooth transition */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium 
                   rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7a00f5] shadow-md 
                   hover:shadow-[#00c8ff]/50 hover:scale-105 transition-all duration-300"
        aria-expanded={isOpen}
      >
        <LogIn className="w-5 h-5" />
        Login
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute right-0 mt-2 w-52 bg-[#26264d] backdrop-blur-lg shadow-xl 
                     rounded-lg border border-[#33335a] overflow-hidden"
        >
          <ul className="py-2">
            {[
              { label: "College Login", icon: <GraduationCap className="w-5 h-5" />, path: "/CollegeLogin" },
              { label: "Student Login", icon: <User className="w-5 h-5" />, path: "/StudentLogin" },
              { label: "Faculty Login", icon: <Users className="w-5 h-5" />, path: "/FacultyLogin" },
            ].map(({ label, icon, path }, index) => (
              <motion.li
                key={index}
                whileHover={{
                  backgroundColor: "rgba(0, 195, 255, 0.2)", // Light cyan glow
                  boxShadow: "0px 5px 15px rgba(0, 195, 255, 0.3)", // Subtle blue glow
                  scale: 1.05, // Slight pop-up effect
                  transition: { duration: 0.25, ease: "easeOut" }, // Faster transition
                }}
              >
                <button
                  className="block w-full text-left px-4 py-3 flex items-center gap-3 text-white 
                             font-medium transition-all duration-300"
                  onClick={() => navigate(path)}
                >
                  {icon} {label}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
