import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, ChevronDown } from 'lucide-react';

function CourseDepartment() {
  const [courseSelections, setCourseSelections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDepartmentInput, setNewDepartmentInput] = useState('');
  const dropdownRefs = useRef([]);
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null && !dropdownRefs.current[dropdownOpen]?.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDropdownClick = async (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null);
      return;
    }

    setDropdownOpen(index);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/getCourses`);
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
      const response = await fetch(`${BASE_URL}/departments/${courseId}`);
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourseSelection = () => {
    setCourseSelections([...courseSelections, { 
      course: null, 
      departments: [], 
      manualDepartments: [],
      isManualDepartmentInput: true,
      isManualCourseInput: true
    }]);
  };

  const handleRemoveCourseSelection = (index) => {
    setCourseSelections(courseSelections.filter((_, i) => i !== index));
  };

  const handleCourseChange = async (index, selectedCourse, customName) => {
    const newSelections = [...courseSelections];
    newSelections[index] = {
      ...newSelections[index],
      course: selectedCourse,
      departments: [],
      customCourseName: customName,
      isManualDepartmentInput: customName ? true : newSelections[index].isManualDepartmentInput
    };
    setCourseSelections(newSelections);
    setDropdownOpen(null);
    setSearchTerm('');

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

  const handleManualDepartmentAdd = (courseIndex) => {
    if (!newDepartmentInput.trim()) return;
    
    const newSelections = [...courseSelections];
    const manualDepartments = newSelections[courseIndex].manualDepartments || [];
    
    if (!manualDepartments.includes(newDepartmentInput.trim())) {
      newSelections[courseIndex].manualDepartments = [...manualDepartments, newDepartmentInput.trim()];
      setCourseSelections(newSelections);
      setNewDepartmentInput('');
    }
  };

  const handleRemoveManualDepartment = (courseIndex, departmentName) => {
    const newSelections = [...courseSelections];
    newSelections[courseIndex].manualDepartments = newSelections[courseIndex].manualDepartments.filter(
      d => d !== departmentName
    );
    setCourseSelections(newSelections);
  };

  const toggleDepartmentInput = (index) => {
    const newSelections = [...courseSelections];
    newSelections[index].isManualDepartmentInput = !newSelections[index].isManualDepartmentInput;
    setCourseSelections(newSelections);
  };

  const toggleCourseInput = (index) => {
    const newSelections = [...courseSelections];
    newSelections[index].isManualCourseInput = !newSelections[index].isManualCourseInput;
    newSelections[index].customCourseName = '';
    newSelections[index].course = null;
    setCourseSelections(newSelections);
  };

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    const formattedData = courseSelections.map(selection => ({
      courseName: selection.customCourseName || selection.course?.name,
      courseId: selection.course?.id,
      departments: selection.isManualDepartmentInput ? 
        selection.manualDepartments.map(dept => ({ name: dept })) :
        selection.departments,
      isCustomCourse: !!selection.customCourseName
    }));

    try {
      const response = await fetch('/api/save-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Course and Department Management</h1>
          
          {courseSelections.map((selection, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Course Selection {index + 1}</h2>
                <button
                  onClick={() => handleRemoveCourseSelection(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Course
                      </label>
                      <button
                        onClick={() => toggleCourseInput(index)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {selection.isManualCourseInput ? 'Choose from list' : 'Add manually'}
                      </button>
                    </div>
                    
                    {selection.isManualCourseInput ? (
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 bg-white text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="Enter course name"
                        onChange={(e) => handleCourseChange(index, null, e.target.value)}
                        value={selection.customCourseName || ''}
                      />
                    ) : (
                      <div 
                        className="relative" 
                        ref={el => dropdownRefs.current[index] = el}
                      >
                        <button
                          onClick={() => handleDropdownClick(index)}
                          className="flex justify-between items-center w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <span>{selection.course?.name || 'Choose a course'}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${dropdownOpen === index ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        {dropdownOpen === index && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            <div className="p-2">
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            {loading ? (
                              <div className="p-2 text-gray-500 text-center">Loading courses...</div>
                            ) : (
                              <div className="max-h-60 overflow-auto">
                                {filteredCourses.map(course => (
                                  <button
                                    key={course.id}
                                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
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
                    )}
                  </div>
                </div>

                {(selection.course || selection.customCourseName) && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Departments
                      </label>
                      {!selection.customCourseName && (
                        <button
                          onClick={() => toggleDepartmentInput(index)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {selection.isManualDepartmentInput ? 'Choose from list' : 'Add manually'}
                        </button>
                      )}
                    </div>

                    {(selection.isManualDepartmentInput || selection.customCourseName) ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 rounded-md border-gray-300"
                            placeholder="Enter department name"
                            value={newDepartmentInput}
                            onChange={(e) => setNewDepartmentInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleManualDepartmentAdd(index);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleManualDepartmentAdd(index)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selection.manualDepartments?.map((dept, deptIndex) => (
                            <div
                              key={deptIndex}
                              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              <span>{dept}</span>
                              <button
                                onClick={() => handleRemoveManualDepartment(index, dept)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map(department => (
                          <label
                            key={department.id}
                            className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selection.departments.some(d => d.id === department.id)}
                              onChange={() => handleDepartmentChange(index, department)}
                              className="rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{department.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleAddCourseSelection}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Another Course
            </button>

            <button
              onClick={handleSubmit}
              disabled={courseSelections.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
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