import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../ui/ActionButtons";

const CollegeDataTable = ({ type, collegeId, onNoRecords }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const base_url = "http://localhost:8080";
  const alertShown = useRef(false);
  const token = localStorage.getItem("collegeToken");

  useEffect(() => {
    if (type && collegeId) {
      fetchData();
    }
  }, [type, collegeId]);

  const fetchData = async () => {
    alertShown.current = false;

    try {
      const response = await axios.get(`${base_url}/get${type}/${collegeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.data;
      const resultArray = Array.isArray(result) ? result : [result];
      
      const transformedData = type === 'faculty' ? resultArray.map(faculty => ({
        facultyId: faculty.facultyId,
        facultyName: faculty.facultyName,
        facultyCourse: faculty.collegeCourseDepartment?.collegeCourse?.course?.name || 'N/A',
        facultyDepartment: faculty.collegeCourseDepartment?.department?.name || 'N/A',
        facultyEmail: faculty.facultyEmail,
        facultyNumber: faculty.facultyNumber,
        facultyPassword: faculty.facultyPassword,
        facultyDesignation: faculty.facultyDesignation
      })) : resultArray;

      setData(transformedData || []);

      if (!transformedData || transformedData.length === 0) {
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

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            Are you sure you want to delete this {type}?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await axios.delete(
                    `${base_url}/delete${type}/${itemId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  const result = await response.data;

                  toast.success(
                    result.message || `${type} deleted successfully`
                  );
                  setData((prevData) =>
                    prevData.filter(
                      (dataItem) =>
                        dataItem.studentId !== itemId &&
                        dataItem.facultyId !== itemId
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
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  const extractTextInBrackets = (text) => {
    const match = text?.match(/\((.*?)\)/);
    return match ? match[1] : text;
  };

  const validType =
    type === "student" ? "student" : type === "faculty" ? "faculty" : null;
  if (!validType || data.length === 0) return null;

  const columns = {
    student: [
      "S.No",
      "Name",
      "Course",
      "Department",
      "Semester",
      "Email",
      "Contact Number",
      "Parent's Number",
      "Actions"
    ],
    faculty: [
      "S.No",
      "Name",
      "Course",
      "Department",
      "Designation",
      "Email",
      "Contact Number",
      "Actions"
    ],
  };

  const keys = {
    student: [
      "studentName",
      "courseName",
      "deptName",
      "semester",
      "studentEmail",
      "studentNumber",
      "studentParentsNumber"
    ],
    faculty: [
      "facultyName",
      "facultyCourse",
      "facultyDepartment",
      "facultyDesignation",
      "facultyEmail",
      "facultyNumber"
    ],
  };

  return (
    <>
    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800">
        <h2 className="text-lg font-semibold">
          {validType === "student" ? "Student List" : "Faculty List"}
        </h2>
      </div>
  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-100">
          <thead>
            <tr>
              {columns[validType]?.map((col, index) => (
                <th
                  key={index}
                  className="p-3 text-left text-gray-700 font-semibold border border-gray-300"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item, rowIndex) => (
              <tr
                key={item.studentId || item.facultyId}
                className={`hover:bg-gray-200 transition-colors ${
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                }`}
              >
                <td className="p-3 text-gray-700 border border-gray-300">{rowIndex + 1}</td>
                {keys[validType]?.map((key, index) => (
                  <td key={index} className="p-3 text-gray-700 border border-gray-300 break-words max-w-xs">
                    {key === "courseName" || key === "facultyCourse"
                      ? extractTextInBrackets(item[key])
                      : item[key]}
                  </td>
                ))}
                <td className="p-3 border border-gray-300">
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
      </>
  );
};  

export default CollegeDataTable;