package com.AMS.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AMS.entity.CollegeRegistration;
import com.AMS.repository.CollegeRegRepo;

@Service
public class CollegeRegService {
	@Autowired
	private CollegeRegRepo crr;
	
	public CollegeRegistration create(CollegeRegistration cr) {
		return crr.save(cr);
	}
	
	public boolean collegeAuthentication(String email, String password) {
		Optional<CollegeRegistration> user = crr.findById(email);
		
		if(user.isPresent()) {
			CollegeRegistration cr = user.get();
			return password.equals(cr.getPassword());
		}
		
		return false;
	}
}
