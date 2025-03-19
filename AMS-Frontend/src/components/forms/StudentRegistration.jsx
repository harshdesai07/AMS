import {
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

  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentNumber: "",
    studentParentsNumber: "",
    studentDepartment: "",
    studentSem: "",
    countryCode: "+1",
    parentCountryCode: "+1",
  });

  const [errors, setErrors] = useState({});

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
        studentParentsNumber: extractPhoneNumber(
          studentData.studentParentsNumber
        ),
        studentDepartment: studentData.studentDepartment || "",
        studentSem: studentData.studentSem || "",
        countryCode: extractCountryCode(studentData.studentNumber),
        parentCountryCode: extractCountryCode(studentData.studentParentsNumber),
      });
    }
  }, [studentData]);

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

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

    if (!formData.studentDepartment) {
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
    const loadingToast = toast.loading(
      studentData ? "Updating..." : "Registering..."
    );

    try {
      let response;

      if (studentData) {
        response = await fetch(
          `http://localhost:8080/updatestudent/${studentId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              studentNumber: fullPhoneNumber,
              studentParentsNumber: parentFullPhoneNumber,
            }),
          }
        );

        if (!response.ok) throw new Error("Update failed");
        toast.success("Student updated successfully!");
      } else {
        const collegeId = sessionStorage.getItem("collegeId");
        response = await fetch(
          `http://localhost:8080/studentregister/${collegeId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              studentNumber: fullPhoneNumber,
              studentParentsNumber: parentFullPhoneNumber,
            }),
          }
        );

        if (!response.ok) throw new Error("Registration failed");
        toast.success("Student registered successfully!");
      }

      toast.dismiss(loadingToast);
      setTimeout(() => navigate("/collegeDashboard"), 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d2b] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="w-10 h-10 text-blue-400" />
          <h2 className="text-3xl font-bold text-white ml-3">
            {studentData ? "Update Student" : "Student Registration"}
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
              value={formData.studentName}
              onChange={(e) => handleChange(e.target.value, "studentName")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="Enter student name"
            />
            {errors.studentName && (
              <p className="text-red-400 text-sm mt-1">{errors.studentName}</p>
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
              value={formData.studentEmail}
              onChange={(e) => handleChange(e.target.value, "studentEmail")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
              placeholder="student@email.com"
            />
            {errors.studentEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.studentEmail}</p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Building2 className="w-5 h-5" />
              <label className="text-sm font-medium">Department</label>
            </div>
            <select
              value={formData.studentDepartment}
              onChange={(e) =>
                handleChange(e.target.value, "studentDepartment")
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              <option value="" className="bg-[#1a1a3f]">
                Select Department
              </option>
              <option value="CSE" className="bg-[#1a1a3f]">
                Computer Science (CSE)
              </option>
              <option value="ECE" className="bg-[#1a1a3f]">
                Electronics (ECE)
              </option>
              <option value="ME" className="bg-[#1a1a3f]">
                Mechanical (ME)
              </option>
              <option value="EE" className="bg-[#1a1a3f]">
                Electrical (EE)
              </option>
              <option value="CE" className="bg-[#1a1a3f]">
                Civil (CE)
              </option>
            </select>
            {errors.studentDepartment && (
              <p className="text-red-400 text-sm mt-1">
                {errors.studentDepartment}
              </p>
            )}
          </div>

          {/* Semester Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <GraduationCap className="w-5 h-5" />
              <label className="text-sm font-medium">Semester</label>
            </div>
            <select
              value={formData.studentSem}
              onChange={(e) => handleChange(e.target.value, "studentSem")}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              <option value="" className="bg-[#1a1a3f]">
                Select Semester
              </option>
              <option value="1" className="bg-[#1a1a3f]">
                1st Semester
              </option>
              <option value="2" className="bg-[#1a1a3f]">
                2nd Semester
              </option>
              <option value="3" className="bg-[#1a1a3f]">
                3rd Semester
              </option>
              <option value="4" className="bg-[#1a1a3f]">
                4th Semester
              </option>
              <option value="5" className="bg-[#1a1a3f]">
                5th Semester
              </option>
              <option value="6" className="bg-[#1a1a3f]">
                6th Semester
              </option>
              <option value="7" className="bg-[#1a1a3f]">
                7th Semester
              </option>
              <option value="8" className="bg-[#1a1a3f]">
                8th Semester
              </option>
            </select>
            {errors.studentSem && (
              <p className="text-red-400 text-sm mt-1">{errors.studentSem}</p>
            )}
          </div>

          {/* Student Phone Number Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Phone className="w-5 h-5" />
              <label className="text-sm font-medium">
                Student Phone Number
              </label>
            </div>
            <div className="flex space-x-2">
              <select
                value={formData.countryCode}
                onChange={(e) => handleChange(e.target.value, "countryCode")}
                className="w-24 px-2 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              >
                <option value="+1" className="bg-[#1a1a3f]">
                  +1 (USA)
                </option>
                <option value="+91" className="bg-[#1a1a3f]">
                  +91 (India)
                </option>
                <option value="+44" className="bg-[#1a1a3f]">
                  +44 (UK)
                </option>
                <option value="+61" className="bg-[#1a1a3f]">
                  +61 (AU)
                </option>
                <option value="+81" className="bg-[#1a1a3f]">
                  +81 (JP)
                </option>
              </select>
              <input
                type="tel"
                value={formData.studentNumber}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/\D/, ""),
                    "studentNumber"
                  )
                }
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="Phone number"
              />
            </div>
            {errors.studentNumber && (
              <p className="text-red-400 text-sm mt-1">
                {errors.studentNumber}
              </p>
            )}
          </div>

          {/* Parent Phone Number Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Phone className="w-5 h-5" />
              <label className="text-sm font-medium">Parent Phone Number</label>
            </div>
            <div className="flex space-x-2">
              <select
                value={formData.parentCountryCode}
                onChange={(e) =>
                  handleChange(e.target.value, "parentCountryCode")
                }
                className="w-24 px-2 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
              >
                <option value="+1" className="bg-[#1a1a3f]">
                  +1 (USA)
                </option>
                <option value="+91" className="bg-[#1a1a3f]">
                  +91 (India)
                </option>
                <option value="+44" className="bg-[#1a1a3f]">
                  +44 (UK)
                </option>
                <option value="+61" className="bg-[#1a1a3f]">
                  +61 (AU)
                </option>
                <option value="+81" className="bg-[#1a1a3f]">
                  +81 (JP)
                </option>
              </select>
              <input
                type="tel"
                value={formData.studentParentsNumber}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/\D/, ""),
                    "studentParentsNumber"
                  )
                }
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="Parent's phone number"
              />
            </div>
            {errors.studentParentsNumber && (
              <p className="text-red-400 text-sm mt-1">
                {errors.studentParentsNumber}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            {studentData ? "Update Student" : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}