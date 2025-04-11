import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  ClipboardList,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

function HodDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState(null);
  const departmentId = "123"; // This would come from your auth context
  const departmentName = "Computer Science"; // This would come from your auth context

  const handleViewFaculty = () => {
    setViewType("faculty");
    toast.success("Loading faculty members...");
  };

  const handleViewStudents = () => {
    setViewType("students");
    toast.success("Loading students...");
  };

  const handleAddSubject = () => {
    toast.success("Opening subject form...");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64`}
      >
        <div className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {departmentName}
            </h2>
            <p className="text-sm text-gray-600">Head of Department</p>
          </div>
          <button
            className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={handleViewFaculty}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <Users className="w-5 h-5" />
            <span>Faculty</span>
          </button>
          <button
            onClick={handleViewStudents}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Students</span>
          </button>
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
            <ClipboardList className="w-5 h-5" />
            <span>Subjects</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              Department Dashboard
            </h2>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* View Faculty */}
            <button
              onClick={handleViewFaculty}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  View Faculty
                </h3>
                <p className="text-sm text-gray-600">
                  Manage department faculty
                </p>
              </div>
            </button>

            {/* View Students */}
            <button
              onClick={handleViewStudents}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-green-100 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  View Students
                </h3>
                <p className="text-sm text-gray-600">Access student records</p>
              </div>
            </button>

            {/* Add Subject */}
            <button
              onClick={handleAddSubject}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Subject
                </h3>
                <p className="text-sm text-gray-600">Create new subject</p>
              </div>
            </button>
          </div>

          {/* Department Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Faculty
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Students
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">320</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">
                Active Subjects
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">12</p>
            </div>
          </div>

          {/* View Section */}
          {viewType && (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {viewType === "faculty"
                  ? "Faculty Members"
                  : "Department Students"}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {viewType === "faculty" ? "Specialization" : "Year"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sample row - You would map through your actual data here */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {viewType === "faculty"
                            ? "Dr. John Doe"
                            : "Alice Johnson"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {viewType === "faculty" ? "FAC001" : "STU001"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {viewType === "faculty"
                            ? "Data Science"
                            : "Third Year"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HodDashboard;