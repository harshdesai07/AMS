import { useState, useEffect } from "react";
import { Menu, Calendar, Users, X } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import AccountDropdown from "../ui/AccountDropdown";

// Mocked Logged-in Student Data (Replace with API call)
const loggedInStudent = {
  id: 1,
  name: "Alice Johnson",
  semester: "Semester 1",
  department: "Computer Science",
};

// Mocked Attendance Data (Replace with API)
const attendanceData = {
  "Semester 1": {
    subjects: {
      "Mathematics": { totalClasses: 20, attended: 18 },
      "Physics": { totalClasses: 22, attended: 19 },
      "Computer Science": { totalClasses: 25, attended: 20 },
      "Chemistry": { totalClasses: 18, attended: 15 },
    },
  },
  "Semester 2": {
    subjects: {
      "Mathematics": { totalClasses: 20, attended: 16 },
      "Physics": { totalClasses: 21, attended: 18 },
      "Computer Science": { totalClasses: 23, attended: 21 },
      "Chemistry": { totalClasses: 19, attended: 14 },
    },
  },
};

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [overallPercentage, setOverallPercentage] = useState(0);

  useEffect(() => {
    // Get attendance for logged-in student's semester
    const semesterData = attendanceData[loggedInStudent.semester];
    if (semesterData) {
      setAttendance(semesterData.subjects);

      // Calculate total percentage
      let totalClasses = 0;
      let totalAttended = 0;
      Object.values(semesterData.subjects).forEach(({ totalClasses: tc, attended: ta }) => {
        totalClasses += tc;
        totalAttended += ta;
      });

      const percentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : 0;
      setOverallPercentage(percentage);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 ${
          sidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed md:static left-0 top-0 h-full bg-white shadow-lg p-4 w-64 z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Student Dashboard</h2>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </Button>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-blue-600">
            <Users /> <span>My Profile</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-blue-600">
            <Calendar /> <span>My Attendance</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md">
          <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <AccountDropdown />
        </div>

        {/* Student Information */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Welcome, {loggedInStudent.name}!</h3>
          <p className="text-gray-600">
            <strong>Department:</strong> {loggedInStudent.department} <br />
            <strong>Semester:</strong> {loggedInStudent.semester}
          </p>
        </div>

        {/* Attendance List */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Your Attendance</h3>
          {attendance ? (
            <div className="space-y-4">
              {Object.entries(attendance).map(([subject, { totalClasses, attended }]) => (
                <Card key={subject} className="w-full">
                  <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <span className="text-center sm:text-left font-semibold">{subject}</span>
                    <span className="text-sm text-gray-600">
                      {attended} / {totalClasses} classes attended
                    </span>
                    <span
                      className={`px-4 py-1 rounded text-sm font-semibold ${
                        (attended / totalClasses) * 100 >= 75
                          ? "bg-green-400 text-green-800"
                          : "bg-red-400 text-red-800"
                      }`}
                    >
                      {((attended / totalClasses) * 100).toFixed(2)}%
                    </span>
                  </CardContent>
                </Card>
              ))}
              {/* Overall Attendance */}
              <div className="bg-white p-4 shadow-md rounded-lg mt-4">
                <h3 className="text-lg font-semibold">Overall Attendance</h3>
                <p className="text-xl font-bold">
                  {overallPercentage}%
                </p>
                <p className={`text-sm font-medium ${overallPercentage >= 75 ? "text-green-600" : "text-red-600"}`}>
                  {overallPercentage >= 75 ? "You are eligible for exams" : "Low attendance! Improve your attendance."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
