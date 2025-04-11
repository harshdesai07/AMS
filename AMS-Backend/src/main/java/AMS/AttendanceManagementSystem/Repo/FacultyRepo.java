package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Faculty;

public interface FacultyRepo extends JpaRepository<Faculty,Long>{
	@Query("SELECT f FROM Faculty f WHERE f.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId")
	List<Faculty> findByCollegeId( Integer collegeId);
	
	@Query("SELECT f.collegeCourseDepartment FROM Faculty f WHERE f.facultyId = :facultyId")
    Optional<CollegeCourseDepartment> findCollegeCourseDepartmentByFacultyId(Long facultyId);

	Optional<Faculty> findByFacultyEmail(String facultyEmail);

}
