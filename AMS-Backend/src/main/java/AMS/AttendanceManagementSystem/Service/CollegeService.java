package AMS.AttendanceManagementSystem.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;

@Service 
public class CollegeService implements UserDetailsService {
   
	@Autowired
	CollegeRepo crr;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EmailService es;

	
	public String create(College cr) {
		Optional<College> cn = crr.findByCollegeName(cr.getCollegeName());
		Optional<College> ce = crr.findByEmail(cr.getEmail());
		
		if(!cn.isPresent() && !ce.isPresent()) {
			//Encrypt the password
	        cr.setPassword(passwordEncoder.encode(cr.getPassword()));
			crr.save(cr);
			es.sendWelcomeEmailToCollege(cr.getEmail(), cr.getCollegeName(),"Hello! From AMS");
			return "null";
		}
		else if(cn.isPresent()) {
			return "namePresent";
		}
		
		return "emailPresent";
	}
	
	public College collegeAuthentication(String email,String password) {
//		this is use to store user object if it is null then also it will store give no null pointer exception
		return crr.findByEmailAndPassword(email, password);
		
	}
	
	@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        College c = crr.findByEmail(email).orElseThrow();
        return new User(c.getEmail(), c.getPassword(), List.of(new SimpleGrantedAuthority("COLLEGE")));
    }
	
}
