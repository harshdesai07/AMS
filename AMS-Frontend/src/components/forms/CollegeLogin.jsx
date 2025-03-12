import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CollegeLogin() {
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const navigate = useNavigate(); // Hook for redirection

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCollegeEmail(email);

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Final email validation before submission
    if (!validateEmail(collegeEmail)) {
      setEmailError("Invalid email format");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/collegelogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collegeEmail, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login Successful:", data.message);
        sessionStorage.setItem("collegeId", data.collegeId);
        sessionStorage.setItem("collegeName", data.collegeName);  
        navigate("/collegeDashboard"); // Redirect to dashboard
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">College Login</h2>
        
        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* College Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              College Email
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                emailError ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter College Email"
              value={collegeEmail}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
