package AMS.AttendanceManagementSystem.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;


@Service
public class StudentService implements UserDetailsService{
	@Autowired
	StudentRepo srr;

	@Autowired
	CollegeRepo crr;

//	checking credential for student login or authentication
	public boolean studentAuthentication(Long id, String password) {
//		this is use to store user object if it is null then also it will store give no nullpointer exceptyion
		Optional<Student> user = srr.findById(id);

		if (user.isPresent()) {
			Student sr = user.get();
			return sr.getStudentPassword().equals(password);
		}

		return false;

	}
	
	@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Student s = srr.findByStudentEmail(email).orElseThrow();
        return new User(s.getStudentEmail(), s.getStudentPassword(), List.of(new SimpleGrantedAuthority("STUDENT")));
    }
}
