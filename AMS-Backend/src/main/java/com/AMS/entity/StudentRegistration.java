package com.AMS.entity;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class StudentRegistration {
    
	    @Id
		@GeneratedValue(strategy=GenerationType.AUTO)
		private int studentId;
		private String studentPassword;
	    private String studentEmail;
	    private String studentDepartment;
	    private String studentSem;
	    private String studentName;
	    private Date studentDob;
	    private String studentGender;
	    private String studentNumber;
	    private String studentParentsNumber;
	    public int getStudentId() {
			return studentId;
		}
		public void setStudentId(int studentId) {
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
		public String getStudentDepartment() {
			return studentDepartment;
		}
		public void setStudentDepartment(String studentDepartment) {
			this.studentDepartment = studentDepartment;
		}
		public String getStudentSem() {
			return studentSem;
		}
		public void setStudentSem(String studentSem) {
			this.studentSem = studentSem;
		}
		public String getStudentName() {
			return studentName;
		}
		public void setStudentName(String studentName) {
			this.studentName = studentName;
		}
		public Date getStudentDob() {
			return studentDob;
		}
		public void setStudentDob(Date studentDob) {
			this.studentDob = studentDob;
		}
		public String getStudentGender() {
			return studentGender;
		}
		public void setStudentGender(String studentGender) {
			this.studentGender = studentGender;
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

	    @PrePersist
	    public void generatePassword() {
	        this.studentPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 6); // 8-char password
	    }

	
}