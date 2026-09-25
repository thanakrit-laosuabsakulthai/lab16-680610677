/* 
 หน้าจัดการวิชาเรียน (/admin/courses)
3.1. เพิ่มเมนู “จัดการวิชาเรียน” ใน Sidebar (1 pts)
3.2. แสดงตารางวิชาด้วย Table ของ shadcn/ui (มีใน starter แล้ว) แสดงคอลัมน์ รหัสวิชา, ชื่อวิชา, 
ผู้สอน และ Action โดยคอลัมน์ผู้สอนแสดงเป็น Badge ที่มีปุ่ม X เพื่อใช้ลบผู้สอนคนนั้นออกได้ทันที 
(ถ้าไม่มีผู้สอนให้แสดง “ยังไม่มีผู้สอน”) ส่วนคอลัมน์ Action เป็นปุ่มถังขยะลบวิชา ที่ต้องมี 
AlertDialog ยืนยันก่อนลบ ดังรูปที่ 1 (3 pts)
3.3. ปุ่ม “+ เพิ่มวิชา” เปิด Dialog เพื่อกรอก รหัสวิชา, ชื่อวิชา และผู้สอน โดยช่องผู้สอนใช้ 
Combobox แบบ Multiple เลือกได้จากชื่อผู้สอนที่มีอยู่แล้วในทุกวิชา (ไม่ซ้ำกัน) 
หรือพิมพ์ชื่อใหม่แล้วเลือกตัวเลือก + เพิ่มผู้สอน "ชื่อ" ดังรูปที่ 2 (3 pts)
รูปที่ 2 ช่องผู้สอนแบบ Combobox Multiple ที่พิมพ์เพิ่มผู้สอนใหม่ได้
3.4. ถ้ารหัสวิชาที่กรอกมีอยู่แล้ว (ไม่สนตัวพิมพ์เล็ก-ใหญ่ เช่น cs101 = CS101) 
ให้แสดงข้อความสีแดงใต้ช่องว่า "มีรหัสวิชา CS101 นี้แล้ว" ช่องกรอกเป็นกรอบสีแดง (ariainvalid) และกดปุ่มบันทึกไม่ได้ ดังรูปที่ 2 (1 pts)
*/

import { useState, Fragment } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Label } from "@/components/ui/label";

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

// inputs
import { Input } from "@/components/ui/input";

import { useEnrollmentStore } from "@/lib/enrollment-store";

import {
  DeletableInstructorBadge,
} from "@/components/DeletableBadge";

import type { Course } from "@/lib/types";

type Option = { value: string; label: string };

export default function AdminCoursesPage() {
  const { courses, addCourse, removeCourse } = useEnrollmentStore();

  const [formInstructor, setFormInstructor] = useState<string[]>([]);
  const [instructorInput, setInstructorInput] = useState<string>("");
  const [formCourseTitle, setFormCourseTitle] = useState<string>("");
  const [formCourseCode, setFormCourseCode] = useState<string>("");
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  
  const instructorOptions: Option[] = Array.from(
    new Set(courses.flatMap((c) => c.instructors ?? []))
  ).map((name) => ({ value: name, label: name }));
  
  const handleAddCustomInstructor = (name: string) => {
    if (!name.trim()) return;
    if (!instructorOptions.some((o) => o.value === name)) {
      setFormInstructor((prev) => [...prev, name]);
    }
    setInstructorInput("");
  }
  
  const handleAddCourse = () => {
    if (!formCourseCode || !formCourseTitle) return;
    const newCourse: Course = {
        courseCode: formCourseCode,
        courseTitle: formCourseTitle,
        instructors: formInstructor,
    };
    addCourse(newCourse);
    handleEnrollDialogOpenChange(false);
  };
  
  const handleRemoveCourse = (courseCode: string) => {
    removeCourse(courseCode);
  }
  
  const isCourseCodeDuplicate = courses.some((c) => c.courseCode.toLowerCase() === formCourseCode.toLowerCase());
  
  // เคลียร์ฟอร์มทุกครั้งที่ Dialog ปิด ไม่ว่าจะปิดเพราะลงทะเบียนสำเร็จ, กด X,
  // หรือคลิกนอก Dialog — เปิดครั้งหน้าจะได้เริ่มจากฟอร์มว่างเสมอ
  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormCourseCode("");
      setFormCourseTitle("");
      setFormInstructor([]);
    }
  };

  const rows = courses;
  
  const anchor = useComboboxAnchor();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
        <p className="text-sm text-muted-foreground">
          {
            `
            ${courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
            `
          }
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
        <DialogTrigger render={<Button />}>
          <PlusCircle className="h-4 w-4" />
          เพิ่มวิชา
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">รหัสวิชา</Label>
              <Input
                id="formCourse"
                value={formCourseCode}
                aria-invalid={isCourseCodeDuplicate}
                onChange={(e) => setFormCourseCode(e.target.value)}
              />
              {isCourseCodeDuplicate && (
                <p className="text-sm text-red-600">
                  มีรหัสวิชา {formCourseCode} นี้แล้ว
                </p>
              )}
            </div>
            
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="formCourse">ชื่อวิชา</Label>
              <Input
                id="formCourse"
                value={formCourseTitle}
                onChange={(e) => setFormCourseTitle(e.target.value)}
              />
            </div>
          </div>
            
            <div className="grid gap-1.5">
              <Label htmlFor="formInstructor">ผู้สอน</Label>
              {
              
              <Combobox
                multiple
                autoHighlight
                value={formInstructor}
                onValueChange={(v) => setFormInstructor(v as string[])}
              >
                {/* <ComboboxInput
                  placeholder="เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                  value={instructorInput}
                  onChange={(e) => setInstructorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomInstructor(instructorInput);
                    }
                  }}
                /> */}
                <ComboboxChips ref={anchor} className="w-full"
                  >
                  <ComboboxValue 
                  >
                    {(values) => (
                      <Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value}>{value}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          placeholder={formInstructor.length === 0 ? "เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)" : ""}
                          value={instructorInput}
                          onChange={(e) => setInstructorInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomInstructor(instructorInput);
                            }
                          }}
                        />
                      </Fragment>
                    )}  
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  {
                    (instructorOptions.length === 0) && (
                      <ComboboxEmpty>
                        ยังไม่มีผู้สอนที่มีอยู่ในระบบ
                      </ComboboxEmpty>
                    )
                  }
                  {
                    instructorInput.trim() !== "" && !instructorOptions.some((o) => o.value === instructorInput.trim()) && (
                      <ComboboxItem
                        value={instructorInput.trim()}
                        onClick={() => handleAddCustomInstructor(instructorInput.trim())}
                      >
                        + เพิ่มผู้สอน "{instructorInput.trim()}"
                      </ComboboxItem>
                    )
                  }
                  
                  <ComboboxList>
                    { instructorOptions.filter((o) => o.value.toLowerCase().includes(instructorInput.toLowerCase())).map((o) => (
                      <ComboboxItem key={o.value} value={o.value}>
                        {o.label}
                      </ComboboxItem>
                    )) }
                    
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              
              
              }
            </div>
          </div>
          {/* เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน) */}
          <DialogFooter>
            <Button disabled={!formCourseCode || !formCourseTitle || isCourseCodeDuplicate || formInstructor.length === 0}
            onClick={handleAddCourse}
            >
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead>Action</TableHead>
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
                  <div className="flex flex-wrap gap-2">
                  {
                    instructorOptions
                    .filter((o) => c.instructors?.includes(o.value))
                    .map((o) => (
                      <DeletableInstructorBadge
                        key={o.value}
                        instructorName={o.value}
                        courseCode={c.courseCode}
                    />
                    ))
                  }
                  </div>
                </TableCell>
                <TableCell>
                  {/* <Button variant="destructive" size="sm"
                  onClick={() => handleRemoveCourse(c.courseCode)}
                  ><Trash2 className="h-4 w-4" />
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger
                       render={<Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>}
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ลบวิชา?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {`ลบ ${c.courseCode} - ${c.courseTitle} ออกจากรายวิชาที่เปิดสอน`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction variant="destructive"
                          onClick={() => handleRemoveCourse(c.courseCode)}
                        >
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
