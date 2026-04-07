"use client";

import { useState } from "react";
import { createAcademicYear } from "@/app/actions/school-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AddYearForm() {
    const [label, setLabel] = useState("");
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isPending, setIsPending] = useState(false);

    async function handleAdd() {
        if (!label || !startDate || !endDate) {
            return toast.error("Please fill in all fields (Label, Start Date, and End Date)");
        }

        setIsPending(true);
        const result = await createAcademicYear({ label, startDate, endDate });
        setIsPending(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Academic Year created successfully!");
            setLabel("");
            setStartDate(undefined);
            setEndDate(undefined);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Create New Academic Year</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Year Label</label>
                    <Input
                        placeholder="e.g. 2025-26"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                </div>
            </div>

            <Button
                onClick={handleAdd}
                disabled={isPending}
                className="w-full md:w-auto"
            >
                {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                    "Add Academic Year"
                )}
            </Button>
        </div>
    );
}

// Internal Helper for DatePicker using latest Shadcn patterns
function DatePicker({ date, setDate }: { date: Date | undefined; setDate: (d: Date | undefined) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}