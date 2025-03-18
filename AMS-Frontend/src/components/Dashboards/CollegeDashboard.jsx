import { Calendar, Eye, Menu, PlusCircle, Upload, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleNoRecords = (type) => {
    toast.error(`No ${type === "student" ? "students" : "faculty"} found.`);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (validTypes.includes(fileType)) {
        // Handle the Excel file upload here
        toast.success('Excel file uploaded successfully!');
      } else {
        toast.error('Please upload only Excel files (.xls or .xlsx)');
        event.target.value = ''; // Reset the input
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d2b] overflow-hidden">
      <Toaster position="top-center" />
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white/10 backdrop-blur-lg p-6 shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:relative md:translate-x-0 md:w-64`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">{collegeName}</h2>
          <Button
            variant="ghost"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <ul className="space-y-6">
          <li className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer transition-colors">
            <Users className="w-5 h-5" /> <span>Students</span>
          </li>
          <li className="flex items-center space-x-3 text-white/80 hover:text-white cursor-pointer transition-colors">
            <Calendar className="w-5 h-5" /> <span>Attendance</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white/10 backdrop-blur-lg p-4 shadow-lg sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <LogoutButton className="text-white hover:bg-white/10" />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="relative">
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                Click Me
              </Button>
              {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                    onClick={() => { setIsOpen(false); navigate("/route1"); }}
                  >
                    Go to Route 1
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </div>
                  </label>
                </div>
              )}
            </div>
            <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200"
              onClick={() => navigate(`/facultyRegistration/${collegeId}`)}
            >
              <PlusCircle className="w-5 h-5" /> <span>Add Faculty</span>
            </Button>
            <Button
              variant="outline"
              className="border border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200"
              onClick={() =>
                setViewType((prev) => (prev === "student" ? null : "student"))
              }
            >
              <Eye className="w-5 h-5" /> <span>View Students</span>
            </Button>
            <Button
              variant="outline"
              className="border border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200"
              onClick={() =>
                setViewType((prev) => (prev === "faculty" ? null : "faculty"))
              }
            >
              <Eye className="w-5 h-5" /> <span>View Faculty</span>
            </Button>
          </div>

          {viewType && (
            <CollegeDataTable
              type={viewType}
              collegeId={collegeId}
              onNoRecords={handleNoRecords}
            />
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white/80">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-white mt-2">1,200</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white/80">
                  Present Today
                </h3>
                <p className="text-3xl font-bold text-green-400 mt-2">950</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white/80">
                  Absent Today
                </h3>
                <p className="text-3xl font-bold text-red-400 mt-2">250</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}