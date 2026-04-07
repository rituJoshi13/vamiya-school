import { db } from "@/db";
import { grades, profiles } from "@/db/schema";
import { AddGradeForm } from "@/components/school/AddGradeForm";
import { GradeCardActions } from "@/components/school/GradeCardActions";
import { TeacherPicker } from "@/components/school/TeacherPicker";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GradesPage() {
    const gradesWithSections = await db.query.grades.findMany({
        with: { sections: true }
    });

    const allTeachers = await db.select({
        id: profiles.id,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
    }).from(profiles).where(eq(profiles.role, "teacher"));

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Grades & Sections</h1>
                <p className="text-sm text-muted-foreground">Define class levels and assign class teachers.</p>
            </div>

            <AddGradeForm />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradesWithSections.map((g) => (
                    <Card key={g.id} className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50/50 py-3 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-md font-bold">Level {g.level}: {g.name}</CardTitle>
                            <GradeCardActions grade={{ id: g.id, level: g.level, name: g.name }} />
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {g.sections.map(s => (
                                <div key={s.id} className="p-3 bg-slate-50 border rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold">Section {s.name}</span>
                                        <span className="text-xs text-slate-400">{s.roomNumber || "No Room"}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Class Teacher</p>
                                        <TeacherPicker
                                            sectionId={s.id}
                                            currentTeacherId={s.classTeacherId}
                                            teachers={allTeachers}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}