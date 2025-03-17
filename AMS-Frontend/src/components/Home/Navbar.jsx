import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import download from "../../assets/download.png";
import LoginDropdown from "../ui/LoginDropdown";
import { HiUserAdd } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center 
      bg-[#1c1c3c] shadow-md border-b border-[#33335a]">
      
      {/* Logo & Brand Name */}
      <div className="flex items-center gap-4">
        <img
          src={download}
          alt="Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full drop-shadow-md transition-all duration-300 hover:scale-105"
        />
        <h2 className="text-lg sm:text-2xl font-semibold text-white tracking-wide whitespace-nowrap">
          Attendance System
        </h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/register">
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2 text-white text-sm font-medium rounded-full 
            bg-gradient-to-r from-[#00c8ff] to-[#7a00f5] shadow-md transition-all duration-300 
            hover:scale-105 hover:shadow-[#00c8ff]/50">
            <HiUserAdd className="w-5 h-5" />
            Sign Up
          </button>
        </Link>
        <LoginDropdown />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full bg-[#26264d] backdrop-blur-lg shadow-xl p-6 flex flex-col gap-5 
              rounded-lg md:hidden transition-all duration-300 border border-[#33335a]"
          >
            {/* Sign Up Button */}
            <Link to="/register">
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-white text-sm font-medium 
                rounded-full bg-gradient-to-r from-[#00c8ff] to-[#7a00f5] shadow-md hover:scale-105 
                transition-all duration-300 hover:shadow-[#00c8ff]/50">
                <HiUserAdd className="w-5 h-5" />
                Sign Up
              </button>
            </Link>

            {/* Login Button (Inside Dropdown) */}
            <LoginDropdown />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
