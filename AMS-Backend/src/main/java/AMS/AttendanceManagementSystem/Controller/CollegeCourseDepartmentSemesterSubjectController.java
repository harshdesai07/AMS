package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Service.CollegeCourseDepartmentSemesterSubjectService;

@RestController
@CrossOrigin("*")
public class CollegeCourseDepartmentSemesterSubjectController {

	@Autowired
	private CollegeCourseDepartmentSemesterSubjectService ccdsss;
	
	//add subjects through excel
	@PostMapping("/addSubjects/{facultyId}")
	public ResponseEntity<?> addSubjects(MultipartFile file, @PathVariable Long facultyId){
		Map<String, String> response = new HashMap<>();
		
		try {
			ccdsss.saveSubjects(file, facultyId);
			
			response.put("message", "Subject added successfully");
			return ResponseEntity.ok(response);
		
		}catch (Exception e) {
			response.put("error", "Subject added failed");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
}
