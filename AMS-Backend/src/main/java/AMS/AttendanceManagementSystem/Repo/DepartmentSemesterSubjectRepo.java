package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Entity.DepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;

@Repository
public interface DepartmentSemesterSubjectRepo extends JpaRepository<DepartmentSemesterSubject, Long>{
	Optional<DepartmentSemesterSubject> findByDepartmentAndSemesterAndSubject(Department department,
			Semester semester,
			Subject subject);
}
