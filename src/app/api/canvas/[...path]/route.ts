import { NextRequest, NextResponse } from 'next/server';

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL || process.env.NEXT_PUBLIC_CANVAS_BASE_URL || '';
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN || process.env.NEXT_PUBLIC_CANVAS_API_TOKEN || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = '/' + path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${CANVAS_BASE_URL}/api/v1${endpoint}${searchParams ? `?${searchParams}` : ''}`;

  console.log('[Canvas Proxy] GET:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Canvas Proxy] Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('[Canvas Proxy] Response:', errorText);
      return NextResponse.json(
        { error: `Canvas API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Canvas Proxy] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Canvas API', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = '/' + path.join('/');
  const url = `${CANVAS_BASE_URL}/api/v1${endpoint}`;
  const body = await request.json();

  console.log('[Canvas Proxy] POST:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Canvas API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch from Canvas API', details: String(error) },
      { status: 500 }
    );
  }
}
