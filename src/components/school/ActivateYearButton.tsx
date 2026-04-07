"use client";

import { useState } from "react";
import { setYearAsCurrent } from "@/app/actions/school-config";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ActivateYearButton({ id, isCurrent }: { id: number; isCurrent: boolean }) {
    const [loading, setLoading] = useState(false);

    if (isCurrent) {
        return (
            <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                ACTIVE
            </div>
        );
    }

    async function handleActivate() {
        setLoading(true);
        const result = await setYearAsCurrent(id);
        setLoading(false);

        if (result.error) toast.error(result.error);
        else toast.success("Academic year activated!");
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleActivate}
            disabled={loading}
            className="h-8 text-xs"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Set Active"}
        </Button>
    );
}