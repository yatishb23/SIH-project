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

  // TODO: Set authentication cookie or token here if needed
  return NextResponse.json({ success: true, user: userData });
}