
import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';


const USER = {
  username: 'admin',
  password: 'password123',
  role: 'admin',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

  
    if (username !== USER.username || password !== USER.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ sub: username, role: USER.role });

    const res = NextResponse.json({ message: 'Logged in' }, { status: 200 });

   
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, 
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
