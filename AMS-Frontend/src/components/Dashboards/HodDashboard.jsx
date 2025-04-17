import axios from "axios";
import {
  ChevronDown,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  Menu,
  Upload,
  UserPlus,
  Users,
  X
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CollegeDataTable from "../data/CollegeDataTable";

function HodDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewType, setViewType] = useState(null);
  const [isStudentOpen, setIsStudentOpen] = useState(false);
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const studentDropdownRef = useRef(null);
  const facultyDropdownRef = useRef(null);
  const subjectDropdownRef = useRef(null);
  const departmentName = localStorage.getItem("departmentName");
  const token = localStorage.getItem("hodToken");
  const collegeId = localStorage.getItem("collegeId");

  useEffect(() => {
    function handleClickOutside(event) {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target)) {
        setIsStudentOpen(false);
      }
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(event.target)) {
        setIsFacultyOpen(false);
      }
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(event.target)) {
        setIsSubjectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileUpload = async (event, type) => {
    if (!event.target.files || event.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

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
          endpoint = `http://localhost:8080/addSubjectsExcel`;
        }

        const response = await axios.post(
          endpoint,
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
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
      event.target.value = '';
    }
  };

  const handleNavigation = (path) => {
    navigate(path, {
      state: { 
        userRole: "HOD",
      }
    });
  };

  const handleNoRecords = (type) => {
    toast.error(`No ${type === "faculty" ? "faculty" : type === "student" ? "students" : "subjects"} found. Please add ${type === "faculty" ? "faculty" : type === "student" ? "students" : "subjects"} first.`);
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
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
            <Users className="w-5 h-5" />
            <span>Faculty</span>
          </button>
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
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
              onClick={() => navigate("/")}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Department Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Total Faculty</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">24</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">320</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Active Subjects</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">12</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student Actions */}
            <div className="relative" ref={studentDropdownRef}>
              <button
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 w-full"
                onClick={() => {
                  setIsStudentOpen(!isStudentOpen);
                  setIsFacultyOpen(false);
                  setIsSubjectOpen(false);
                }}
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">Add Student</h3>
                  <p className="text-sm text-gray-600 cursor-pointer">Register or upload students</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isStudentOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStudentOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => {
                      setIsStudentOpen(false);
                      handleNavigation(`/studentRegistration/${collegeId}`);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Student Registration
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'student')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* View Students */}
            <button
              onClick={() => setViewType((prev) => (prev === "student" ? null : "student"))}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">View Students</h3>
                <p className="text-sm text-gray-600">Access student records</p>
              </div>
            </button>

            {/* Faculty Actions */}
            <div className="relative" ref={facultyDropdownRef}>
              <button
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 w-full"
                onClick={() => {
                  setIsFacultyOpen(!isFacultyOpen);
                  setIsStudentOpen(false);
                  setIsSubjectOpen(false);
                }}
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">Add Faculty</h3>
                  <p className="text-sm text-gray-600 ">Register or upload faculty</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFacultyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFacultyOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => {
                      setIsFacultyOpen(false);
                      handleNavigation(`/facultyRegistration/${collegeId}`);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Faculty Registration
                  </button>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'faculty')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* View Faculty */}
            <button
              onClick={() => setViewType((prev) => (prev === "faculty" ? null : "faculty"))}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">View Faculty</h3>
                <p className="text-sm text-gray-600">Access faculty records</p>
              </div>
            </button>

            {/* Subject Actions */}
            <div className="relative" ref={subjectDropdownRef}>
              <button
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 w-full"
                onClick={() => {
                  setIsSubjectOpen(!isSubjectOpen);
                  setIsStudentOpen(false);
                  setIsFacultyOpen(false);
                }}
              >
                <div className="bg-amber-100 p-3 rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">Add Subject</h3>
                  <p className="text-sm text-gray-600">Upload subject data</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSubjectOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSubjectOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                  <div className="w-full px-4 py-3 text-left text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => navigate("/semesterSubject")}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Add Subjects
                    </div>
                  <label className="relative w-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => handleFileUpload(e, 'subject')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 text-left text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center ">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </div>
                    
                  </label>

                  
                </div>
              )}
            </div>

            {/* View Subjects */}
            <button
              onClick={() => setViewType((prev) => (prev === "subjects" ? null : "subjects"))}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4"
            >
              <div className="bg-amber-100 p-3 rounded-lg cursor-pointer">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left ">
                <h3 className="text-lg font-semibold text-gray-800 cursor-pointer">View Subjects</h3>
                <p className="text-sm text-gray-600">Access subject records</p>
              </div>
            </button>
          </div>

          {/* View Section */}
          {viewType && (
            <div className="shadow-sm ">
              <CollegeDataTable
                type={viewType}
                collegeId={collegeId}
                onNoRecords={handleNoRecords}
                token={token}
                userRole="HOD"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HodDashboard;