import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export default function FacultyLogin() {
  const [facultyId, setFacultyId] = useState("");
  const [facultyPassword, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/facultylogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ facultyId, facultyPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login Successful:", data.message);
        navigate("/facultyDashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your faculty account</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Faculty ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your faculty ID"
                    required
                  />
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={facultyPassword}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full py-3 text-lg flex items-center justify-center group"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Need help? Contact{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            faculty support
          </a>
        </p>
      </div>
    </div>
  );
}