package com.AMS.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.AMS.entity.FacultyRegistration;
import com.AMS.repository.FacultyRegRepo;

@Service
public class FacultyRegService {
	@Autowired
	private FacultyRegRepo frr;

	public FacultyRegistration create(FacultyRegistration fr) {
		return frr.save(fr);
	}

	public boolean facultyAuthentication(int id, String password) {
//		this is use to store user object if it is null then also it will store give no nullpointer exceptyion
		Optional<FacultyRegistration> user = frr.findById(id);

		if (user.isPresent()) {
			FacultyRegistration fr = user.get();
			return fr.getFacultyPassword().equals(password);
		}

		return false;

	}
	
	// get faculty list
	public List<FacultyRegistration> retriveFaculty(){
		return frr.findAll();
	}

}