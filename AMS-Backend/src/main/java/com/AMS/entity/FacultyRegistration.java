package com.AMS.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
public class FacultyRegistration {
    @Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int facultyId;
    
    @Column(unique = true, nullable = false)
    @NotBlank
    private String facultyPassword;
    
    @NotBlank
    private String facultyDesignation;
    
    @NotBlank
    @Email
    private String facultyEmail;
    
    @NotBlank
	private String facultyDepartment;
    
    @NotBlank
    private String facultyName;
    
    @NotBlank
    private Date facultyDob;
    
    @NotBlank
    private String facultyGender;
    
    @NotBlank
    private String facultyNumber;
    
    public String getFacultyEmail() {
		return facultyEmail;
	}

	public void setFacultyEmail(String facultyEmail) {
		this.facultyEmail = facultyEmail;
	}
	
    public String getFacultyName() {
		return facultyName;
	}

	public void setFacultyName(String facultyName) {
		this.facultyName = facultyName;
	}

	public Date getFacultyDob() {
		return facultyDob;
	}

	public void setFacultyDob(Date facultyDob) {
		this.facultyDob = facultyDob;
	}

	public String getFacultyGender() {
		return facultyGender;
	}

	public void setFacultyGender(String facultyGender) {
		this.facultyGender = facultyGender;
	}

	public String getFacultyNumber() {
		return facultyNumber;
	}

	public void setFacultyNumber(String facultyNumber) {
		this.facultyNumber = facultyNumber;
	}

	public int getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(int facultyId) {
		this.facultyId = facultyId;
	}

	public String getFacultyDesignation() {
		return facultyDesignation;
	}

	public void setFacultyDesignation(String facultyDesignation) {
		this.facultyDesignation = facultyDesignation;
	}

	public String getFacultyDepartment() {
		return facultyDepartment;
	}

	public void setFacultyDepartment(String facultyDepartment) {
		this.facultyDepartment = facultyDepartment;
	}


    // Generate password before saving
    @PrePersist
    public void generatePassword() {
        this.facultyPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8); // 8-char password
    }

    // Getters and Setters
    public String getFacultyPassword() {
        return facultyPassword;
    }

    public void setFacultyPassword(String facultyPassword) {
        this.facultyPassword = facultyPassword;
    }
}
