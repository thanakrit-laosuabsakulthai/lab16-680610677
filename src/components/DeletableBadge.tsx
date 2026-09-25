import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentStore } from "@/lib/enrollment-store";

type DeletableBadgeProps = {
  student: { studentId: string; firstName: string; lastName: string };
  courseCode: string;
};

export function DeletableStudentBadge({ student, courseCode }: DeletableBadgeProps) {
  const removeStudentFromCourse = useEnrollmentStore(
    (state) => state.removeStudentFromCourse
  );
  
  const handleDelete = () => {
    removeStudentFromCourse(student.studentId, courseCode);
  };

  return (
    <Badge
      className="flex items-center gap-2 bg-sky-50 text-sky-700"
      variant="outline"
      onClick={handleDelete}
    >
      {student.firstName} {student.lastName}
      <X size={16} />
    </Badge>
  );
}

export function DeletableInstructorBadge({ instructorName, courseCode }: { instructorName: string; courseCode: string }) {
  const removeInstructorFromCourse = useEnrollmentStore(
    (state) => state.removeInstructorFromCourse
  );
  const handleDelete = () => {
    removeInstructorFromCourse(instructorName, courseCode);
  }
  return (
    <Badge
      className="flex items-center gap-2 bg-sky-50 text-sky-700"
      variant="outline"
      onClick={handleDelete}
    >
      {instructorName}
      <X size={16} />
    </Badge>
  );
}