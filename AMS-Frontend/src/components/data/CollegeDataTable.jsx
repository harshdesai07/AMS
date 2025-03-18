import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../ui/ActionButtons";

const CollegeDataTable = ({ type, collegeId, onNoRecords }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const base_url = "http://localhost:8080";
  const alertShown = useRef(false);

  useEffect(() => {
    if (type && collegeId) {
      fetchData();
    }
  }, [type, collegeId]);

  const fetchData = async () => {
    alertShown.current = false;

    try {
      const response = await fetch(`${base_url}/${type}/${collegeId}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result || []);

      if (!result || result.length === 0) {
        if (!alertShown.current) {
          alertShown.current = true;
          onNoRecords(type);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);

      if (!alertShown.current) {
        alertShown.current = true;
        onNoRecords(type);
      }
    }
  };

  const handleUpdate = (item) => {
    const itemId = item.studentId || item.facultyId;
    navigate(`/${type}Registration/${itemId}`, { state: { [type]: item } });
  };

  const handleDelete = async (item) => {
    const itemId = item.studentId || item.facultyId;
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      const response = await fetch(`${base_url}/delete${type}/${itemId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message || `${type} deleted successfully.`);
        setData((prevData) =>
          prevData.filter(
            (dataItem) =>
              dataItem.studentId !== itemId && dataItem.facultyId !== itemId
          )
        );
      } else {
        alert(result.error || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert("Something went wrong.");
    }
  };

  const validType =
    type === "student" ? "student" : type === "faculty" ? "faculty" : null;
  if (!validType || data.length === 0) return null;

  const columns = {
    student: [
      "Id",
      "Name",
      "Department",
      "Semester",
      "Email",
      "Number",
      "Parent Number",
      "Password",
    ],
    faculty: [
      "Id",
      "Name",
      "Department",
      "Email",
      "Number",
      "Password",
    ],
  };

  const keys = {
    student: [
      "studentId",
      "studentName",
      "studentDepartment",
      "studentSem",
      "studentEmail",
      "studentNumber",
      "studentParentsNumber",
      "studentPassword",
    ],
    faculty: [
      "facultyId",
      "facultyName",
      "facultyDepartment",
      "facultyEmail",
      "facultyNumber",
      "facultyPassword",
    ],
  };

  return (
    <div className="mt-4 shadow overflow-hidden rounded-lg border border-gray-600 bg-gray-900">
      <h2 className="text-lg font-semibold mb-2 px-4 py-2 bg-gray-700 text-white">
        {validType === "student" ? "Student List" : "Faculty List"}
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-max w-full border border-gray-600">
          <thead>
            <tr className="bg-gray-700 border border-gray-600">
              {columns[validType]?.map((col, index) => (
                <th
                  key={index}
                  className="p-2 border border-gray-600 text-left text-white"
                >
                  {col}
                </th>
              ))}
              <th className="p-2 border border-gray-600 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr
                key={item.studentId || item.facultyId}
                className="hover:bg-gray-800 bg-gray-900 border border-gray-600"
              >
                {keys[validType]?.map((key, index) => (
                  <td
                    key={index}
                    className="p-2 border border-gray-600 text-white"
                  >
                    {item[key]}
                  </td>
                ))}
                <td className="p-2 border border-gray-600 flex gap-2">
                  <ActionButtons
                    onUpdate={() => handleUpdate(item)}
                    onDelete={() => handleDelete(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeDataTable;