import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { AddYearForm } from "@/components/school/AddYearForm";
import { desc } from "drizzle-orm";
import { ActivateYearButton } from "@/components/school/ActivateYearButton";

export default async function SettingsPage() {
    // Fetch years ordered by start date (newest first)
    const years = await db.select().from(academicYears).orderBy(desc(academicYears.startDate));

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
            </div>
        </div>
    );
}