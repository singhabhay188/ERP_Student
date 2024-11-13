import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value

  //checking for teacher
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const userData = JSON.parse(user)
      if (userData.type !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  //checking for teacher
  if (request.nextUrl.pathname.startsWith('/teacher')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const userData = JSON.parse(user);
      if (userData.type !== 'teacher') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  //checking for student
  if (request.nextUrl.pathname.startsWith('/student')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const userData = JSON.parse(user);
      if (userData.type !== 'student') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next();
}