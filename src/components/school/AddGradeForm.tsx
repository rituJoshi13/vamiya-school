"use client";

import { useState } from "react";
import { createGradeWithSections } from "@/app/actions/school-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AddGradeForm() {
    const [level, setLevel] = useState(""); // e.g. "10"
    const [name, setName] = useState("");   // e.g. "High School"
    const [sectionInputs, setSectionInputs] = useState([{ name: "", room: "" }]);
    const [loading, setLoading] = useState(false);

    const addSectionRow = () => setSectionInputs([...sectionInputs, { name: "", room: "" }]);

    const removeSectionRow = (index: number) => {
        if (sectionInputs.length > 1) {
            setSectionInputs(sectionInputs.filter((_, i) => i !== index));
        } else {
            toast.error("At least one section is required");
        }
    };
    async function handleSubmit() {
        // 1. Validation
        if (!level || !name || sectionInputs.some(s => !s.name)) {
            return toast.error("Please fill in Grade details and at least one Section name");
        }

        setLoading(true);

        try {
            const result = await createGradeWithSections({
                level,
                name,
                sections: sectionInputs.map(s => ({ name: s.name, roomNumber: s.room }))
            });

            // 2. Handling the Discriminated Union
            if ('error' in result && result.error) {
                toast.error(result.error);
            } else {
                toast.success("Grade and Sections created!");
                // 3. Resetting State
                setLevel("");
                setName("");
                setSectionInputs([{ name: "", room: "" }]);
            }
        } catch (err) {
            // 4. Fallback for unexpected network/server crashes
            toast.error("An unexpected error occurred");
        } finally {
            // 5. Always stop loading regardless of success or failure
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Grade Level (Numeric)</label>
                    <Input placeholder="10" value={level} onChange={(e) => setLevel(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Grade Name (Display)</label>
                    <Input placeholder="High School" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-500 uppercase">Initial Sections</label>
                    <Button type="button" variant="outline" size="sm" onClick={addSectionRow}>
                        <Plus className="h-4 w-4 mr-1" /> Add Section
                    </Button>
                </div>

                {sectionInputs.map((sec, index) => (
                    <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-top-1">
                        <Input
                            placeholder="Section (e.g. A)"
                            value={sec.name}
                            onChange={(e) => {
                                const newSecs = [...sectionInputs];
                                newSecs[index].name = e.target.value.toUpperCase();
                                setSectionInputs(newSecs);
                            }}
                        />
                        <Input
                            placeholder="Room No (Opt)"
                            value={sec.room}
                            onChange={(e) => {
                                const newSecs = [...sectionInputs];
                                newSecs[index].room = e.target.value;
                                setSectionInputs(newSecs);
                            }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeSectionRow(index)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Save Grade & Sections"}
            </Button>
        </div>
    );
}