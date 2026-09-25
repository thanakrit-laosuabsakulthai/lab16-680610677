import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  addStudentsToCourse: (studentIds: string[], courseCode: string) => void;
  removeStudentFromCourse: (studentId: string, courseCode: string) => void;
  addCourse: (course: Course) => void;
  removeCourse: (courseCode: string) => void;
  removeInstructorFromCourse: (instructorName: string, courseCode: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      addStudentsToCourse: (studentIds, courseCode) =>
        set((state) => ({
          students: state.students.map((s) =>
            studentIds.includes(s.studentId)
              ? {
                ...s,
                enrolledCourses: [...s.enrolledCourses, courseCode],
              }
              : s
          ),
        })),
      
      removeStudentFromCourse: (studentId, courseCode) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === studentId
              ? {
                ...s,
                enrolledCourses: s.enrolledCourses.filter((c) => c !== courseCode),
              }
              : s
          ),
        })),
      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, course],
        })),
      removeCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((s) => ({
            ...s,
            enrolledCourses: s.enrolledCourses.filter((c) => c !== courseCode),
          })),
        })),
      removeInstructorFromCourse: (instructorName, courseCode) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === courseCode
              ? {
                ...c,
                instructors: c.instructors?.filter((i) => i !== instructorName),
              }
              : c
          ),
        }))
    }),
    {
      name: "lab16-2569-680610677",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    }
  ),
);
