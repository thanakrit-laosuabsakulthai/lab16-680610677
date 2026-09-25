import type { Student, Course, } from "@/lib/types";


/*
รหัสวิชา	ชื่อวิชา	จำนวน นศ.	นักศึกษาที่ลงทะเบียน
CS101	Introduction to Programming	2	
Cillian Murphy
Zendaya Coleman
CS201	Data Structures	1	
Cillian Murphy
CPE301	Basic Computer Engineering Lab	2	
Florence Pugh
Zendaya Coleman
CPE302	Full Stack Development	1	
Zendaya Coleman
ISNE101	Introduction to Information Systems and Network Engineering	1	
Emily Blunt



*/

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    enrolledCourses: [],
    status: "Active"
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    enrolledCourses: ["CS101", "CS201"],
    status: "Active"
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    enrolledCourses: ["ISNE101"],
    status: "Active"
  },
  {
    studentId: "650610004",
    firstName: "Florence",
    lastName: "Pugh",
    program: "CPE",
    enrolledCourses: ["CPE301"],
    status: "Active"
  },
  {
    studentId: "650610005",
    firstName: "Zendaya",
    lastName: "Coleman",
    program: "CPE",
    enrolledCourses: ["CS101", "CPE301", "CPE302"],
    status: "Active"
  },
];

export const courses: Course[] = [
  {
    courseCode: "CS101",
    courseTitle: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseCode: "CS201",
    courseTitle: "Data Structures",
    instructors: ["Chanadda"],
  },
  {
    courseCode: "CPE301",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseCode: "CPE302",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseCode: "ISNE101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },  
];
