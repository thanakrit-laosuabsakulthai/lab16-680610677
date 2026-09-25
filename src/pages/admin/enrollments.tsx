import { useState, Fragment } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";

import {
  DeletableStudentBadge,
} from "@/components/DeletableBadge";


type Option = { value: string; label: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, addStudentsToCourse} = useEnrollmentStore();

  const [formStudent, setFormStudent] = useState<string[]>([]);
  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");
  

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));
  
  const handleAddStudentsToCourse = () => {
    if (!formCourse || formStudent.length === 0) return;
    addStudentsToCourse(formStudent, formCourse);
    setEnrollDialogOpen(false);
  }

  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormStudent([]);
      setFormCourse(null);
    }
  };

  const rows = courses.filter((c) =>
    mode === "course"
      ? filterCourse === "all" || c.courseCode === filterCourse
      : filterStudent === "all" || students.find((s) => s.studentId === filterStudent)?.enrolledCourses.includes(c.courseCode)
  );

  const nameOf = (studentId: string) => {
    const s = students.find((x) => x.studentId === studentId);
    return s ? `${s.firstName} ${s.lastName}` : "-";
  };
  
  const anchor = useComboboxAnchor();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
            <DialogDescription>
              เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">วิชา</Label>
              <OptionSelect
                id="formCourse"
                options={[{ value: "", label: "เลือกวิชา" }, ...courseOptions]}
                value={formCourse}
                placeholder={"เลือกวิชา"}
                onChange={setFormCourse}
              />
            </div>
            {/* เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน) */}
            <div className="grid gap-1.5">
              <Label htmlFor="formStudent">นักศึกษา</Label>
              {
              
              <Combobox
                multiple
                autoHighlight
                value={formStudent}
                onValueChange={(v) => setFormStudent(v)}
                disabled={!formCourse}
              >
                <ComboboxChips ref={anchor} className="w-full"
                  >
                  <ComboboxValue 
                  >
                    {(values) => (
                      <Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{nameOf(value)}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          placeholder={
                            
                            (formStudent.length > 0)
                            ? ""
                            : ((!formCourse)
                            ? "เลือกวิชาก่อน"
                            : (students.filter((s) => !s.enrolledCourses.includes(formCourse)).length === 0)
                            ? "นักศึกษาทุกคนลงทะเบียนวิชานี้แล้ว"
                            : "ค้นหา/เลือกนักศึกษา")
                          }
                        
                        
                        />
                      </Fragment>
                    )}  
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  {
                    (students.filter((s) => !formCourse || !s.enrolledCourses.includes(formCourse)).length === 0)
                    && <ComboboxEmpty>ไม่พบนักศึกษา</ComboboxEmpty>
                  }
                  
                  <ComboboxList>
                    {students
                      .filter((s) => !formCourse || !s.enrolledCourses.includes(formCourse))
                      .map((s) => (
                        <ComboboxItem key={s.studentId} value={s.studentId}>
                          {`${s.studentId} — ${s.firstName} ${s.lastName}`}
                        </ComboboxItem>
                      ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              
              
              }
            </div>
          </div>
          {/* เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน) */}
          <DialogFooter>
            <Button disabled={!formStudent || !formCourse || formStudent.length === 0}
              onClick={handleAddStudentsToCourse}
            >
              <PlusCircle className="h-4 w-4" />
              {formStudent.length > 0 ? `ลงทะเบียน (${formStudent.length} คน)` : "ลงทะเบียน"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            

            {rows.map((c) => (
              <TableRow key={`${c.courseCode}`}>
                <TableCell>{c.courseCode}</TableCell>
                <TableCell>{c.courseTitle}</TableCell>
                <TableCell>
                  {students.filter((s) =>
                    s.enrolledCourses.includes(c.courseCode)
                  ).length}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                  {
                    students
                    .filter((s) => s.enrolledCourses.includes(c.courseCode))
                    .map((s) => (
                      <DeletableStudentBadge
                        key={s.studentId}
                        student={s}
                        courseCode={c.courseCode}
                      />
                   ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
