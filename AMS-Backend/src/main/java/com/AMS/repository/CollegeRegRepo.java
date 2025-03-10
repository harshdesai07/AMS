package com.AMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.AMS.entity.CollegeRegistration;

@Repository
public interface CollegeRegRepo extends JpaRepository<CollegeRegistration, String> {

}
