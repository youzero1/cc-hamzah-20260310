import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || !result) {
      return NextResponse.json(
        { error: 'expression and result are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calc = repo.create({ expression, result });
    await repo.save(calc);

    return NextResponse.json(calc, { status: 201 });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
