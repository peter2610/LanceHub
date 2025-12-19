import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Combine first and last name for full name
    const fullName = `${firstName} ${lastName}`;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // For demo purposes, just return success
    // In a real app, you would hash the password and save to database
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: Date.now().toString(),
          name: fullName,
          email,
          role: 'USER'
        }
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
