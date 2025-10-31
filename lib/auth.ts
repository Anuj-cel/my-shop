import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export type TokenPayload = {
  sub: string;        
  role?: string;
  iat?: number;
  exp?: number;
};

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}


export function getTokenPayloadFromRequest(req: NextRequest): TokenPayload | null {
  
  try {
    const cookie = req.cookies.get('token')?.value;
    if (cookie) {
      const p = verifyToken(cookie);
      if (p) return p;
    }
  } catch (e) {
    console.error('Error reading token from cookies', e);
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const p = verifyToken(token);
      if (p) return p;
    }
  } catch (e) {}

  return null;
}


