import { stripe } from '@/app/lib/stripe'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json()

  const price = process.env.STRIPE_PRODUCT_PRICE_ID

  if (!price) {
    return NextResponse.json({ error: 'Price ID not found' }, { status: 500 })
  }

  const metadata = {
    testId,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'boleto'],
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
      ...(userEmail && { customer_email: userEmail }),
      metadata,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Session URL not found' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
