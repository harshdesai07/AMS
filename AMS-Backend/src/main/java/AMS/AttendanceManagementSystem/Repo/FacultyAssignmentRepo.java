package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.FacultyAssignment;

@Repository
public interface FacultyAssignmentRepo extends JpaRepository<FacultyAssignment, Long>{
	Optional<FacultyAssignment> findByFacultyFacultyId(Long id);

}
