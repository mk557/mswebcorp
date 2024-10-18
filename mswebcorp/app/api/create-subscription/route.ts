import { NextResponse } from 'next/server';
import { createSubscription } from '../../src/components/home/createSubscription';

export async function POST(request: Request) {
  try {
    const { paymentMethodId, formData, totalMonthly, totalOneTime } = await request.json();

    const result = await createSubscription(paymentMethodId, formData, totalMonthly, totalOneTime);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}