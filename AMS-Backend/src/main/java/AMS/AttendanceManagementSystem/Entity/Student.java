package AMS.AttendanceManagementSystem.Entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class Student {
    
	    @Id
		@GeneratedValue(strategy=GenerationType.AUTO)
		private Long studentId;
	    
		private String studentPassword;
		
	    private String studentEmail;
	   
	    private String studentName;
	    
	    private String studentNumber;
	    
		private String studentParentsNumber;
	    
	    
	    public Long getStudentId() {
			return studentId;
		}
	    
		public void setStudentId(Long studentId) {
			this.studentId = studentId;
		}
		
		public String getStudentPassword() {
			return studentPassword;
		}
		
		public void setStudentPassword(String studentPassword) {
			this.studentPassword = studentPassword;
		}
		
		public String getStudentEmail() {
			return studentEmail;
		}
		
		public void setStudentEmail(String studentEmail) {
			this.studentEmail = studentEmail;
		}
		
		
		public String getStudentName() {
			return studentName;
		}
		
		public void setStudentName(String studentName) {
			this.studentName = studentName;
		}
	
		public String getStudentNumber() {
			return studentNumber;
		}
		
		public void setStudentNumber(String studentNumber) {
			this.studentNumber = studentNumber;
		}
		
		public String getStudentParentsNumber() {
			return studentParentsNumber;
		}
		
		public void setStudentParentsNumber(String studentParentsNumber) {
			this.studentParentsNumber = studentParentsNumber;
		}
}
