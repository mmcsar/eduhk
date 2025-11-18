import { NextResponse } from 'next/server';
import { gatewayFetch } from '@/lib/api/client';

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const data = await gatewayFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
