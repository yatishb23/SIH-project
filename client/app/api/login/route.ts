// client/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }

  // Optionally, remove password from response
  const { password: _, ...userData } = user;

  // Generate a simple token (for demo, use JWT in production)
  const tokenPayload = { userId: user.id, email: user.email, timestamp: Date.now() };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  // Set cookie for 30 days
  const response = NextResponse.json({ success: true, user: userData });
  response.cookies.set('student-dashboard-auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 2 * 24 * 60 * 60, // 2 days in seconds
  });
  return response;
}