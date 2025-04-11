package AMS.AttendanceManagementSystem.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;


import AMS.AttendanceManagementSystem.Security.JwtRequestFilter;
import AMS.AttendanceManagementSystem.Service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableAsync
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public end points
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/register").permitAll()
                .requestMatchers("/getCourses").permitAll()
                .requestMatchers("/departments/{courseId}").permitAll()
                .requestMatchers("/getSemester/{courseName}").permitAll()
                
                // College end points
                .requestMatchers("/courses/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/addCourseDept").hasAuthority("COLLEGE")
                .requestMatchers("/getDepartments/{collegeId}/{courseName}").hasAuthority("COLLEGE")
                .requestMatchers("/facultyregister/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/getfaculty/{id}").hasAuthority("COLLEGE")
                .requestMatchers("/updatefaculty/{id}").hasAuthority("COLLEGE")
                .requestMatchers("/deletefaculty/{id}").hasAuthority("COLLEGE")
                .requestMatchers("/uploadFacultyExcel/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/studentregister/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/updatestudent/{studentId}").hasAuthority("COLLEGE")
                .requestMatchers("/deletestudent/{studentId}").hasAuthority("COLLEGE")
                .requestMatchers("/getstudent/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/uploadStudentExcel/{collegeId}").hasAuthority("COLLEGE")
                
                // HOD end points
                .requestMatchers("/addSubjects").hasAuthority("HOD")
                .requestMatchers("/SubjectAssign").hasAuthority("HOD")
                
                // Faculty end points
                .requestMatchers("/faculty/markAttendance/**").hasAuthority("FACULTY")
                .requestMatchers("/faculty/getStudents/**").hasAuthority("FACULTY")
                
                // Student end points
                .requestMatchers("/student/attendance/**").hasAuthority("STUDENT")
                
                // Any other request needs authentication
                .anyRequest().authenticated())
            .cors(Customizer.withDefaults()) 
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
