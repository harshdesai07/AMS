package AMS.AttendanceManagementSystem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

   

        // Send student Personal Details Confirmation Email
    @Async
    public void sendStudentPersonalDetailsConfirmation(
    	    String toEmail,
    	    String studentName,
    	    String studentNumber,
    	    String studentParentsNumber,
    	    String deptName,
    	    String courseName,
    	    String semester,
    	    String collegeName,
    	    String collegeEmail,
    	    String subject
    	    
    	) {
    	    try {
    	        SimpleMailMessage message = new SimpleMailMessage();

    	        message.setTo(toEmail);
    	        message.setSubject(subject);
    	        message.setFrom("ams.alerts2025@gmail.com");
    	        message.setReplyTo(collegeEmail);

    	        String text = String.format(
    	            "Hello %s,\n\n" +
    	            "You’ve been registered by %s.\n\n" +
    	            "Please confirm your personal details below:\n\n" +
    	            "Name: %s\n" +
    	            "Student Number: %s\n" +
    	            "Parent's Number: %s\n" +
    	            "Course: %s\n" +
    	            "Department: %s\n" +
    	            "Semester: %s\n\n" +
    	            "If any of this info is incorrect, please contact your college.\n\n" +
    	            "Cheers,\n%s",
    	            studentName, collegeName,
    	            studentName,
    	            studentNumber,
    	            studentParentsNumber,
    	            courseName,
    	            deptName,
    	            semester,
    	            collegeName
    	        );

    	        message.setText(text);

    	        mailSender.send(message);
    	    } catch (MailException e) {
    	        e.printStackTrace();
    	    }
    	}
    
        // Send student and faculty Login Credentials Email
    @Async
        public void sendLoginCredentials(String toEmail,
        		String name,
        		String password,
        		String collegeName,
        		String collegeEmail,
        		String subject) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);
                message.setSubject(subject + collegeName);
                message.setFrom("ams.alerts2025@gmail.com");
                message.setReplyTo(collegeEmail);

                String text = String.format(
                        "Hello %s,\n\n" +
                        "Welcome! You've been registered by %s.\n\n" +
                        "Here are your login credentials:\n\n" +
                        "Username: your email ID is your username\n" +
                        "Password: %s\n\n" +
                        "Please keep them safe and do not share with anyone.\n\n" +
                        "You can log in at: https://yourplatform.com/login\n\n" +
                        "All the best,\n%s",
                        name, collegeName, password, collegeName
                    );

                message.setText(text);

                mailSender.send(message);
            } catch (MailException e) {
                e.printStackTrace();
            }
        }
        
     // Send faculty Personal Details Confirmation Email
    @Async
        public void sendFacultyPersonalDetailsConfirmation(
            String toEmail,
            String facultyName,
            String facultyNumber,
            String facultyDesignation,
            String course,
            String department,
            String collegeName,
            String collegeEmail,
            String subject
        ) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(toEmail);
                message.setSubject(subject);
                message.setFrom("ams.alerts2025@gmail.com");
                message.setReplyTo(collegeEmail);

                String text = String.format(
                    "Hello %s,\n\n" +
                    "You’ve been registered by %s.\n\n" +
                    "Please confirm your personal details below:\n\n" +
                    "Name: %s\n" +
                    "Faculty Number: %s\n" +
                    "Designation: %s\n" +
                    "Course: %s\n" +
                    "Department: %s\n\n" +
                    "If any of this info is incorrect, please contact your college.\n\n" +
                    "Cheers,\n%s",
                    facultyName, collegeName,
                    facultyName,
                    facultyNumber,
                    facultyDesignation,
                    course,
                    department,
                    collegeName
                );

                message.setText(text);

                mailSender.send(message);
            } catch (MailException e) {
                e.printStackTrace();
            }
        }
        
     // Send Welcome Email to College
    @Async
        public void sendWelcomeEmailToCollege(
            String collegeEmail,
            String collegeName,
            String subject
        ) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(collegeEmail);
                message.setSubject(subject);
                message.setFrom("ams.alerts2025@gmail.com");

                String text = String.format(
                    "Welcome to AMS,\n\n" +
                    "We are excited to have %s join our platform.\n\n" +
                    "If you have any questions or need assistance, feel free to reach out to us.\n\n" +
                    "Best regards,\n" +
                    "The AMS Team",
                    collegeName
                );

                message.setText(text);

                mailSender.send(message);
            } catch (MailException e) {
                e.printStackTrace();
            }
        }
        
    }