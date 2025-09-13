
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    // Map frontend role to valid Prisma enum value
    let prismaRole: 'USER' | 'ADMIN' | 'MANAGER' = 'USER';
    if (role === 'admin') prismaRole = 'ADMIN';
    if (role === 'manager') prismaRole = 'MANAGER';
    // All other roles (teacher, counselor, etc) default to USER

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: prismaRole },
    });

    const { password: _, ...userData } = user;

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
