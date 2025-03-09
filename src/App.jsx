import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CollegeDashboard from "./components/Dashboards/CollegeDashboard";
import FacultyDashboard from "./components/Dashboards/FacultyDashboard";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import HomePage from "./components/Home/HomePage";
import CollegeLogin from "./components/forms/CollegeLogin";
import CollegeRegistration from "./components/forms/CollegeRegistration";
import FacultyLogin from "./components/forms/FacultyLogin";
import FacultyRegistration from "./components/forms/FacultyRegistration";
import StudentLogin from "./components/forms/StudentLogin";
import StudentRegistration from "./components/forms/StudentRegistration";

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
        <Route path="/facultyRegistration" element={<FacultyRegistration />} />
        <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/studentRegistration" element={<StudentRegistration />} />
      </Routes>
    </Router>
  );
}
