import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { JWTPayload } from '@/types';
import { COOKIE_NAME } from '@/lib/constants';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as string & SignOptions['expiresIn'] };
  return jwt.sign(payload as object, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Extract authenticated user from JWT cookie.
 * Used by API routes because middleware header injection
 * does not work on Cloudflare Workers / OpenNext.
 */
export function getAuthUser(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
