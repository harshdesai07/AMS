import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

const CollegeDataTable = ({ type, collegeId }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const base_url = "http://localhost:8080";

  useEffect(() => {
    if (type && collegeId) {
      fetchData();
    }
  }, [type, collegeId]);
  const fetchData = async () => {
    try {
      const response = await fetch(`${base_url}/${type}/${collegeId}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result || []); // Ensure data is always an array
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Set an empty array on error
    }
  };
  
  const handleUpdate = (item) => {
    const itemId = item.studentId || item.facultyId;
    navigate(`/${type}Registration/${itemId}`, { state: { [type]: item } }); // Fix state key
  };

  const handleDelete = async (item) => {
    const itemId = item.studentId || item.facultyId;
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(`${base_url}/delete${type}/${itemId}`, { method: "DELETE" });
      const result = await response.json();

      if (response.ok) {
        alert(result.message || `${type} deleted successfully.`);
        setData((prevData) => prevData.filter((dataItem) => dataItem.studentId !== itemId && dataItem.facultyId !== itemId));
      } else {
        alert(result.error || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert("Something went wrong.");
    }
  };

  // Fix type mapping issue
  const validType = type === "student" ? "student" : type === "faculty" ? "faculty" : null;

  if (!validType || data.length === 0) return null;

  const columns = {
    student: ["Id", "Name", "Department", "Semester", "Email", "Dob", "Gender", "Number", "Parent Number", "Password"],
    faculty: ["Id", "Name", "Department", "Email", "Dob", "Gender", "Number", "Password"],
  };

  const keys = {
    student: ["studentId", "studentName", "studentDepartment", "studentSem", "studentEmail", "studentDob", "studentGender", "studentNumber", "studentParentsNumber", "studentPassword"],
    faculty: ["facultyId", "facultyName", "facultyDepartment", "facultyEmail", "facultyDob", "facultyGender", "facultyNumber", "facultyPassword"],
  };

  return (
    <div className="mt-4 shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">{validType === "student" ? "Student List" : "Faculty List"}</h2>
      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200 border border-gray-300">
            {columns[validType]?.map((col, index) => (
              <th key={index} className="p-2 border border-gray-300">{col}</th>
            ))}
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.studentId || item.facultyId} className="hover:bg-gray-100 border border-gray-300">
              {keys[validType]?.map((key, index) => (
                <td key={index} className="p-2 border border-gray-300">{item[key]}</td>
              ))}
              <td className="p-2 border border-gray-300 flex space-x-2">
                <Button className="text-sm px-4 bg-blue-400 text-white hover:bg-blue-500" onClick={() => handleUpdate(item)}>
                  Update
                </Button>
                <Button className="text-sm px-4 bg-red-500 text-white hover:bg-red-600" onClick={() => handleDelete(item)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeDataTable;
