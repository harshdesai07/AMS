import { Calendar, Eye, Menu, PlusCircle, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CollegeDataTable from "../data/CollegeDataTable";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import LogoutButton from "../ui/LogoutButton";

const data = [
  { name: "Mon", Present: 80, Absent: 20 },
  { name: "Tue", Present: 85, Absent: 15 },
  { name: "Wed", Present: 75, Absent: 25 },
  { name: "Thu", Present: 90, Absent: 10 },
  { name: "Fri", Present: 70, Absent: 30 },
];

export default function CollegeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [viewType, setViewType] = useState(null);
  const collegeId = sessionStorage.getItem("collegeId");
  const collegeName = sessionStorage.getItem("collegeName");

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-auto">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white p-4 shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform md:relative md:translate-x-0 md:w-56 lg:w-64`}
      >

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{collegeName}</h2>
          <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X />
          </Button>
        </div>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer">
            <Users /> <span>Students</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer">
            <Calendar /> <span>Attendance</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <div className="flex items-center bg-white p-4 shadow-lg sticky top-0 z-40 relative">
          {/* Sidebar Toggle Button (on the left) */}
          <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            <Menu />
          </Button>

          {/* Dashboard Title - Centered */}
          <h2 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">Dashboard</h2>

          {/* Logout Button - Pushed to the right */}
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>


        <div className="p-4 space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="default" className="flex items-center space-x-2 text-sm" onClick={() => navigate(`/studentRegistration/${collegeId}`)}>
              <PlusCircle /> <span>Add Student</span>
            </Button>
            <Button variant="default" className="flex items-center space-x-2 text-sm" onClick={() => navigate(`/facultyRegistration/${collegeId}`)}>
              <PlusCircle /> <span>Add Faculty</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setViewType((prev) => (prev === "student" ? null : "student"))}
            >
              <Eye /> <span>View Students</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setViewType((prev) => (prev === "faculty" ? null : "faculty"))}
            >
              <Eye /> <span>View Faculty</span>
            </Button>

          </div>

          {viewType && <CollegeDataTable type={viewType} collegeId={collegeId} />}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><h3 className="text-lg font-bold">Total Students</h3><p className="text-2xl">1200</p></CardContent></Card>
            <Card><CardContent className="p-4"><h3 className="text-lg font-bold">Present Today</h3><p className="text-2xl">950</p></CardContent></Card>
            <Card><CardContent className="p-4"><h3 className="text-lg font-bold">Absent Today</h3><p className="text-2xl">250</p></CardContent></Card>
          </div>


        </div>
      </div>
    </div>
  );
}
