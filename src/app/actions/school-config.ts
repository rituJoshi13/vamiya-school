// src/app/actions/school-config.ts
"use server";

import { db } from "@/db";
import { academicYears } from "@/db/schema";
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