"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db"; // Your drizzle connection
import { profiles } from "@/db/schema";
import { redirect } from "next/navigation";

export async function adminSignUp(values: any) {
    const supabase = createClient();

    // 1. Register user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
    });

    if (authError || !data.user) {
        return { error: authError?.message || "Auth failed" };
    }

    // 2. Insert into Drizzle 'profiles' table
    try {
        await db.insert(profiles).values({
            id: data.user.id, // Linking the UUID
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            role: "admin",
        });
    } catch (dbError) {
        console.error(dbError);
        return { error: "Database profile creation failed." };
    }

    return redirect("/admin/dashboard");
}