import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests to /login (Clerk's internal keyless detection)
export async function POST(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/sign-in';
  return NextResponse.redirect(url);
}

// Handle GET requests to /login
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/sign-in';
  return NextResponse.redirect(url);
}

