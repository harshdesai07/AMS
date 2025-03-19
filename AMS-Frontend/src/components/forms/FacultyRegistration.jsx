import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function FacultyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const facultyData = location.state?.faculty || null;
  const { facultyId } = useParams();

  const [formData, setFormData] = useState({
    facultyName: "",
    facultyEmail: "",
    facultyNumber: "",
    facultyDepartment: "",
    facultyDesignation: "",
    countryCode: "+1",
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

    const formatDOB = (dob) => {
      if (!dob) return "";
      const date = new Date(dob);
      return date.toISOString().split("T")[0];
    };

    if (facultyData) {
      setFormData({
        facultyName: facultyData.facultyName || "",
        facultyEmail: facultyData.facultyEmail || "",
        facultyNumber: extractPhoneNumber(facultyData.facultyNumber),
        facultyDepartment: facultyData.facultyDepartment || "",
        facultyDesignation: facultyData.facultyDesignation || "",
        countryCode: extractCountryCode(facultyData.facultyNumber),
      });
    }
  }, [facultyData]);

  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
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

    if (!formData.facultyDepartment) {
      newErrors.facultyDepartment = "Department is required";
      isValid = false;
    }

    if (!formData.facultyDesignation) {
      newErrors.facultyDesignation = "Designation is required";
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

          {/* Department Field */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Building2 className="w-5 h-5" />
              <label className="text-sm font-medium">Department</label>
            </div>
            <select
              value={formData.facultyDepartment}
              onChange={(e) =>
                handleChange(e.target.value, "facultyDepartment")
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              <option value="" className="bg-[#1a1a3f]">
                Select Department
              </option>
              <option value="Computer Science" className="bg-[#1a1a3f]">
                Computer Science
              </option>
              <option value="Information Technology" className="bg-[#1a1a3f]">
                Information Technology
              </option>
              <option
                value="Electronics and Communication"
                className="bg-[#1a1a3f]"
              >
                Electronics and Communication
              </option>
              <option value="Mechanical Engineering" className="bg-[#1a1a3f]">
                Mechanical Engineering
              </option>
              <option value="Civil Engineering" className="bg-[#1a1a3f]">
                Civil Engineering
              </option>
              <option value="Electrical Engineering" className="bg-[#1a1a3f]">
                Electrical Engineering
              </option>
            </select>
            {errors.facultyDepartment && (
              <p className="text-red-400 text-sm mt-1">
                {errors.facultyDepartment}
              </p>
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
              onChange={(e) =>
                handleChange(e.target.value, "facultyDesignation")
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50 appearance-none"
            >
              <option value="" className="bg-[#1a1a3f]">
                Select Designation
              </option>
              <option value="Associate Professor" className="bg-[#1a1a3f]">
                Associate Professor
              </option>
              <option value="Assistant Professor" className="bg-[#1a1a3f]">
                Assistant Professor
              </option>
              <option value="HOD" className="bg-[#1a1a3f]">
                HOD
              </option>
            </select>
            {errors.facultyDesignation && (
              <p className="text-red-400 text-sm mt-1">
                {errors.facultyDesignation}
              </p>
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
                value={formData.facultyNumber}
                onChange={(e) =>
                  handleChange(
                    e.target.value.replace(/\D/, ""),
                    "facultyNumber"
                  )
                }
                maxLength={10}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/50"
                placeholder="Phone number"
              />
            </div>
            {errors.facultyNumber && (
              <p className="text-red-400 text-sm mt-1">
                {errors.facultyNumber}
              </p>
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