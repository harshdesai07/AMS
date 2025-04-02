import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function StudentRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state?.student || null;
  const { id: paramId } = useParams();
  const studentId = paramId || studentData?.studentId;
  const BASE_URL = "http://localhost:8080";
  const collegeId = sessionStorage.getItem("collegeId");

  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentNumber: "",
    studentParentsNumber: "",
    studentDepartment: "",
    studentSem: "",
    countryCode: "+1",
    parentCountryCode: "+1",
    courseId: "",
    courseName: "",
  });

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseMap, setCourseMap] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const extractCountryCode = (phoneNumber) => {
      const match = phoneNumber?.match(/^(\+\d{1,2})/);
      return match ? match[0] : "+1";
    };

    const extractPhoneNumber = (phoneNumber) => {
      return phoneNumber?.replace(/^(\+\d{1,2})/, "") || "";
    };

    if (studentData) {
      setFormData({
        studentName: studentData.studentName || "",
        studentEmail: studentData.studentEmail || "",
        studentNumber: extractPhoneNumber(studentData.studentNumber),
        studentParentsNumber: extractPhoneNumber(studentData.studentParentsNumber),
        studentDepartment: studentData.studentDepartment || "",
        studentSem: studentData.studentSem || "",
        countryCode: extractCountryCode(studentData.studentNumber),
        parentCountryCode: extractCountryCode(studentData.studentParentsNumber),
        courseId: studentData.courseId || "",
        courseName: studentData.courseName || "",
      });

      if (studentData.courseId) {
        setSelectedCourseId(studentData.courseId);
        fetchDepartments(studentData.courseId);
        fetchSemesters(studentData.courseId);
      }
    }
  }, [studentData]);


  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/courses/${collegeId}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
  
      // Convert the array into an object
      const newCourseMap = data.reduce((acc, course) => {
        acc[course.id] = course.name;
        return acc;
      }, {});
  
      setCourseMap(newCourseMap); // ✅ Store in state so UI updates
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchDepartments = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/getDepartments/${collegeId}/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();

      const departmentsList = Array.isArray(data) ? data : data.departments || [];
      setDepartments(departmentsList);
      setShowDepartment(departmentsList.length > 0);

      setFormData(prev => ({
        ...prev,
        studentDepartment: "",
      }));
    } catch (error) {
      console.error(error);
      setDepartments([]);
      setShowDepartment(false);
      setFormData(prev => ({
        ...prev,
        studentDepartment: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/getSemester/${courseId}`);
      if (!response.ok) throw new Error("Failed to fetch semesters");
      const data = await response.json();

      const semestersList = Array.isArray(data) ? data : [];
      setSemesters(semestersList);

      setFormData(prev => ({
        ...prev,
        studentSem: "",
      }));
    } catch (error) {
      toast.error("Failed to fetch semesters");
      console.error(error);
      setSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, name) => {
    if (name === "courseId") {
      const courseName = courseMap[value]; // Direct lookup from global courseMap

      if (courseName) {
        console.log("Selected Course:", { id: value, name: courseName }); // Debugging line

        setFormData(prev => ({
          ...prev,
          courseId: value,  // Store course ID
          courseName: courseName  // Store course name from courseMap
        }));

        setSelectedCourseId(value);
        fetchDepartments(value);
        fetchSemesters(value);
      } else {
        console.error("Course not found for ID:", value);

        setFormData(prev => ({
          ...prev,
          courseId: "",
          courseName: ""
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    setErrors(prev => ({ ...prev, [name]: "" }));
  };



  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.courseId) {
      newErrors.courseId = "Course selection is required";
      isValid = false;
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Name is required";
      isValid = false;
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.studentEmail)) {
      newErrors.studentEmail = "Invalid email format";
      isValid = false;
    }

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.studentNumber)) {
      newErrors.studentNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (!formData.studentParentsNumber.trim()) {
      newErrors.studentParentsNumber = "Parent's phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.studentParentsNumber)) {
      newErrors.studentParentsNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (formData.studentNumber === formData.studentParentsNumber &&
      formData.countryCode === formData.parentCountryCode) {
      newErrors.studentParentsNumber = "Parent's phone number must be different from student's number";
      isValid = false;
    }

    if (showDepartment && !formData.studentDepartment) {
      newErrors.studentDepartment = "Department is required";
      isValid = false;
    }

    if (!formData.studentSem) {
      newErrors.studentSem = "Semester is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhoneNumber = `${formData.countryCode}${formData.studentNumber}`;
    const parentFullPhoneNumber = `${formData.parentCountryCode}${formData.studentParentsNumber}`;
    const loadingToast = toast.loading(studentData ? "Updating..." : "Registering...");
    console.log(formData);
    try {
      let response;
      const dtoData = {
        studentEmail: formData.studentEmail,
        studentName: formData.studentName,
        studentNumber: fullPhoneNumber,
        studentParentsNumber: parentFullPhoneNumber,
        deptName: formData.studentDepartment,
        courseName: formData.courseName,
        semester: formData.studentSem.toString()
      };

      console.log("DTO Data being sent:", dtoData); // Debugging line

      if (studentData) {
        response = await fetch(`${BASE_URL}/updatestudent/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dtoData),
        });
      } else {
        const collegeId = sessionStorage.getItem("collegeId");

        if (!collegeId) {
          throw new Error("College ID is missing or invalid.");
        }

        response = await fetch(`${BASE_URL}/studentregister/${collegeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dtoData),
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Registration failed");
      }

      const successMessage = studentData ? "Student updated successfully!" : "Student registered successfully!";
      toast.success(successMessage);
      toast.dismiss(loadingToast);
      setTimeout(() => navigate("/collegeDashboard"), 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          <div className="px-8 pt-8 pb-6">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {studentData ? "Update Student" : "Student Registration"}
              </h2>
              <p className="text-base text-gray-600">Enter student information</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleChange(e.target.value, "studentName")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter student name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentName && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => handleChange(e.target.value, "studentEmail")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="student@email.com"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <div className="relative">
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleChange(e.target.value, "courseId")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={loading}
                  >
                    <option value="">Select Course</option>
                    {Object.keys(courseMap).length > 0 ? (
                      Object.entries(courseMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))
                    ) : (
                      <option disabled>Loading courses...</option>
                    )}

                  </select>
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.courseId && (
                  <p className="text-red-600 text-sm mt-1">{errors.courseId}</p>
                )}
              </div>

              {showDepartment && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={formData.studentDepartment}
                      onChange={(e) => handleChange(e.target.value, "studentDepartment")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                      disabled={!selectedCourseId || loading}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.studentDepartment && (
                    <p className="text-red-600 text-sm mt-1">{errors.studentDepartment}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <div className="relative">
                  <select
                    value={formData.studentSem}
                    onChange={(e) => handleChange(e.target.value, "studentSem")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={!selectedCourseId || loading}
                  >
                    <option value="">Select Semester</option>
                    {semesters.length > 0 ? (
                      semesters.map((sem) => (
                        <option key={sem.id} value={sem.semesterNumber}>
                          {sem.semesterNumber}
                        </option>
                      ))
                    ) : (
                      <option value="">No semesters available</option>
                    )}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.studentSem && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentSem}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Student Phone Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-32">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange(e.target.value, "countryCode")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+81">+81 (JP)</option>
                    </select>
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={formData.studentNumber}
                      onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentNumber")}
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                {errors.studentNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parent Phone Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-32">
                    <select
                      value={formData.parentCountryCode}
                      onChange={(e) => handleChange(e.target.value, "parentCountryCode")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+81">+81 (JP)</option>
                    </select>
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={formData.studentParentsNumber}
                      onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentParentsNumber")}
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Parent's phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                {errors.studentParentsNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.studentParentsNumber}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg mt-8"
                disabled={loading}
              >
                {studentData ? "Update Student" : "Complete Registration"}
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}