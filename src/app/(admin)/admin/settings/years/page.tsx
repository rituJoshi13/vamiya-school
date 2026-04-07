import { db } from "@/db";
import { academicYears } from "@/db/schema";
import { AddYearForm } from "@/components/school/AddYearForm";
import { ActivateYearButton } from "@/components/school/ActivateYearButton";
import { desc } from "drizzle-orm";

export default async function YearsPage() {
    const years = await db.select().from(academicYears).orderBy(desc(academicYears.startDate));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Academic Years</h1>
                <p className="text-sm text-muted-foreground">Manage school sessions and the active year.</p>
            </div>
            <AddYearForm />
            <div className="rounded-md border bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b">
                            <th className="p-4 text-left">Year Label</th>
                            <th className="p-4 text-left">Duration</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years.map((year) => (
                            <tr key={year.id} className="border-b last:border-0">
                                <td className="p-4 font-medium">{year.label}</td>
                                <td className="p-4 text-slate-500">
                                    {year.startDate?.toLocaleDateString()} - {year.endDate?.toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <ActivateYearButton id={year.id} isCurrent={year.isCurrent} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}