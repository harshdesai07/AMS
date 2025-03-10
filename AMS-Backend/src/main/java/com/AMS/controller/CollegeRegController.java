package com.AMS.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.AMS.Dto.CollegeLoginDto;
import com.AMS.entity.CollegeRegistration;
import com.AMS.services.CollegeRegService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class CollegeRegController {
	@Autowired
	private CollegeRegService crs;
	
//	college register api
	 @PostMapping("/register")
	    public CollegeRegistration registerUser(@RequestBody CollegeRegistration cr) {
	        return crs.create(cr);
	    }
	
//	 college login api
	 @PostMapping("/collegelogin")
	 public ResponseEntity<Map<String,String>> collegeLogin(@RequestBody CollegeLoginDto cld){
		 
		 Map<String,String> response=new HashMap();
		 
		 if(crs.collegeAuthentication(cld.getCollegeEmail(), cld.getPassword())) {
			   response.put("message", "Login Successful");
			 
			 return ResponseEntity.ok(response);
		 }
		 response.put("message","Invalid id or password");
		 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
		 
	 }
	
}