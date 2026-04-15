import { NextResponse } from 'next/server';
import data from '@/data.json';

export async function GET() {
  try {
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load jobs data' }, { status: 500 });
  }
}
