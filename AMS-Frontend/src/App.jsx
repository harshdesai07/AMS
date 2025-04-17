import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CollegeDashboard from "./components/Dashboards/CollegeDashboard";
import FacultyDashboard from "./components/Dashboards/FacultyDashboard";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import HomePage from "./components/Home/HomePage";
import CourseDepartment from "./components/data/CourseDepartment";
import CollegeLogin from "./components/forms/CollegeLogin";
import CollegeRegistration from "./components/forms/CollegeRegistration";
import FacultyLogin from "./components/forms/FacultyLogin";
import HodRegistration from "./components/forms/HodRegistration";
import StudentLogin from "./components/forms/StudentLogin";
import StudentRegistration from "./components/forms/StudentRegistration";
import HodDashboard from "./components/Dashboards/HodDashboard";
import SemesterSubject from "./components/data/SemesterSubject";
import FacultyRegistration from "./components/forms/FacultyRegistration";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<CollegeRegistration />} />
        <Route path="/collegeLogin" element={<CollegeLogin />} />
        <Route path="/facultyLogin" element={<FacultyLogin />} />
        <Route path="/studentLogin" element={<StudentLogin />} />
        <Route path="/collegeDashboard" element={<CollegeDashboard />} />
        <Route path="/hodRegistration" element={<HodRegistration />} />
        <Route path="/facultyRegistration" element={<FacultyRegistration />} />
        <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/studentRegistration" element={<StudentRegistration />} />
        <Route path="/studentRegistration/:studentId" element={<StudentRegistration />} />
        <Route path="/hodRegistration/:facultyId" element={<HodRegistration />} />
        <Route path="/facultyRegistration/:facultyId" element={<FacultyRegistration />} />
        <Route path="/CourseDepartment" element={<CourseDepartment />} />
        <Route path="/hodDashboard" element={<HodDashboard />} />
        <Route path="/semesterSubject" element={<SemesterSubject />} />
      </Routes>
    </Router>
  );
}
