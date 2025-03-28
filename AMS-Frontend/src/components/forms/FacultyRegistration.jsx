import { BookOpen, Building2, GraduationCap, Mail, Phone, User, ArrowRight, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function FacultyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const facultyData = location.state?.faculty || null;
  const { facultyId } = useParams();

  const [formData, setFormData] = useState({
    facultyName: "",
    facultyEmail: "",
    facultyNumber: "",
    course: "",
    courseId: "",
    facultyDepartment: "",
    facultyDesignation: "",
    countryCode: "+1",
    semester: "",
    subject: ""
  });

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingSemesters, setIsLoadingSemesters] = useState(false);

  const designationOptions = [
    { value: "", label: "Select Designation" },
    { value: "Associate Professor", label: "Associate Professor" },
    { value: "Assistant Professor", label: "Assistant Professor" },
    { value: "HOD", label: "HOD" }
  ];

  const countryOptions = [
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+61", label: "+61 (AU)" },
    { code: "+81", label: "+81 (JP)" }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await fetch('http://localhost:8080/courses', {
          method: 'GET'
        });

        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        console.log("Fetched Courses:", data); 
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses');
        setCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchCourseId = async (selectedCourse) => {
    try {
      const response = await fetch(`http://localhost:8080/courseId/${selectedCourse}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to fetch course ID');
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching course ID:', error);
      toast.error('Failed to fetch course ID');
      return null;
    }
  };

  useEffect(() => {
    const extractCountryCode = (phoneNumber) => {
      const match = phoneNumber?.match(/^(\+\d{1,2})/);
      return match ? match[0] : "+1";
    };

    const extractPhoneNumber = (phoneNumber) => {
      return phoneNumber?.replace(/^(\+\d{1,2})/, "") || "";
    };

    if (facultyData) {
      setFormData({
        ...formData,
        facultyName: facultyData.facultyName || "",
        facultyEmail: facultyData.facultyEmail || "",
        facultyNumber: extractPhoneNumber(facultyData.facultyNumber),
        course: facultyData.course || "",
        courseId: facultyData.courseId || "",
        facultyDepartment: facultyData.facultyDepartment || "",
        facultyDesignation: facultyData.facultyDesignation || "",
        countryCode: extractCountryCode(facultyData.facultyNumber),
        semester: facultyData.semester || "",
        subject: facultyData.subject || "",
      });
    }
  }, [facultyData]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.courseId) {
        setDepartments([]);
        return;
      }

      setIsLoadingDepartments(true);
      try {
        const response = await fetch(
          `http://localhost:8080/departments/${formData.courseId}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments");
        setDepartments([]);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [formData.courseId]);

  useEffect(() => {
    const fetchSemesters = async () => {
      if (!formData.facultyDepartment) {
        setSemesters([]);
        return;
      }

      setIsLoadingSemesters(true);
      try {
        const response = await fetch(
          `http://localhost:8080/semesters/${formData.courseId}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch semesters");
        const data = await response.json();
        setSemesters(data);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        toast.error("Failed to fetch semesters");
        setSemesters([]);
      } finally {
        setIsLoadingSemesters(false);
      }
    };

    fetchSemesters();
  }, [formData.facultyDepartment, formData.courseId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.facultyDepartment || !formData.semester) {
        setSubjects([]);
        return;
      }

      const collegeId = sessionStorage.getItem("collegeId");
      if (!collegeId) {
        toast.error("College ID not found!");
        return;
      }

      setIsLoadingSubjects(true);
      try {
        const response = await fetch(
          `http://localhost:8080/Subjects/${collegeId}/${formData.courseId}/${formData.facultyDepartment}/${formData.semester}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to fetch subjects");
        setSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [formData.facultyDepartment, formData.semester, formData.courseId]);

  const handleChange = async (value, name) => {
    if (name === "course") {
      setIsLoadingDepartments(true);
      const courseId = await fetchCourseId(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseId: courseId || "",
        facultyDepartment: "",
        semester: "",
        subject: ""
      }));
      setIsLoadingDepartments(false);
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        if (name === "facultyDepartment") {
          newData.semester = "";
          newData.subject = "";
        } else if (name === "semester") {
          newData.subject = "";
        }
        
        return newData;
      });
    }
    
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.facultyName.trim()) {
      newErrors.facultyName = "Name is required";
      isValid = false;
    }

    if (!formData.facultyNumber.trim()) {
      newErrors.facultyNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.facultyNumber)) {
      newErrors.facultyNumber = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    if (!formData.course) {
      newErrors.course = "Course is required";
      isValid = false;
    }

    if (!formData.facultyDepartment) {
      newErrors.facultyDepartment = "Department is required";
      isValid = false;
    }

    if (!formData.facultyDesignation) {
      newErrors.facultyDesignation = "Designation is required";
      isValid = false;
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
      isValid = false;
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fullPhoneNumber = `${formData.countryCode}${formData.facultyNumber}`;
    const loadingToast = toast.loading(
      facultyData ? "Updating..." : "Registering..."
    );

    try {
      let response;

      if (facultyData) {
        response = await fetch(
          `http://localhost:8080/updatefaculty/${facultyId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              facultyNumber: fullPhoneNumber,
            }),
          }
        );

        if (!response.ok) throw new Error("Update failed");
        toast.success("Faculty updated successfully!");
      } else {
        const collegeId = sessionStorage.getItem("collegeId");
        response = await fetch(
          `http://localhost:8080/facultyregister/${collegeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              facultyNumber: fullPhoneNumber,
            }),
          }
        );

        if (!response.ok) throw new Error("Registration failed");
        toast.success("Faculty registered successfully!");
      }

      toast.dismiss(loadingToast);
      setTimeout(() => navigate("/collegeDashboard"), 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {facultyData ? "Update Faculty" : "Faculty Registration"}
              </h2>
              <p className="text-base text-gray-600">Enter faculty information</p>
            </div>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.facultyName}
                    onChange={(e) => handleChange(e.target.value, "facultyName")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter faculty name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.facultyName && (
                  <p className="text-red-600 text-sm mt-1">{errors.facultyName}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.facultyEmail}
                    onChange={(e) => handleChange(e.target.value, "facultyEmail")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="faculty@email.com"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.facultyEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.facultyEmail}</p>
                )}
              </div>

              {/* Course Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <div className="relative">
                  <select
                    value={formData.course}
                    onChange={(e) => handleChange(e.target.value, "course")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={isLoadingCourses}
                  >
                    <option value="">
                      {isLoadingCourses ? "Loading courses..." : "Select Course"}
                    </option>
                    {courses.map((course) => (
                      <option key={`course-${course.courseId}`} value={course.courseName}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.course && (
                  <p className="text-red-600 text-sm mt-1">{errors.course}</p>
                )}
              </div>

              {/* Department Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.facultyDepartment}
                    onChange={(e) => handleChange(e.target.value, "facultyDepartment")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={isLoadingDepartments || !formData.courseId}
                  >
                    <option value="">
                      {isLoadingDepartments 
                        ? "Loading departments..." 
                        : !formData.courseId 
                          ? "Select course first"
                          : "Select Department"}
                    </option>
                    {departments.map((dept) => (
                      <option key={`department-${dept.departmentId}`} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.facultyDepartment && (
                  <p className="text-red-600 text-sm mt-1">{errors.facultyDepartment}</p>
                )}
              </div>

              {/* Semester Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <div className="relative">
                  <select
                    value={formData.semester}
                    onChange={(e) => handleChange(e.target.value, "semester")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={isLoadingSemesters || !formData.facultyDepartment}
                  >
                    <option value="">
                      {isLoadingSemesters 
                        ? "Loading semesters..." 
                        : !formData.facultyDepartment 
                          ? "Select department first"
                          : "Select Semester"}
                    </option>
                    {semesters.map((sem) => (
                      <option key={`semester-${sem.semesterId}`} value={sem.id}>
                        Semester {sem.semesterName}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.semester && (
                  <p className="text-red-600 text-sm mt-1">{errors.semester}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="relative">
                  <select
                    value={formData.subject}
                    onChange={(e) => handleChange(e.target.value, "subject")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    disabled={isLoadingSubjects || !formData.semester}
                  >
                    <option value="">
                      {isLoadingSubjects 
                        ? "Loading subjects..." 
                        : !formData.semester
                          ? "Select semester first"
                          : "Select Subject"}
                    </option>
                    {subjects.map((subject) => (
                      <option key={`subject-${subject.id}`} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              {/* Designation Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <div className="relative">
                  <select
                    value={formData.facultyDesignation}
                    onChange={(e) => handleChange(e.target.value, "facultyDesignation")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                  >
                    {designationOptions.map((option) => (
                      <option key={`designation-${option.value || 'default'}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                {errors.facultyDesignation && (
                  <p className="text-red-600 text-sm mt-1">{errors.facultyDesignation}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex space-x-2">
                  <div className="relative w-32">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange(e.target.value, "countryCode")}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white"
                    >
                      {countryOptions.map((option) => (
                        <option key={`country-${option.code}`} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={formData.facultyNumber}
                      onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "facultyNumber")}
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                      placeholder="Phone number"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                {errors.facultyNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.facultyNumber}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group text-lg mt-8"
              >
                {facultyData ? "Update Faculty" : "Complete Registration"}
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}