import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { JWTPayload } from '@/types';
import { COOKIE_NAMES } from '@/lib/constants';

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
 * Tries all role-specific cookies and collects every valid payload,
 * then picks the best one based on the API path context.
 * Used by API routes because middleware header injection
 * does not work on Cloudflare Workers / OpenNext.
 */
export function getAuthUser(req: NextRequest): JWTPayload | null {
  // Collect all valid payloads from all role cookies
  const validPayloads: JWTPayload[] = [];
  for (const name of Object.values(COOKIE_NAMES)) {
    const token = req.cookies.get(name)?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) validPayloads.push(payload);
    }
  }

  if (validPayloads.length === 0) return null;
  if (validPayloads.length === 1) return validPayloads[0];

  // Multiple valid cookies exist — pick the one most relevant to the API path
  // Use both nextUrl.pathname and raw URL for Cloudflare Workers compatibility
  const path = req.nextUrl.pathname || new URL(req.url).pathname;
  let preferredRole: string | null = null;

  if (path.includes('/api/admin')) preferredRole = 'admin';
  else if (path.includes('/api/cr')) preferredRole = 'cr';
  else if (path.includes('/attendance') || path.includes('/schedule') || path.includes('/results/semester') || path.includes('/tutorials')) preferredRole = 'teacher';

  if (preferredRole) {
    const match = validPayloads.find((p) => p.role === preferredRole);
    if (match) return match;
  }

  // Fallback: prioritise admin > teacher > cr > student
  const priority = ['admin', 'teacher', 'cr', 'student'];
  for (const role of priority) {
    const match = validPayloads.find((p) => p.role === role);
    if (match) return match;
  }

  return validPayloads[0];
}
