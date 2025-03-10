package com.AMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.AMS.entity.FacultyRegistration;

@Repository
public interface FacultyRegRepo extends JpaRepository<FacultyRegistration, Integer> {

}
