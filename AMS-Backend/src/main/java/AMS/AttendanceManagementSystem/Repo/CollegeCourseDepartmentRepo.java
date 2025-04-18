package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;

@Repository
public interface CollegeCourseDepartmentRepo extends JpaRepository<CollegeCourseDepartment, Long> {
	Optional<CollegeCourseDepartment> findByCollegeCourseAndDepartment(CollegeCourse collegeCourse, Department department);
	
	 @Query("SELECT DISTINCT c.department FROM CollegeCourseDepartment c " +
	           "WHERE c.collegeCourse.college.id = :collegeId " +
	           "AND c.collegeCourse.course.name = :courseName")
	    List<Department> findDepartmentsByCourseNameAndCollegeId(String courseName, Integer collegeId);
	    
	 @Query("SELECT DISTINCT ccd.collegeCourse.course.name, ccd.department.name " +
	           "FROM CollegeCourseDepartment ccd " +
	           "WHERE ccd.collegeCourse.college.collegeId = :collegeId " +
	           "ORDER BY ccd.collegeCourse.course.name, ccd.department.name")
	    List<Object[]> findCoursesAndDepartmentsByCollegeId(Integer collegeId);
}
