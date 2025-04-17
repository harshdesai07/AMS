import axios from 'axios';
import { 
  Calendar, 
  Eye, 
  Menu, 
  Upload, 
  Users, 
  X, 
  BookOpen,
  GraduationCap,
  UserPlus,
  ChevronDown,
  School,
  UserCheck,
  UserX
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CollegeDataTable from "../data/CollegeDataTable";
import LogoutButton from "../ui/LogoutButton";

export default function CollegeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [viewType, setViewType] = useState(null);
  const collegeId = localStorage.getItem("collegeId");
  const collegeName = localStorage.getItem("collegeName");
  const token = localStorage.getItem("collegeToken");
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [hasCourses, setHasCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const facultyDropdownRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesResponse = await axios.get(
          `http://localhost:8080/courses/${collegeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (coursesResponse.status === 200 && coursesResponse.data && coursesResponse.data.length > 0) {
          setCourses(coursesResponse.data);
          setHasCourses(true);
        } else {
          setHasCourses(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setHasCourses(false);
        } else {
          console.error('Error fetching courses:', error);
          setHasCourses(false);
        }
      }
    };

    fetchCourses();
  }, [collegeId, token]);

  useEffect(() => {
    function handleClickOutside(event) {
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
    toast.error(`No ${type === "faculty" ? "faculty" : "students"} found. Please add ${type === "faculty" ? "faculty" : "students"} first.`);
  };

  const handleFileUpload = async (event, type) => {
    if (!hasCourses) {
      toast.error('Please add courses first');
      event.target.value = '';
      return;
    }

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
        const endpoint = `http://localhost:8080/uploadFacultyExcel/${collegeId}`;

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
          toast.success('Faculty data uploaded successfully! Processing...');
          setTimeout(() => {
            toast.success('Faculty data processed successfully!');
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
    if (!hasCourses) {
      toast.error('Please add courses first');
      return;
    }
    navigate(path, {
      state: { 
        userRole: "COLLEGE",
        courses: courses
      }
    });
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
          <div className="flex items-center space-x-3">
            <School className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{collegeName}</h2>
              <p className="text-sm text-gray-600">College Dashboard</p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
            <GraduationCap className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
            <Users className="w-5 h-5" />
            <span>Faculty</span>
          </button>
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer">
            <Calendar className="w-5 h-5" />
            <span>Attendance</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">College Dashboard</h2>
            <LogoutButton className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer" />
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Total Students</h3>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">1,200</p>
              <p className="text-sm text-gray-600 mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Present Today</h3>
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">950</p>
              <p className="text-sm text-gray-600 mt-2">79.2% attendance rate</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Absent Today</h3>
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">250</p>
              <p className="text-sm text-gray-600 mt-2">20.8% absence rate</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Faculty Actions */}
            <div className="relative" ref={facultyDropdownRef}>
              <button
                className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 w-full ${!hasCourses ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                onClick={() => {
                  if (hasCourses) {
                    setIsFacultyOpen(!isFacultyOpen);
                  }
                }}
                title={!hasCourses ? "Please add courses first" : ""}
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Add HOD</h3>
                  <p className="text-sm text-gray-600">Register or upload </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFacultyOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFacultyOpen && hasCourses && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center cursor-pointer"
                    onClick={() => {
                      setIsFacultyOpen(false);
                      handleNavigation(`/hodRegistration/${collegeId}`);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    HOD Registration
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
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer"
            >
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">View HOD</h3>
                <p className="text-sm text-gray-600">Access HOD records</p>
              </div>
            </button>

            {/* Course & Department */}
            <button
              onClick={() => navigate('/courseDepartment')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-4 cursor-pointer"
            >
              <div className="bg-amber-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-800">Course & Dept</h3>
                <p className="text-sm text-gray-600">Manage departments</p>
              </div>
            </button>

            
          </div>

          {/* View Section */}
          {viewType && (
            <div className="shadow-sm">
              <CollegeDataTable
                type={viewType}
                collegeId={collegeId}
                onNoRecords={handleNoRecords}
                token={token}
                userRole="COLLEGE"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}