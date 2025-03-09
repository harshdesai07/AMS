import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FacultyLogin() {
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await fetch("http://localhost:8080/studentlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, studentPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login Successful:", data.message);
        navigate("/studentDashboard"); // Redirect to dashboard
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
        <h2 className="text-2xl font-semibold text-center mb-4">
          Student Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Error Message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Student ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
            />
          </div>
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