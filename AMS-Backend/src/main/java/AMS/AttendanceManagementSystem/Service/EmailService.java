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

        // Send Email to  student 
    @Async
    public void sendStudentDetailsAndCredentials(
        String toEmail,
        String studentName,
        String studentNumber,
        String studentParentsNumber,
        String deptName,
        String courseName,
        String semester,
        String password,
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
                "Welcome! You've been registered by %s.\n\n" +
                "Please confirm your personal details below:\n\n" +
                "Name: %s\n" +
                "Student Number: %s\n" +
                "Parent's Number: %s\n" +
                "Course: %s\n" +
                "Department: %s\n" +
                "Semester: %s\n\n" +
                "If any of this info is incorrect, please contact your college.\n\n" +
                "Here are your login credentials:\n\n" +
                "Username: your email ID is your username\n" +
                "Password: %s\n\n" +
                "Please keep them safe and do not share with anyone.\n\n" +
                "You can log in at: https://yourplatform.com/login\n\n" +
                "All the best,\n%s",
                studentName, collegeName,
                studentName,
                studentNumber,
                studentParentsNumber,
                courseName,
                deptName,
                semester,
                password,
                collegeName
            );

            message.setText(text);

            mailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
        }
    }
    
//    updated email for updated information check for a student
    @Async
    public void sendUpdatedStudentInformation(
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
                "This is an update from %s.\n\n" +
                "Please confirm your updated personal details below:\n\n" +
                "Name: %s\n" +
                "Student Number: %s\n" +
                "Parent's Number: %s\n" +
                "Course: %s\n" +
                "Department: %s\n" +
                "Semester: %s\n\n" +
                "If any of this info is incorrect, please contact your college.\n\n" +
                "Best regards,\n%s",
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
    
        // Send email faculty 
    @Async
    public void sendFacultyDetailsAndCredentials(
        String toEmail,
        String facultyName,
        String facultyNumber,
        String facultyDesignation,
        String course,
        String department,
        String password,
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
                "Welcome! You've been registered by %s.\n\n" +
                "Please confirm your personal details below:\n\n" +
                "Name: %s\n" +
                "Faculty Number: %s\n" +
                "Designation: %s\n" +
                "Course: %s\n" +
                "Department: %s\n\n" +
                "If any of this info is incorrect, please contact your college.\n\n" +
                "Here are your login credentials:\n\n" +
                "Username: your email ID is your username\n" +
                "Password: %s\n\n" +
                "Please keep them safe and do not share with anyone.\n\n" +
                "You can log in at: https://yourplatform.com/login\n\n" +
                "All the best,\n%s",
                facultyName, collegeName,
                facultyName,
                facultyNumber,
                facultyDesignation,
                course,
                department,
                password,
                collegeName
            );

            message.setText(text);

            mailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
        }
    }        
    
//    updated information email for faculty
    @Async
    public void sendUpdatedFacultyInformation(
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
                "This is an update from %s.\n\n" +
                "Please confirm your updated personal details below:\n\n" +
                "Name: %s\n" +
                "Faculty Number: %s\n" +
                "Designation: %s\n" +
                "Course: %s\n" +
                "Department: %s\n\n" +
                "If any of this info is incorrect, please contact your college.\n\n" +
                "Best regards,\n%s",
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
    
    
    //task assignment email
    @Async
    public void sendTaskAssignmentNotification(
        String toEmail,
        String facultyName,
        String hodName,
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
                "Dear %s,\n\n" +
                "You have been assigned a new task by %s (HOD, %s Department).\n\n" +
                "Please check your dashboard for task details and deadline information.\n\n" +
                "You can view and manage your tasks here: https://yourplatform.com/tasks\n\n" +
                "Best regards,\n%s",
                facultyName,
                hodName,
                department,
                collegeName
            );

            message.setText(text);

            mailSender.send(message);
        } catch (MailException e) {
            e.printStackTrace();
        }
    }
    
//  password change email confirmation 
    
  @Async
  public void sendPasswordChangeConfirmation(
      String toEmail,
      String userName,
      String userType, // "student", "faculty", "hod", or "college"
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

          String greeting = "Dear " + userName + ",\n\n";
          
          String accountType;
          String loginUrl;
          
          switch (userType.toLowerCase()) {
              case "student":
                  accountType = "Student Account";
                  loginUrl = "https://yourplatform.com/login";
                  break;
              case "faculty":
                  accountType = "Faculty Account";
                  loginUrl = "https://yourplatform.com/login";
                  break;
              case "hod":
                  accountType = "Head of Department (HOD) Account";
                  loginUrl = "https://yourplatform.com/hod/dashboard";
                  break;
              case "college":
                  accountType = "College Admin Account";
                  loginUrl = "https://yourplatform.com/admin/login";
                  break;
              default:
                  accountType = "Account";
                  loginUrl = "https://yourplatform.com/login";
          }

          String body = 
              "This is to confirm that your **" + collegeName + " " + accountType + "** password has been successfully changed.\n\n" +
              "**If you did not request this change**, please contact IT support immediately at: **" + collegeEmail + "**\n\n" +
              "**Security Tips:**\n" +
              "✅ Never share your password with anyone\n" +
              "✅ Use a strong, unique password\n" +
              "✅ Change your password regularly\n\n" +
              "You can log in here: " + loginUrl + "\n\n" +
              "Best regards,\n" +
              collegeName + " IT Support";

          message.setText(greeting + body);
          mailSender.send(message);
      } catch (MailException e) {
          e.printStackTrace();
      }
  }
  
//fees notification to student
  
@Async
public void sendSemesterFeeReminder(
    String toEmail,
    String studentName,
    String semester,
    String collegeName,
    String subject
) {
    try {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject(subject);
        message.setFrom("ams.alerts2025@gmail.com");
        message.setReplyTo("accounts@" + collegeName.toLowerCase().replace(" ", "") + ".edu");

        String text = String.format(
            "Dear %s,\n\n" +
            "URGENT REMINDER: You have not submitted your %s semester fees.\n\n" +
            "This is a final notice to complete your payment immediately to avoid:\n" +
            "• Late payment penalties\n" +
            "• Registration holds\n" +
            "• Suspension of academic services\n\n" +
            "Visit your student dashboard now to complete payment:\n" +
            "https://studentportal.%s.edu/fees\n\n" +
            "Contact accounts department if you've already paid.\n\n" +
            "Best regards,\n%s Accounts Office",
            studentName,
            semester,
            collegeName.toLowerCase().replace(" ", ""),
            collegeName
        );

        message.setText(text);
        mailSender.send(message);
    } catch (MailException e) {
        e.printStackTrace();
    }
}

//Send attendance status email to student
@Async
public void sendStudentAttendanceStatus(
 String toEmail,
 String studentName,
 String subjectName,
 String departmentName,
 String date,
 String status, // "Present" or "Absent"
 String professorName,
 String collegeName,
 String subject
) {
 try {
     SimpleMailMessage message = new SimpleMailMessage();

     message.setTo(toEmail);
     message.setSubject(subject);
     message.setFrom("ams.alerts2025@gmail.com");

     String text = String.format(
         "Dear %s,\n\n" +
         "This is to inform you about your attendance status for %s.\n\n" +
         "Attendance Details:\n\n" +
         "Department: %s\n" +
         "Subject: %s\n" +
         "Date: %s\n" +
         "Status: %s\n" +
         "Reported by: Prof. %s\n\n" +
         "If you believe this status is incorrect, please contact your professor " +
         "or the administration office within 3 working days.\n\n" +
         "Regular attendance is important for your academic progress. " +
         "Please ensure you attend all classes regularly.\n\n" +
         "Best regards,\n%s Attendance System",
         studentName,
         subjectName,
         departmentName,
         subjectName,
         date,
         status,
         professorName,
         collegeName
     );

     message.setText(text);

     mailSender.send(message);
 } catch (MailException e) {
     e.printStackTrace();
 }
}
        
    }