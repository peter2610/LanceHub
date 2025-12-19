import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Registration API received:', body); // Debug log
    
    const { firstName, lastName, email, password } = body;

    // Combine first and last name for full name
    const fullName = `${firstName} ${lastName}`;
    console.log('Processing registration for:', fullName, email); // Debug log

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log('Validation failed: missing fields'); // Debug log
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email'); // Debug log
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      console.log('Validation failed: password too short'); // Debug log
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('Registration validation passed, saving user'); // Debug log
    
    // Save the registered user to localStorage (in a real app, this would be a database)
    // Note: This is a client-side simulation - in production, you'd save to a database
    const newUser = {
      id: Date.now().toString(),
      name: fullName,
      email,
      password, // In production, this would be hashed
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    
    // For demo purposes, we'll return success and let the client handle storage
    // In a real app, you'd save to database and return user data without password
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        // Include user data for client-side storage in this demo
        userData: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration API error:', error); // Debug log
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
