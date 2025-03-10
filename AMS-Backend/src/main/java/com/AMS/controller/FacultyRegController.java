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

import com.AMS.Dto.FacultyLoginDto;
import com.AMS.entity.FacultyRegistration;
import com.AMS.entity.StudentRegistration;
import com.AMS.services.FacultyRegService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyRegController {

	@Autowired
	private FacultyRegService frs;

//	faculty register api
	@PostMapping("/facultyregister")
	public FacultyRegistration registerUser(@RequestBody FacultyRegistration fr) {
		return frs.create(fr);
	}

//	 faculty login api
	@PostMapping("/facultylogin")
	public ResponseEntity<Map<String, String>> facultyLogin(@RequestBody FacultyLoginDto fld) {

		Map<String, String> response = new HashMap();

		if (frs.facultyAuthentication(fld.getFacultyId(), fld.getFacultyPassword())) {
			response.put("message", "Login Successful");

			return ResponseEntity.ok(response);
		}
		response.put("message", "Invalid id or password");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

	}
	
	//fetch faculty list
		 @GetMapping("/facultys")
		 public List<FacultyRegistration> fetchFaculty(){
			 return frs.retriveFaculty();
		 }

}
