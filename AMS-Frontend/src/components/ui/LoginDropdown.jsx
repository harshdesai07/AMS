import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
      >
        <LogIn className="w-5 h-5" /> Login
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          <ul className="py-2">
            <li>
              <button className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center gap-2"
              onClick={() => navigate("/CollegeLogin")} >
                <LogIn className="w-4 h-4" /> College Login
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-2"
              onClick={() => navigate("/StudentLogin")}>
                <LogIn className="w-4 h-4" /> Student Login
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-2"
              onClick={() => navigate("/FacultyLogin")}>
                <LogIn className="w-4 h-4" /> Faculty Login
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
