import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {

    if (!req.auth) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // get offset, limit if specified
    const { searchParams } = new URL(req.url);

    const offset = searchParams.get('offset') ?? '0';
    const limit = searchParams.get('limit') ?? '50';

    try {
        // Call the Django API to grab tasks
        const response = await fetch(`http://backend:8000/api/eth/block/?offset=${offset}&limit=${limit}`);

        // Handle non-2xx responses
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error finding chatlogs:', errorData);
            throw new Error(errorData.error || 'Failed to find blocks');
        }

        const data = await response.json();
        // Return the response from the Django API to the client
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error finding blocks:', error);
        return NextResponse.json({ error: 'Error finding blocks' }, { status: 500 });
    }
})
