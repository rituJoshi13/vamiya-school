"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { redirect } from "next/navigation";
import { count } from "drizzle-orm";

export async function adminSignUp(values: any) {
    const supabase = await createClient();

    // 1. Security Check: Ensure this is the first user
    const [result] = await db.select({ value: count() }).from(profiles);
    if (result && result.value > 0) {
        return { error: "Admin already exists. Please use the login page." };
    }

    // 2. Register user in Supabase Auth with metadata
    const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
            data: {
                first_name: values.firstName,
                last_name: values.lastName,
                role: "admin",
            },
        },
    });

    if (authError || !data.user) {
        return { error: authError?.message || "Auth failed" };
    }

    // 3. Insert into Drizzle
    try {
        await db.insert(profiles).values({
            id: data.user.id,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            role: "admin",
        });
    } catch (dbError) {
        console.error("Drizzle Error:", dbError);
        // Optional: Delete the auth user if DB insert fails to allow retry
        // await supabase.auth.admin.deleteUser(data.user.id);
        return { error: "Database profile creation failed." };
    }

    // 4. Redirect OUTSIDE the try/catch block
    redirect("/admin/dashboard");
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: "Failed to log out" };
    }

    redirect("/login");
}