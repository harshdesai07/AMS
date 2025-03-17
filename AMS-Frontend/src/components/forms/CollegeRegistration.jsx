import { Building2, GraduationCap, Lock, Mail, School } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import collegeList from "../data/collegeList";

export default function CollegeRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    collegeName: "",
    email: "",
    type: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });

    if (e.target.name === "collegeName") {
      if (value === "") {
        setShowDropdown(false);
        return;
      }

      const filtered = collegeList.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredColleges(filtered);
      setShowDropdown(filtered.length > 0);
    }

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSelectCollege = (college) => {
    setFormData({ ...formData, collegeName: college });
    setShowDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.type) {
      newErrors.type = "Please select a type of institution";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading("Registering...");

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/"), 1500);
      } else if (response.status === 409) {
        if (responseData.message.includes("College already exists")) {
          toast.error("This college name is already registered");
        } else if (responseData.message.includes("Email already exists")) {
          toast.error("This email is already registered");
        } else {
          toast.error("A duplicate entry exists");
        }
      } else {
        toast.error(responseData.message || "Registration failed");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again");
      console.error("Network Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d2b] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="w-10 h-10 text-blue-400" />
          <h2 className="text-3xl font-bold text-white ml-3">
            College Registration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* College Name Field */}
          <div className="relative">
            <div className="flex items-center space-x-2 text-white mb-2">
              <School className="w-5 h-5" />
              <label className="text-sm font-medium">College Name</label>
            </div>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="Enter college name"
              autoComplete="off"
            />
            {showDropdown && (
              <ul className="absolute z-10 mt-1 w-full bg-[#1a1a3f] border border-white/10 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                {filteredColleges.map((college, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectCollege(college)}
                    className="p-3 hover:bg-white/5 cursor-pointer text-white"
                  >
                    {college}
                  </li>
                ))}
              </ul>
            )}
            {errors.collegeName && (
              <p className="text-red-400 text-sm mt-1">{errors.collegeName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Mail className="w-5 h-5" />
              <label className="text-sm font-medium">Email Address</label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Institution Type */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Building2 className="w-5 h-5" />
              <label className="text-sm font-medium">Type of Institution</label>
            </div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              <option value="" className="bg-[#1a1a3f]">
                Select Type
              </option>
              <option value="Private" className="bg-[#1a1a3f]">
                Private
              </option>
              <option value="Government" className="bg-[#1a1a3f]">
                Government
              </option>
              <option value="Autonomous" className="bg-[#1a1a3f]">
                Autonomous
              </option>
            </select>
            {errors.type && (
              <p className="text-red-400 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-white mb-2">
                <Lock className="w-5 h-5" />
                <label className="text-sm font-medium">Password</label>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 text-white mb-2">
                <Lock className="w-5 h-5" />
                <label className="text-sm font-medium">Confirm Password</label>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}