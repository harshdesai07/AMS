import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
    
    // Create a promise that resolves when user confirms or cancels
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Are you sure you want to delete this {type}?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`${base_url}/delete${type}/${itemId}`, {
                  method: "DELETE",
                });
                const result = await response.json();

                if (!response.ok) {
                  throw new Error("Deletion failed");
                }

                toast.success(result.message || `${type} deleted successfully`);
                setData((prevData) =>
                  prevData.filter(
                    (dataItem) =>
                      dataItem.studentId !== itemId && dataItem.facultyId !== itemId
                  )
                );
              } catch (error) {
                console.error(`Error deleting ${type}:`, error);
                toast.error("Something went wrong");
              }
            }}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
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
    <div className="mt-4 shadow-lg rounded-lg border border-gray-200 bg-white">
      <h2 className="text-lg font-semibold mb-2 px-4 py-3 bg-gray-100 text-gray-800 border-b border-gray-200">
        {validType === "student" ? "Student List" : "Faculty List"}
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-max w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              {columns[validType]?.map((col, index) => (
                <th
                  key={index}
                  className={"p-3 text-left text-gray-700 font-semibold"}
                >
                  {col}
                </th>
              ))}
              <th className="p-3 text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, rowIndex) => (
              <tr
                key={item.studentId || item.facultyId}
                className={`hover:bg-gray-50 border-b border-gray-100 transition-colors ${rowIndex % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                {keys[validType]?.map((key, index) => (
                  <td
                    key={index}
                    className={"p-3 text-gray-700"}
                  >
                    {item[key]}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-2">
                    <ActionButtons
                      onUpdate={() => handleUpdate(item)}
                      onDelete={() => handleDelete(item)}
                    />
                  </div>
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