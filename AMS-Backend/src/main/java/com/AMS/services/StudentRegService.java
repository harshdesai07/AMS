package com.AMS.services;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AMS.entity.StudentRegistration;
import com.AMS.repository.StudentRegRepo;

@Service
public class StudentRegService {
	@Autowired
	StudentRegRepo srr;
	
//	create new student in database
	public StudentRegistration create(StudentRegistration sr) {
		return srr.save(sr);
	}
	
	
//	checking credential for student login or authentication
	public boolean facultyAuthentication(int id,String password) {
//		this is use to store user object if it is null then also it will store give no nullpointer exceptyion
		Optional<StudentRegistration> user=srr.findById(id);
		
		if(user.isPresent()) {
			StudentRegistration sr=user.get();
			return sr.getStudentPassword().equals(password);
			}
		
		return false;
		
	}
	
	//retrive student list from db
	public List<StudentRegistration> retriveStudents(){
		return srr.findAll();
	}
}