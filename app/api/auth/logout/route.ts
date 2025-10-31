import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' }, { status: 200 });

  res.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  return res;
}
