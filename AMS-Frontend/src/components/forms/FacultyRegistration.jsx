import { BookOpen, Building2, GraduationCap, Mail, Phone, User } from "lucide-react";
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
      console.log(data); // Debugging log
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

  const countryOptions = [
    { code: "+1", label: "+1 (USA)" },
    { code: "+91", label: "+91 (India)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+61", label: "+61 (AU)" },
    { code: "+81", label: "+81 (JP)" }
  ];

  const designationOptions = [
    { value: "", label: "Select Designation" },
    { value: "Associate Professor", label: "Associate Professor" },
    { value: "Assistant Professor", label: "Assistant Professor" },
    { value: "HOD", label: "HOD" }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d2b] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="w-10 h-10 text-blue-400" />
          <h2 className="text-3xl font-bold text-white ml-3">
            {facultyData ? "Update Faculty" : "Faculty Registration"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <User className="w-5 h-5" />
              <label className="text-sm font-medium">Name</label>
            </div>
            <input
              type="text"
              value={formData.facultyName}
              onChange={(e) => handleChange(e.target.value, "facultyName")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="Enter faculty name"
            />
            {errors.facultyName && (
              <p className="text-red-400 text-sm mt-1">{errors.facultyName}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Mail className="w-5 h-5" />
              <label className="text-sm font-medium">Email</label>
            </div>
            <input
              type="email"
              value={formData.facultyEmail}
              onChange={(e) => handleChange(e.target.value, "facultyEmail")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="faculty@email.com"
            />
            {errors.facultyEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.facultyEmail}</p>
            )}
          </div>

          {/* Course Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <GraduationCap className="w-5 h-5" />
              <label className="text-sm font-medium">Course</label>
            </div>
            <select
              value={formData.course}
              onChange={(e) => handleChange(e.target.value, "course")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              disabled={isLoadingCourses}
            >
              <option key="course-default" value="" className="bg-[#1a1a3f]">
                {isLoadingCourses ? "Loading courses..." : "Select Course"}
              </option>
              {courses.map((course) => (
                <option key={`course-${course.courseId}`} value={course.courseName} className="bg-[#1a1a3f]">
                  {course.courseName}
                </option>
              ))}
            </select>
            {errors.course && (
              <p className="text-red-400 text-sm mt-1">{errors.course}</p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Building2 className="w-5 h-5" />
              <label className="text-sm font-medium">Department</label>
            </div>
            <select
              value={formData.facultyDepartment}
              onChange={(e) => handleChange(e.target.value, "facultyDepartment")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              disabled={isLoadingDepartments || !formData.courseId}
            >
              <option key="department-default" value="" className="bg-[#1a1a3f]">
                {isLoadingDepartments 
                  ? "Loading departments..." 
                  : !formData.courseId 
                    ? "Select course first"
                    : "Select Department"}
              </option>
              {departments.map((dept) => (
                <option key={`department-${dept.departmentId}`} value={dept.departmentId} className="bg-[#1a1a3f]">
                  {dept.departmentName}
                </option>
              ))}
            </select>
            {errors.facultyDepartment && (
              <p className="text-red-400 text-sm mt-1">{errors.facultyDepartment}</p>
            )}
          </div>

          {/* Semester Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <GraduationCap className="w-5 h-5" />
              <label className="text-sm font-medium">Semester</label>
            </div>
            <select
              value={formData.semester}
              onChange={(e) => handleChange(e.target.value, "semester")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              disabled={isLoadingSemesters || !formData.facultyDepartment}
            >
              <option key="semester-default" value="" className="bg-[#1a1a3f]">
                {isLoadingSemesters 
                  ? "Loading semesters..." 
                  : !formData.facultyDepartment 
                    ? "Select department first"
                    : "Select Semester"}
              </option>
              {semesters.map((sem) => (
                <option key={`semester-${sem.semesterId}`} value={sem.id} className="bg-[#1a1a3f]">
                  Semester {sem.semesterName}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="text-red-400 text-sm mt-1">{errors.semester}</p>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <BookOpen className="w-5 h-5" />
              <label className="text-sm font-medium">Subject</label>
            </div>
            <select
              value={formData.subject}
              onChange={(e) => handleChange(e.target.value, "subject")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              disabled={isLoadingSubjects || !formData.semester}
            >
              <option key="subject-default" value="" className="bg-[#1a1a3f]">
                {isLoadingSubjects 
                  ? "Loading subjects..." 
                  : !formData.semester
                    ? "Select semester first"
                    : "Select Subject"}
              </option>
              {subjects.map((subject) => (
                <option key={`subject-${subject.id}`} value={subject.id} className="bg-[#1a1a3f]">
                  {subject.name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Designation Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <GraduationCap className="w-5 h-5" />
              <label className="text-sm font-medium">Designation</label>
            </div>
            <select
              value={formData.facultyDesignation}
              onChange={(e) => handleChange(e.target.value, "facultyDesignation")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              {designationOptions.map((option) => (
                <option key={`designation-${option.value || 'default'}`} value={option.value} className="bg-[#1a1a3f]">
                  {option.label}
                </option>
              ))}
            </select>
            {errors.facultyDesignation && (
              <p className="text-red-400 text-sm mt-1">{errors.facultyDesignation}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Phone className="w-5 h-5" />
              <label className="text-sm font-medium">Phone Number</label>
            </div>
            <div className="flex space-x-2">
              <select
                value={formData.countryCode}
                onChange={(e) => handleChange(e.target.value, "countryCode")}
                className="w-24 px-2 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              >
                {countryOptions.map((option) => (
                  <option key={`country-${option.code}`} value={option.code} className="bg-[#1a1a3f]">
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.facultyNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "facultyNumber")}
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="Phone number"
              />
            </div>
            {errors.facultyNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.facultyNumber}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            {facultyData ? "Update Faculty" : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
