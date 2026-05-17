import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Protected routes: /portal, /setup
  const isProtectedRoute = url.pathname.startsWith('/portal') || url.pathname.startsWith('/setup')
  // Auth routes: /login, /register
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/register')

  if (isProtectedRoute && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    url.pathname = '/portal/stats'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
