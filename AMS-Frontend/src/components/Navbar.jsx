import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import download from "../assets/download.png";
import LoginDropdown from "./ui/LoginDropdown";
import { HiUserAdd } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      {/* Logo & Brand Name */}
      <div className="flex items-center gap-4">
        <img
          src={download}
          alt="Logo"
          className="w-12 h-12 rounded-full drop-shadow-lg"
        />
        <h2 className="text-2xl font-bold text-white">Attendance System</h2>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex gap-4">
        <Link to="/register">
        <button className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-md hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300">
      <HiUserAdd className="w-5 h-5" />
      Sign Up
    </button>
        </Link>
        <LoginDropdown />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col gap-4 md:hidden">
          <Link to="/register">
        <button className="flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-md hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300">
      <HiUserAdd className="w-5 h-5" />
      Sign Up
    </button>
        </Link>
          <LoginDropdown />
        </div>
      )}
    </nav>
  );
}
