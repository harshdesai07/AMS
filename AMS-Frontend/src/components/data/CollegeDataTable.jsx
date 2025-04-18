import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../ui/ActionButtons";

const CollegeDataTable = ({ type, collegeId, onNoRecords, token, userRole }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const base_url = "http://localhost:8080";
  const alertShown = useRef(false);

  useEffect(() => {
    if (type && collegeId) {
      fetchData();
    } else {
      setData([]); // Clear data when type or collegeId is not available
    }
  }, [type, collegeId]);

  const fetchData = async () => {
    setIsLoading(true);
    setData([]); // Clear previous data before fetching
    alertShown.current = false;

    try {
      let response;
      const commonHeaders = {
        Authorization: `Bearer ${token}`,
      };
      const commonParams = {
        courseName: localStorage.getItem("hodCourse"),
        departmentName: localStorage.getItem("hodDepartment"),
      };

      switch (type) {
        case "student":
          response = await axios.get(`${base_url}/get${type}/${collegeId}`, {
            headers: commonHeaders,
            params: commonParams,
          });
          break;
        case "faculty":
          response = await axios.get(`${base_url}/get${type}/${collegeId}/${userRole}`, {
            headers: commonHeaders,
            params: commonParams,
          });
          break;
        case "subjects":
          response = await axios.get(`${base_url}/getSubjectsSemesterwise/${collegeId}`, {
            headers: commonHeaders,
            params: commonParams,
          });
          break;
        case "courseDepartment":
          response = await axios.get(`${base_url}/getCoursesAndDepartments/${collegeId}`, {
            headers: commonHeaders,
          });
          break;
        default:
          setData([]);
          setIsLoading(false);
          return;
      }

      const result = await response.data;
      const resultArray = Array.isArray(result) ? result : [result];

      if (type === 'subjects') {
        // Ensure subjects data has the correct structure
        const validSubjectsData = resultArray.filter(semester => 
          semester && semester.semester && Array.isArray(semester.subjects)
        );
        setData(validSubjectsData);
      } else if (type === 'courseDepartment') {
        // Ensure course-department data is correctly structured
        const validCourseDepartmentData = resultArray.filter(course => 
          course && course.courseName && Array.isArray(course.departments)
        );
        setData(validCourseDepartmentData);
      } else {
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
      }

      if (!resultArray || resultArray.length === 0) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (item) => {
    const itemId = item.studentId || item.facultyId;
    
    if(userRole === 'COLLEGE') {
      navigate(`/hodRegistration/${itemId}`, { state: { item } });
    } else {
      navigate(`/${type}Registration/${itemId}`, { state: { [type]: item, userRole: { userRole } } });
    }
  };

  const handleDelete = async (item) => {
    const itemId = item.studentId || item.facultyId;

    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            {userRole === 'COLLEGE' 
              ? 'Are you sure you want to delete this HOD?' 
              : `Are you sure you want to delete this ${type}?`}
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

                  let message = userRole === 'COLLEGE' 
                    ? 'HOD deleted successfully'
                    : result.message || `${type} deleted successfully`;

                  toast.success(message);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderSubjectsTable = () => {
    // Early return if data is not an array or is empty
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
      <>
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800">
          <h2 className="text-lg font-semibold">Subjects List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700 font-semibold border border-gray-300">Semester</th>
                <th className="p-3 text-left text-gray-700 font-semibold border border-gray-300">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {data.map((semester) => (
                semester.subjects && semester.subjects.map((subject, subIndex) => (
                  <tr key={`${semester.semester}-${subject}-${subIndex}`} className="hover:bg-gray-100">
                    {subIndex === 0 && (
                      <td
                        className="p-3 text-gray-700 border border-gray-300"
                        rowSpan={semester.subjects.length}
                      >
                        {semester.semester}
                      </td>
                    )}
                    <td className="p-3 text-gray-700 border border-gray-300">{subject}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderCourseDepartmentTable = () => {
    // Early return if data is not an array or is empty
    if (!Array.isArray(data) || data.length === 0) return null;

    return (
      <>
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800">
          <h2 className="text-lg font-semibold">Course-Department List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-gray-700 font-semibold border border-gray-300">Course</th>
                <th className="p-3 text-left text-gray-700 font-semibold border border-gray-300">Department</th>
              </tr>
            </thead>
            <tbody>
              {data.map((course) => (
                course.departments && course.departments.map((department, deptIndex) => (
                  <tr key={`${course.courseName}-${department}-${deptIndex}`} className="hover:bg-gray-100">
                    {deptIndex === 0 && (
                      <td
                        className="p-3 text-gray-700 border border-gray-300"
                        rowSpan={course.departments.length}
                      >
                        {course.courseName}
                      </td>
                    )}
                    <td className="p-3 text-gray-700 border border-gray-300">{department}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderDataTable = () => {
    const validType = type === "student" || type === "faculty" ? type : null;
    if (!validType || !Array.isArray(data) || data.length === 0) return null;

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
  {userRole === "COLLEGE"
    ? "HOD List"
    : validType === "student"
    ? "Student List"
    : "Faculty List"}
</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {columns[validType]?.map((col, index) => (
                  <th
                    key={`header-${index}`}
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
                  key={item.studentId || item.facultyId || `row-${rowIndex}`}
                  className="hover:bg-gray-100"
                >
                  <td className="p-3 text-gray-700 border border-gray-300">{rowIndex + 1}</td>
                  {keys[validType]?.map((key, index) => (
                    <td key={`${item.studentId || item.facultyId}-${key}`} className="p-3 text-gray-700 border border-gray-300 break-words max-w-xs">
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

  return (
    <div className="w-full">
      {type === 'subjects' 
        ? renderSubjectsTable() 
        : type === 'courseDepartment'
        ? renderCourseDepartmentTable()
        : renderDataTable()
      }
    </div>
  );
};

export default CollegeDataTable;