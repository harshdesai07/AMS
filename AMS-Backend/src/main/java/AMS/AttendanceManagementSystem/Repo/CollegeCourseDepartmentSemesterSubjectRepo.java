package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;

@Repository
public interface CollegeCourseDepartmentSemesterSubjectRepo extends JpaRepository<CollegeCourseDepartmentSemesterSubject, Long>{
	   Optional<CollegeCourseDepartmentSemesterSubject> findByCollegeCourseDepartmentAndSemesterAndSubject(
		        CollegeCourseDepartment collegeCourseDepartment,
		        Semester semesterMetadata,
		        Subject subject
		    );
	   
	   Optional<CollegeCourseDepartmentSemesterSubject> findBySemesterAndSubject(Semester semester, Subject subject);
}
