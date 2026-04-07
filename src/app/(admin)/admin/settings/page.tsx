import { db } from "@/db";
import { academicYears, profiles } from "@/db/schema";
import { AddYearForm } from "@/components/school/AddYearForm";
import { desc } from "drizzle-orm";
import { ActivateYearButton } from "@/components/school/ActivateYearButton";
import { AddGradeForm } from "@/components/school/AddGradeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeCardActions } from "@/components/school/GradeCardActions";
import { TeacherPicker } from "@/components/school/TeacherPicker";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
    // Fetch years ordered by start date (newest first)
    const years = await db.select().from(academicYears).orderBy(desc(academicYears.startDate));
    // Fetch Grades with their sections
    const gradesWithSections = await db.query.grades.findMany({
        with: {
            sections: true
        }
    });
    const allTeachers = await db.select({
        id: profiles.id,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
    })
        .from(profiles)
        .where(eq(profiles.role, "teacher"));
    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your school's structural data.</p>
            </div>

            <div className="grid gap-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Academic Year Management</h2>
                    <AddYearForm />

                    <div className="rounded-md border bg-white">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50/50">
                                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Year Label</th>
                                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Start Date</th>
                                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">End Date</th>
                                    <th className="h-10 px-4 text-right font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {years.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No academic years added yet.
                                        </td>
                                    </tr>
                                ) : (
                                    years.map((year) => (
                                        <tr key={year.id} className="border-b last:border-0 hover:bg-slate-50/50">
                                            <td className="p-4 font-medium">{year.label}</td>
                                            <td className="p-4">{year.startDate?.toLocaleDateString()}</td>
                                            <td className="p-4">{year.endDate?.toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                {/* Replace the old status span with this button */}
                                                <ActivateYearButton id={year.id} isCurrent={year.isCurrent} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">Grades & Sections</h2>
                    <AddGradeForm />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gradesWithSections.map((g) => (
                            <Card key={g.id} className="overflow-hidden">
                                <CardHeader className="bg-slate-50/50 py-3 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-md font-bold text-slate-700">
                                        Level {g.level}: {g.name}
                                    </CardTitle>

                                    {/* ADD THE ACTIONS HERE */}
                                    <GradeCardActions grade={{ id: g.id, level: g.level, name: g.name }} />

                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {g.sections.map(s => (
                                            <div
                                                key={s.id}
                                                className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-700">Section {s.name}</span>
                                                        {s.roomNumber && (
                                                            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                                Room {s.roomNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* The Picker - Make it full width for better UI */}
                                                <div className="pt-1 border-t border-slate-200/60">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Class Teacher</p>
                                                    <TeacherPicker
                                                        sectionId={s.id}
                                                        currentTeacherId={s.classTeacherId}
                                                        teachers={allTeachers}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}