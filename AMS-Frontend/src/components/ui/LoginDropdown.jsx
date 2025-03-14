import { motion } from "framer-motion";
import { LogIn, GraduationCap, User, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-green-500 to-blue-600 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:from-green-600 hover:to-blue-700"
        aria-expanded={isOpen}
      >
        <LogIn className="w-5 h-5" /> Login
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute right-0 mt-2 w-52 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-lg border border-gray-300 overflow-hidden"
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
                  backgroundColor: "rgba(0, 120, 255, 0.15)", // Stronger blue highlight
                  boxShadow: "0px 5px 15px rgba(0, 120, 255, 0.3)", // More intense glow effect
                  scale: 1.05, // Slightly larger pop-up effect
                  transition: { duration: 0.25, ease: "easeOut" }, // Faster transition
                }}
              >
                <button
                  className="block w-full text-left px-4 py-3 flex items-center gap-3 text-gray-800 font-medium transition-all duration-300"
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
