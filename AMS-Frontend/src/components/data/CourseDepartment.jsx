import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, ChevronDown } from 'lucide-react';

function CourseDepartment() {
  const [courseSelections, setCourseSelections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null && !dropdownRefs.current[dropdownOpen]?.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Fetch courses only when dropdown is opened
  const handleDropdownClick = async (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null);
      return;
    }

    setDropdownOpen(index);
    if (courses.length === 0) {
      await fetchCourses();
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/courseList');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/departments?courseId=${courseId}`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourseSelection = () => {
    setCourseSelections([...courseSelections, { course: null, departments: [] }]);
  };

  const handleRemoveCourseSelection = (index) => {
    setCourseSelections(courseSelections.filter((_, i) => i !== index));
  };

  const handleCourseChange = async (index, selectedCourse, customName) => {
    const newSelections = [...courseSelections];
    newSelections[index] = {
      course: selectedCourse,
      departments: [],
      customCourseName: customName
    };
    setCourseSelections(newSelections);
    setDropdownOpen(null);

    if (selectedCourse) {
      await fetchDepartments(selectedCourse.id);
    }
  };

  const handleDepartmentChange = (courseIndex, department) => {
    const newSelections = [...courseSelections];
    const currentDepartments = newSelections[courseIndex].departments;
    
    if (currentDepartments.find(d => d.id === department.id)) {
      newSelections[courseIndex].departments = currentDepartments.filter(d => d.id !== department.id);
    } else {
      newSelections[courseIndex].departments = [...currentDepartments, department];
    }
    
    setCourseSelections(newSelections);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/save-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseSelections),
      });
      
      if (response.ok) {
        alert('Courses and departments saved successfully!');
        setCourseSelections([]);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d2b] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1b1b3f] rounded-lg shadow-xl p-6 border border-[#2d2d5f]">
          <h1 className="text-2xl font-bold text-white mb-6">Course and Department Management</h1>
          
          {courseSelections.map((selection, index) => (
            <div key={index} className="mb-6 p-4 border border-[#2d2d5f] rounded-lg bg-[#141432]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Course Selection {index + 1}</h2>
                <button
                  onClick={() => handleRemoveCourseSelection(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Select Course
                    </label>
                    <div 
                      className="relative" 
                      ref={el => dropdownRefs.current[index] = el}
                    >
                      <button
                        onClick={() => handleDropdownClick(index)}
                        className="flex justify-between items-center w-full px-3 py-2 rounded-md border border-[#2d2d5f] bg-[#0d0d2b] text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <span>{selection.course?.name || 'Choose a course'}</span>
                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${dropdownOpen === index ? 'transform rotate-180' : ''}`} />
                      </button>
                      
                      {dropdownOpen === index && (
                        <div className="absolute z-10 w-full mt-1 bg-[#0d0d2b] border border-[#2d2d5f] rounded-md shadow-lg">
                          {loading ? (
                            <div className="p-2 text-gray-400 text-center">Loading courses...</div>
                          ) : (
                            <div className="max-h-60 overflow-auto">
                              {courses.map(course => (
                                <button
                                  key={course.id}
                                  className="w-full text-left px-3 py-2 text-white hover:bg-[#1b1b3f] transition-colors"
                                  onClick={() => handleCourseChange(index, course)}
                                >
                                  {course.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Or Add New Course
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-[#2d2d5f] bg-[#0d0d2b] text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter course name"
                      onChange={(e) => handleCourseChange(index, null, e.target.value)}
                      value={selection.customCourseName || ''}
                    />
                  </div>
                </div>

                {(selection.course || selection.customCourseName) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Select Departments
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {departments.map(department => (
                        <label
                          key={department.id}
                          className="flex items-center space-x-2 p-2 rounded border border-[#2d2d5f] hover:bg-[#1b1b3f] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selection.departments.some(d => d.id === department.id)}
                            onChange={() => handleDepartmentChange(index, department)}
                            className="rounded text-blue-500 bg-[#0d0d2b] border-[#2d2d5f] focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-200">{department.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleAddCourseSelection}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Course
            </button>

            <button
              onClick={handleSubmit}
              disabled={courseSelections.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDepartment;