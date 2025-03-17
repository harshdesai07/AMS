import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function CollegeLogin() {
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCollegeEmail(email);

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(collegeEmail)) {
      setEmailError("Invalid email format");
      return;
    }

    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await fetch("http://localhost:8080/collegelogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeEmail, password }),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        sessionStorage.setItem("collegeId", data.collegeId);
        sessionStorage.setItem("collegeName", data.collegeName);
        toast.success("Login successful!");
        setTimeout(() => navigate("/collegeDashboard"), 1500);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Server error, please try again later");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d2b] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="w-10 h-10 text-blue-400" />
          <h2 className="text-3xl font-bold text-white ml-3">College Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Mail className="w-5 h-5" />
              <label className="text-sm font-medium">College Email</label>
            </div>
            <input
              type="email"
              value={collegeEmail}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="your@college.edu"
              required
            />
            {emailError && (
              <p className="text-red-400 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Lock className="w-5 h-5" />
              <label className="text-sm font-medium">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}