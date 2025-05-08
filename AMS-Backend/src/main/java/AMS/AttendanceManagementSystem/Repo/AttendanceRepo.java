package AMS.AttendanceManagementSystem.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.Attendance;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance, Long>{

}
