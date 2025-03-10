package com.AMS.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.AMS.Dto.StudentLoginDto;
import com.AMS.entity.StudentRegistration;
import com.AMS.services.StudentRegService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StudentRegController {

	@Autowired
	private StudentRegService srs;
	
//	Student register api
	 @PostMapping("/studentregister")
	    public StudentRegistration registerUser(@RequestBody StudentRegistration sr) {
	        return srs.create(sr);
	    }
	
//	 Student login api
	 @PostMapping("/studentlogin")
	 public ResponseEntity<Map<String,String>> facultyLogin(@RequestBody StudentLoginDto sld){
		 
		 Map<String,String> response=new HashMap();
		 
		 if(srs.facultyAuthentication(sld.getStudentId(), sld.getStudentPassword())) {
			   response.put("message", "Login Successful");
			 
			 return ResponseEntity.ok(response);
		 }
		 response.put("message","Invalid id or password");
		 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		 
	 }
	 
	 //fetch student list
	 @GetMapping("/students")
	 public List<StudentRegistration> fetchStudent(){
		 return srs.retriveStudents();
	 }

	
}