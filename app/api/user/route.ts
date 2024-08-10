import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const userData = await request.json();

        const response = await fetch('http://localhost:5000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        const user = await response.json();
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Unable to create user' }, { status: 500 });
    }
}