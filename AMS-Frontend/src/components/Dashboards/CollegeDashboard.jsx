import axios from 'axios';
import { Calendar, Eye, Menu, PlusCircle, Upload, Users, X, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
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
  const [isStudentOpen, setIsStudentOpen] = useState(false);
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const studentDropdownRef = useRef(null);
  const facultyDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target)) {
        setIsStudentOpen(false);
      }
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(event.target)) {
        setIsFacultyOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNoRecords = (type) => {
    toast.error(`No ${type === "student" ? "students" : "faculty"} found.`);
  };

  const handleFileUpload = async (event, type) => {
    if (!event.target.files || event.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    console.log("File selected:", file);

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const fileType = file.type;

    if (validTypes.includes(fileType)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        let endpoint;
        if (type === 'student') {
          endpoint = `http://localhost:8080/uploadStudentExcel/${collegeId}`;
        } else if (type === 'faculty') {
          endpoint = `http://localhost:8080/uploadFacultyExcel/${collegeId}`;
        } else if (type === 'subject') {
          endpoint = `http://localhost:8080/uploadSubjects/${collegeId}`;
        }

        const response = await axios.post(
          endpoint,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        if (response.status === 200) {
          console.log("Upload success:", response);
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data uploaded successfully! Processing...`);

          setTimeout(() => {
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data processed successfully!`);
          }, 2000);
        } else {
          toast.error('File upload failed. Please try again.');
        }
      } catch (error) {
        toast.error('Error uploading file: ' + error.message);
      }
    } else {
      toast.error('Please upload only Excel files (.xls or .xlsx)');
      event.target.value = ''; // Reset the input
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0d2b] overflow-hidden">
      <Toaster position="top-center" />
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white/10 backdrop-blur-lg p-6 shadow-2xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            {/* Student Actions */}
            <div className="relative flex-1" ref={studentDropdownRef}>
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() => {
                  setIsStudentOpen(!isStudentOpen);
                  setIsFacultyOpen(false);
                }}
              >
                <PlusCircle className="w-5 h-5" /> <span>Add Student</span>
              </Button>
              {isStudentOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setIsStudentOpen(false);
                      navigate(`/studentRegistration/${collegeId}`);
                    }}
                  >
                    Student Registration
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'student')}
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

            {/* Faculty Actions */}
            <div className="relative flex-1" ref={facultyDropdownRef}>
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() => {
                  setIsFacultyOpen(!isFacultyOpen);
                  setIsStudentOpen(false);
                }}
              >
                <PlusCircle className="w-5 h-5" /> <span>Add Faculty</span>
              </Button>
              {isFacultyOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setIsFacultyOpen(false);
                      navigate(`/facultyRegistration/${collegeId}`);
                    }}
                  >
                    Faculty Registration
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'faculty')}
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

            {/* Add subject Button */}
            <div className="relative flex-1">
              <label className="relative w-full flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => handleFileUpload(e, 'subject')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                >
                  <PlusCircle className="w-5 h-5" /> <span>Add Subject</span>
                </Button>
              </label>
            </div>

            {/* Course Department Button */}
            <div className="relative flex-1">
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() => navigate('/courseDepartment')}
              >
                <BookOpen className="w-5 h-5" /> <span>Course & Department</span>
              </Button>
            </div>

            {/* View Students Button */}
            <div className="relative flex-1">
              <Button
                variant="outline"
                className="border border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() =>
                  setViewType((prev) => (prev === "student" ? null : "student"))
                }
              >
                <Eye className="w-5 h-5" /> <span>View Students</span>
              </Button>
            </div>

            {/* View Faculty Button */}
            <div className="relative flex-1">
              <Button
                variant="outline"
                className="border border-white/20 text-white hover:bg-white/10 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all duration-200 w-full"
                onClick={() =>
                  setViewType((prev) => (prev === "faculty" ? null : "faculty"))
                }
              >
                <Eye className="w-5 h-5" /> <span>View Faculty</span>
              </Button>
            </div>
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