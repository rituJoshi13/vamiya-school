import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // These environment variables must be in your .env.local
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}