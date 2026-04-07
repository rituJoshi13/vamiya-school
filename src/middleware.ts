// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Create the initial response and set the custom header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-current-path", request.nextUrl.pathname);

    let supabaseResponse = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    // 2. Initialize Supabase
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request: { headers: requestHeaders },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // 4. Define Public Paths
    const isPublicPath =
        pathname === '/' ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/auth')

    // 5. Redirect Logic
    if (!user && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Return the response that includes both the Supabase cookies AND the x-current-path header
    return supabaseResponse
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}