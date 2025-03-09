import { useState } from "react";
import { Menu, Calendar, Users, X } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import LogoutButton from "../ui/LogoutButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select";

const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry"];
const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];
const studentsData = {
  "Computer Science_Semester 1": [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
  ],
  "Computer Science_Semester 2": [
    { id: 3, name: "Charlie Brown" },
    { id: 4, name: "David Lee" },
  ],
};

export default function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const selectedStudents =
    studentsData[`${selectedDept}_${selectedSemester}`] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 ${
          sidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed md:static left-0 top-0 h-full bg-white shadow-lg p-4 w-64 z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Faculty Dashboard</h2>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </Button>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-blue-600">
            <Users /> <span>Students</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-blue-600">
            <Calendar /> <span>Attendance</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md">
          <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <LogoutButton />
        </div>

        {/* Department & Semester Selection */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Select Department & Semester</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Select onValueChange={setSelectedDept} defaultValue={selectedDept}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue>{selectedDept}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSemester} defaultValue={selectedSemester}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue>{selectedSemester}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student List */}
<div className="p-4">
  <h3 className="text-lg font-bold mb-2">Student List</h3>

  {!selectedDept || !selectedSemester ? (
    <p className="text-gray-600">Please select a department and semester to view students.</p>
  ) : selectedStudents.length > 0 ? (
    <div className="space-y-2">
      {selectedStudents.map((student) => (
        <Card key={student.id} className="w-full">
          <CardContent className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <span className="text-center sm:text-left">{student.name}</span>
            <div className="flex space-x-2">
              <Button className="text-sm px-4 bg-green-400 text-green-800 hover:bg-green-500">
                Present
              </Button>
              <Button className="text-sm px-4 bg-red-400 text-red-800 hover:bg-red-500">
                Absent
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <p className="text-gray-600">No students found.</p>
  )}
</div>

      </div>
    </div>
  );
}
