import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/Select";

export default function FacultyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const facultyData = location.state?.faculty || null; // Get faculty data if updating
  const { facultyId } = useParams(); // Extract facultyId from URL

  const [formData, setFormData] = useState({
    facultyName: "",
    facultyDob: "",
    facultyGender: "",
    facultyEmail: "",
    facultyNumber: "",
    facultyDepartment: "",
    facultyDesignation: "",
    countryCode: "+1",
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form if updating
  useEffect(() => {
    console.log("data recived", facultyData)
    const extractCountryCode = (phoneNumber) => {
      const match = phoneNumber?.match(/^(\+\d{1,2})/); // Extracts +91, +1, etc.
      return match ? match[0] : "+1"; // Default to +1 if no match
    };

    const extractPhoneNumber = (phoneNumber) => {
      return phoneNumber?.replace(/^(\+\d{1,2})/, "") || ""; // Remove country code
    };

    // Convert DOB to "YYYY-MM-DD" format (required for input type="date")
    const formatDOB = (dob) => {
      if (!dob) return "";
      const date = new Date(dob);
      return date.toISOString().split("T")[0]; // Extracts "YYYY-MM-DD"
    };

    if (facultyData) {
      setFormData({
        facultyName: facultyData.facultyName || "",
        facultyDob: formatDOB(facultyData.facultyDob), // Convert to correct format
        facultyGender: facultyData.facultyGender || "",
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
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.facultyName.trim()) {
      newErrors.facultyName = "Name is required";
      isValid = false;
    }

    if (!formData.facultyDob) {
      newErrors.facultyDob = "Date of Birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.facultyDob);
      if (dob >= new Date()) {
        newErrors.facultyDob = "Date of Birth must be in the past";
        isValid = false;
      }
    }

    if (!formData.facultyGender) {
      newErrors.facultyGender = "Gender is required";
      isValid = false;
    }

    if (!formData.facultyEmail.trim()) {
      newErrors.facultyEmail = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.facultyEmail)) {
      newErrors.facultyEmail = "Invalid email format";
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


    try {
      let response;

      if (facultyData) {
        // Update existing faculty
        response = await fetch(`http://localhost:8080/updatefaculty/${facultyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, facultyNumber: fullPhoneNumber }),
        });

        if (!response.ok) throw new Error("Update failed");

        alert("Update successful!");
      }
      else {
        // Register new faculty
        const collegeId = sessionStorage.getItem("collegeId");
        response = await fetch(`http://localhost:8080/facultyregister/${collegeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, facultyNumber: fullPhoneNumber }),
        });

        if (!response.ok) throw new Error("Registration failed");

        alert("Registration successful!");
      }


      navigate("/collegeDashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">{facultyData ? "Update Faculty" : "Faculty Registration"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input type="text" value={formData.facultyName} onChange={(e) => handleChange(e.target.value, "facultyName")} />
            {errors.facultyName && <p className="text-red-500 text-sm">{errors.facultyName}</p>}
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input type="date" value={formData.facultyDob} onChange={(e) => handleChange(e.target.value, "facultyDob")} />
            {errors.facultyDob && <p className="text-red-500 text-sm">{errors.facultyDob}</p>}
          </div>

          <div>
            <Label>Gender</Label>
            <Select onValueChange={(value) => handleChange(value, "facultyGender")}>
              <SelectTrigger>{formData.facultyGender || "Select Gender"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.facultyGender && <p className="text-red-500 text-sm">{errors.facultyGender}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.facultyEmail} onChange={(e) => handleChange(e.target.value, "facultyEmail")} />
            {errors.facultyEmail && <p className="text-red-500 text-sm">{errors.facultyEmail}</p>}
          </div>

          <div>
            <Label>Department</Label>
            <Select onValueChange={(value) => handleChange(value, "facultyDepartment")}>
              <SelectTrigger>{formData.facultyDepartment || "Select Department"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Electronics and Communication">Electronics and Communication</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              </SelectContent>
            </Select>
            {errors.facultyDepartment && <p className="text-red-500 text-sm">{errors.facultyDepartment}</p>}
          </div>

          <div>
            <Label>Designation</Label>
            <Select onValueChange={(value) => handleChange(value, "facultyDesignation")}>
              <SelectTrigger>{formData.facultyDesignation || "Select Designation"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                <SelectItem value="HOD">HOD</SelectItem>
              </SelectContent>
            </Select>
            {errors.facultyDesignation && <p className="text-red-500 text-sm">{errors.facultyDesignation}</p>}
          </div>

          <div>
            <Label>Phone Number</Label>
            <div className="flex space-x-2 items-center">
              <Select onValueChange={(value) => handleChange(value, "countryCode")}>
                <SelectTrigger>{formData.countryCode}</SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">+1 (USA)</SelectItem>
                  <SelectItem value="+91">+91 (India)</SelectItem>
                  <SelectItem value="+44">+44 (UK)</SelectItem>
                  <SelectItem value="+61">+61 (Australia)</SelectItem>
                  <SelectItem value="+81">+81 (Japan)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="tel"
                value={formData.facultyNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "facultyNumber")}
                maxLength={10}
              />
            </div>
            {errors.facultyNumber && <p className="text-red-500 text-sm">{errors.facultyNumber}</p>}
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {facultyData ? "Update Faculty" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
