package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.StudentLoginDto;
import AMS.AttendanceManagementSystem.Service.StudentService;

@RestController
@CrossOrigin("*")
public class StudentController {

	@Autowired
	private StudentService srs;

////	 Student login api
//	@PostMapping("/studentlogin")
//	public ResponseEntity<Map<String, String>> studentLogin(@RequestBody StudentLoginDto sld) {
//
//		Map<String, String> response = new HashMap<>();
//
//		if (srs.studentAuthentication(sld.getStudentId(), sld.getStudentPassword())) {
//			response.put("message", "Login Successful");
//
//			return ResponseEntity.ok(response);
//		}
//		response.put("message", "Invalid id or password");
//		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//
//	}

}
