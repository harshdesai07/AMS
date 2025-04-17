package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;

@Repository
public interface StudentEnrollmentRepo extends JpaRepository<StudentEnrollment, Long> {
	@Query("SELECT se FROM StudentEnrollment se WHERE se.student.studentId = :studentId")
	Optional<StudentEnrollment> findByStudentId(Long studentId);
	
	 @Query("SELECT se FROM StudentEnrollment se WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId")
	    List<StudentEnrollment> findByCollegeId(Integer collegeId);
	 
	  @Query("SELECT se FROM StudentEnrollment se " +
	           "WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
	           "AND se.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
	           "AND se.collegeCourseDepartment.department.name = :departmentName")
	    List<StudentEnrollment> findEnrollmentsByCollegeCourseAndDepartment(
	            Integer collegeId,
	            String courseName,
	            String departmentName
	    );
}