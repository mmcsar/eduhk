import { NextResponse } from 'next/server';
import { gatewayFetch } from '@/lib/api/client';

export async function GET() {
  try {
    const missions = await gatewayFetch('/missions');
    return NextResponse.json(missions);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
