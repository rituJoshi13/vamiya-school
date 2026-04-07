"use client";

import { useState } from "react";
import { updateGrade } from "@/app/actions/school-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

interface EditGradeProps {
    grade: {
        id: number;
        level: string;
        name: string;
    };
}

export function EditGradeDialog({ grade }: EditGradeProps) {
    const [level, setLevel] = useState(grade.level);
    const [name, setName] = useState(grade.name);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        if (!level || !name) return toast.error("Fields cannot be empty");

        setLoading(true);
        const result = await updateGrade(grade.id, { level, name });
        setLoading(false);

        if ("error" in result) {
            toast.error(result.error);
        } else {
            toast.success("Grade updated successfully");
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit2 className="h-4 w-4 text-slate-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Grade Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Grade Level</label>
                        <Input value={level} onChange={(e) => setLevel(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Grade Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}