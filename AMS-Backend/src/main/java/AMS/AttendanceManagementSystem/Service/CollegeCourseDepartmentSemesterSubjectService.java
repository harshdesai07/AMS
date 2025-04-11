package AMS.AttendanceManagementSystem.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Entity.DepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.SemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.DepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.SubjectRepo;
import AMS.AttendanceManagementSystem.utils.ExcelReader;
import jakarta.transaction.Transactional;

@Service
public class CollegeCourseDepartmentSemesterSubjectService {

	@Autowired
	private CollegeCourseDepartmentSemesterSubjectRepo ccdssr;
	
	@Autowired
	private FacultyRepo fr;
	
	@Autowired
	private SubjectRepo sr;
	
	@Autowired
	private SemesterRepo semr;
	
	@Autowired
	private SemesterSubjectRepo ssr;
	
	@Autowired
	private DepartmentSemesterSubjectRepo dssr;
	
	// save subjects offered by college
	@Transactional
	public void saveSubjects(MultipartFile file, Long facultyId) {
		String sheetName = ExcelReader.getExcelSheetName(file); // read sheet name

		List<Map<String, String>> excelData = ExcelReader.readExcelSheet(file, sheetName);
		
		//1. find collegeCourseDepartment by faculty id
		CollegeCourseDepartment collegeCourseDepartment = fr.findCollegeCourseDepartmentByFacultyId(facultyId)
				.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for facultyId: " + facultyId));
		
		//2. find department
		Department department = collegeCourseDepartment.getDepartment();
		
		
		for (Map<String, String> row : excelData) {
			//3. find semester
			Semester semester = semr.findBysemesterNumber(row.get("semester"))
					.orElseThrow(() -> new RuntimeException("semester not found with number: "+ (row.get("semester"))));
			
			//4.set subject
			Optional<Subject> os = sr.findByName(row.get("subject name"));
			Subject subject;
			
			if(!os.isPresent()) {
				subject = new Subject();
				subject.setName(row.get("subject name"));
				//save in subject table
				subject = sr.save(subject);
			}
			else {
				subject = os.get();
			}
			
			//5. save in SemesterSubject
			Optional<SemesterSubject> oss = ssr.findBySemesterAndSubject(semester, subject);
			SemesterSubject semesterSubject;
			
			if(oss.isPresent()) {
				semesterSubject = oss.get();
			}
			else {
				semesterSubject = new SemesterSubject();
				semesterSubject.setSemesterMetadata(semester);
				semesterSubject.setSubject(subject);
				
				//save in SemesterSubject table
				semesterSubject = ssr.save(semesterSubject);
			}
			
			//6. save in DepartmentSemesterSubject
			Optional<DepartmentSemesterSubject> odss = dssr.findByDepartmentAndSemesterAndSubject(department, semester, subject);
			DepartmentSemesterSubject departmentSemesterSubject;
			
			if(odss.isPresent()) {
				departmentSemesterSubject = odss.get();
			}
			else {
				departmentSemesterSubject = new DepartmentSemesterSubject();
				departmentSemesterSubject.setDepartment(department);
				departmentSemesterSubject.setSemesterMetadata(semester);
				departmentSemesterSubject.setSubject(subject);
				
				departmentSemesterSubject = dssr.save(departmentSemesterSubject);
			}
			
			
			//7. save in CollegeCourseDepartmentSemesterSubject 
			Optional<CollegeCourseDepartmentSemesterSubject> occdss = ccdssr.findByCollegeCourseDepartmentAndSemesterAndSubject(collegeCourseDepartment, semester, subject);
			
			
			if(!occdss.isPresent()) {
			CollegeCourseDepartmentSemesterSubject collegeCourseDepartmentSemesterSubject = new CollegeCourseDepartmentSemesterSubject();
			collegeCourseDepartmentSemesterSubject.setCollegeCourseDepartment(collegeCourseDepartment);
			collegeCourseDepartmentSemesterSubject.setSemesterMetadata(semester);
			collegeCourseDepartmentSemesterSubject.setSubject(subject);
			
			ccdssr.save(collegeCourseDepartmentSemesterSubject);
			
		}
		
	}
}
}
