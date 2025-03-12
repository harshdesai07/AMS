import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/Select";

export default function StudentRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state?.student || null; // Get student data if updating
  const { id: paramId } = useParams();
  const studentId = paramId || studentData?.studentId; // Fallback to studentData.studentId


  const [formData, setFormData] = useState({
    studentName: "",
    studentDob: "",
    studentGender: "",
    studentEmail: "",
    studentNumber: "",
    studentParentsNumber: "",
    studentDepartment: "",
    studentSem: "",
    countryCode: "+1",
    parentCountryCode: "+1",
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form if updating
  useEffect(() => {
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

    if (studentData) {
      setFormData({
        studentName: studentData.studentName || "",
        studentDob: formatDOB(studentData.studentDob), // Convert to correct format
        studentGender: studentData.studentGender || "",
        studentEmail: studentData.studentEmail || "",
        studentNumber: extractPhoneNumber(studentData.studentNumber),
        studentParentsNumber: extractPhoneNumber(studentData.studentParentsNumber),
        studentDepartment: studentData.studentDepartment || "",
        studentSem: studentData.studentSem || "",
        countryCode: extractCountryCode(studentData.studentNumber),
        parentCountryCode: extractCountryCode(studentData.studentParentsNumber),
      });
    }
  }, [studentData]);


  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when user types
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Name is required";
      isValid = false;
    }

    if (!formData.studentDob) {
      newErrors.studentDob = "Date of Birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.studentDob);
      if (dob >= new Date()) {
        newErrors.studentDob = "Date of Birth must be in the past";
        isValid = false;
      }
    }

    if (!formData.studentGender) {
      newErrors.studentGender = "Gender is required";
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
      newErrors.studentParentsNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.studentNumber)) {
      newErrors.studentNumber = "Phone number must be exactly 10 digits";
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

    try {
      let response;

      if (studentData) {
        // Update existing student
        response = await fetch(`http://localhost:8080/updatestudent/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, studentNumber: fullPhoneNumber, studentParentsNumber: parentFullPhoneNumber }),
        });

        if (!response.ok) throw new Error("Update failed");

        alert("Update successful!");
      }
      else {
        // Register new student
        const collegeId = sessionStorage.getItem("collegeId"); // Fetch collegeId
        response = await fetch(`http://localhost:8080/studentregister/${collegeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, studentNumber: fullPhoneNumber, studentParentsNumber: parentFullPhoneNumber }),
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
        <h2 className="text-2xl font-semibold text-center mb-4">{studentData ? "Update Student" : "Student Registration"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input type="text" value={formData.studentName} onChange={(e) => handleChange(e.target.value, "studentName")} />
            {errors.studentName && <p className="text-red-500 text-sm">{errors.studentName}</p>}
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input type="date" value={formData.studentDob} onChange={(e) => handleChange(e.target.value, "studentDob")} />
            {errors.studentDob && <p className="text-red-500 text-sm">{errors.studentDob}</p>}
          </div>

          <div>
            <Label>Gender</Label>
            <Select onValueChange={(value) => handleChange(value, "studentGender")}>
              <SelectTrigger>{formData.studentGender || "Select Gender"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.studentGender && <p className="text-red-500 text-sm">{errors.studentGender}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.studentEmail} onChange={(e) => handleChange(e.target.value, "studentEmail")} />
            {errors.studentEmail && <p className="text-red-500 text-sm">{errors.studentEmail}</p>}
          </div>

          <div>
            <Label>Department</Label>
            <Select onValueChange={(value) => handleChange(value, "studentDepartment")}>
              <SelectTrigger>{formData.studentDepartment || "Select Department"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="CSE">Computer Science (CSE)</SelectItem>
                <SelectItem value="ECE">Electronics (ECE)</SelectItem>
                <SelectItem value="ME">Mechanical (ME)</SelectItem>
                <SelectItem value="EE">Electrical (EE)</SelectItem>
                <SelectItem value="CE">Civil (CE)</SelectItem>
              </SelectContent>
            </Select>
            {errors.studentDepartment && <p className="text-red-500 text-sm">{errors.studentDepartment}</p>}
          </div>

          <div>
            <Label>Semester</Label>
            <Select onValueChange={(value) => handleChange(value, "studentSem")}>
              <SelectTrigger>{formData.studentSem || "Select Semester"}</SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Semester</SelectItem>
                <SelectItem value="2">2nd Semester</SelectItem>
                <SelectItem value="3">3rd Semester</SelectItem>
                <SelectItem value="4">4th Semester</SelectItem>
                <SelectItem value="5">5th Semester</SelectItem>
                <SelectItem value="6">6th Semester</SelectItem>
                <SelectItem value="7">7th Semester</SelectItem>
                <SelectItem value="8">8th Semester</SelectItem>
              </SelectContent>
            </Select>
            {errors.studentSem && <p className="text-red-500 text-sm">{errors.studentSem}</p>}
          </div>

          <div>
            <Label>Student Phone Number</Label>
            <div className="flex space-x-2 items-center">
              <Select onValueChange={(value) => handleChange(value, "countryCode")}>
                <SelectTrigger>{formData.countryCode || "+1"}</SelectTrigger>
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
                value={formData.studentNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentNumber")} // Only allows numbers
                maxLength={10}
              />
            </div>
            {errors.studentNumber && <p className="text-red-500 text-sm">{errors.studentNumber}</p>}
          </div>

          <div>
            <Label>Parent Phone Number</Label>
            <div className="flex space-x-2 items-center">
              <Select onValueChange={(value) => handleChange(value, "parentCountryCode")}>
                <SelectTrigger>{formData.parentCountryCode || "+1"}</SelectTrigger>
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
                value={formData.studentParentsNumber}
                onChange={(e) => handleChange(e.target.value.replace(/\D/, ""), "studentParentsNumber")} // Only allows numbers
                maxLength={10}
              />
            </div>
            {errors.studentParentsNumber && <p className="text-red-500 text-sm">{errors.studentParentsNumber}</p>}
          </div>


          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {studentData ? "Update Student" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
