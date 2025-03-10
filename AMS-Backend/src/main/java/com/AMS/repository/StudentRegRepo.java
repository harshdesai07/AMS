package com.AMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.AMS.entity.StudentRegistration;

@Repository
public interface StudentRegRepo extends JpaRepository<StudentRegistration, Integer> {

}
