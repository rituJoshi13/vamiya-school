// src/app/actions/school-config.ts
"use server";

import { db } from "@/db";
import { academicYears, grades, sections } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, not } from "drizzle-orm";

export async function createAcademicYear(values: {
    label: string;
    startDate: Date;
    endDate: Date
}) {
    try {
        await db.insert(academicYears).values({
            label: values.label,
            startDate: values.startDate,
            endDate: values.endDate,
            isCurrent: false, // Default to false, can be toggled later
        });

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to create academic year:", error);
        return { error: "Failed to create academic year" };
    }
}
export async function setYearAsCurrent(id: number) {
    try {
        // 1. Set EVERY year to isCurrent = false
        await db.update(academicYears).set({ isCurrent: false });

        // 2. Set the selected year to isCurrent = true
        await db.update(academicYears)
            .set({ isCurrent: true })
            .where(eq(academicYears.id, id));

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update active year" };
    }
}

export async function createGradeWithSections(values: {
    level: string;
    name: string;
    sections: { name: string; roomNumber?: string }[]
}) {
    try {
        return await db.transaction(async (tx) => {
            // 1. Insert the Grade
            const [newGrade] = await tx.insert(grades).values({
                level: values.level,
                name: values.name,
            }).returning();

            // 2. Insert the Sections linked to that Grade
            if (values.sections.length > 0) {
                await tx.insert(sections).values(
                    values.sections.map(s => ({
                        name: s.name,
                        roomNumber: s.roomNumber,
                        gradeId: newGrade.id,
                    }))
                );
            }

            revalidatePath("/admin/settings");
            return { success: true };
        });
    } catch (error: any) {
        console.error(error);
        return { error: error.message || "Failed to create grade structure" };
    }
}
export async function deleteGrade(id: number) {
    try {
        await db.delete(grades).where(eq(grades.id, id));
        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to delete grade" };
    }
}

export async function updateGrade(id: number, values: { level: string; name: string }) {
    try {
        await db.update(grades)
            .set({ level: values.level, name: values.name })
            .where(eq(grades.id, id));

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update grade" };
    }
}
export async function assignClassTeacher(sectionId: number, teacherId: string | null) {
    try {
        await db.update(sections)
            .set({ classTeacherId: teacherId })
            .where(eq(sections.id, sectionId));

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to assign teacher" };
    }
}