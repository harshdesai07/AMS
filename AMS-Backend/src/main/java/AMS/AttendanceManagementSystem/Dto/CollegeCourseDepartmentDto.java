package AMS.AttendanceManagementSystem.Dto;

import java.util.List;

public class CollegeCourseDepartmentDto {
	private String courseName;
	
	private Integer collegeId;
	
	private List<String> departments;
	
    public CollegeCourseDepartmentDto() {}
	
	
	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public List<String> getDepartments() {
		return departments;
	}

	public void setDepts(List<String> departments) {
		this.departments = departments;
	}

	public Integer getCollegeId() {
		return collegeId;
	}
	
	public void setCollegeId(Integer collegeId) {
		this.collegeId = collegeId;
	}
}
