import { useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeList from "../data/collegeList";

export default function CollegeRegistration() {
  const navigate = useNavigate(); // Hook for navigation


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

  // Handle input change
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

    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  // Handle college selection
  const handleSelectCollege = (college) => {
    setFormData({ ...formData, collegeName: college });
    setShowDropdown(false);
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {};

    if (!formData.collegeName.trim())
      errors.collegeName = "College Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.type) errors.type = "Please select a type of institution";
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitting Data:", formData);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/collegeDashboard");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        College Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* College Name Field with Auto-Suggest Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            College Name
          </label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
            autoComplete="off"
          />
          {showDropdown && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto">
              {filteredColleges.map((college, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectCollege(college)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {college}
                </li>
              ))}
            </ul>
          )}
          {errors.collegeName && (
            <p className="text-red-500 text-sm">{errors.collegeName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Type of Institution */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Institution
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
          >
            <option value="">Select Type</option>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
            <option value="Autonomous">Autonomous</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
