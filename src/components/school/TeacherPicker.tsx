"use client";

import { useState } from "react";
import { assignClassTeacher } from "@/app/actions/school-config";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface TeacherPickerProps {
    sectionId: number;
    currentTeacherId: string | null;
    teachers: { id: string; firstName: string; lastName: string }[];
}

export function TeacherPicker({ sectionId, currentTeacherId, teachers }: TeacherPickerProps) {
    const [loading, setLoading] = useState(false);

    async function handleChange(teacherId: string) {
        setLoading(true);
        // Use "null" string as a trigger to unassign
        const finalId = teacherId === "none" ? null : teacherId;
        const result = await assignClassTeacher(sectionId, finalId);
        setLoading(false);

        if ("error" in result) toast.error(result.error);
        else toast.success("Teacher updated!");
    }

    return (
        <div className="relative w-full">
            <select
                disabled={loading}
                defaultValue={currentTeacherId || "none"}
                onChange={(e) => handleChange(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm ring-offset-background transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
            >
                <option value="none" className="text-muted-foreground">No Teacher Assigned</option>
                {teachers.map((t) => (
                    <option key={t.id} value={t.id} className="text-foreground">
                        {t.firstName} {t.lastName}
                    </option>
                ))}
            </select>

            {/* Custom Chevron Icon since 'appearance-none' hides the default one */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    );


}