"use client";

import { useState } from "react";
import { deleteGrade } from "@/app/actions/school-config";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { EditGradeDialog } from "./EditGradeDialog";

export function GradeCardActions({ grade }: { grade: { id: number; level: string; name: string } }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteGrade(grade.id);
        setIsDeleting(false);

        if ("error" in result) {
            toast.error(result.error);
        } else {
            toast.success("Grade and all its sections deleted.");
        }
    }

    return (
        <div className="flex gap-2">
            {/* Edit Button (For now just a placeholder for the Edit Modal) */}
            <EditGradeDialog grade={grade} />
            {/* Delete Confirmation */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this grade and **all associated sections**.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}