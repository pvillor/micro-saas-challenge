import { stripe } from '@/app/lib/stripe'
import { handleStripeCancelSubscription } from '@/app/server/stripe/handle-cancel'
import { handleStripePayment } from '@/app/server/stripe/handle-payment'
import { handleStripeSubscription } from '@/app/server/stripe/handle-subscription'
import { headers } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

const secret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()

  const signature = headersList.get('stripe-signature')

  if (!signature || !secret) {
    return NextResponse.json('No signature or secret provided', { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const metadata = event.data.object.metadata

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event)
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event)
        }

        break
      }
      case 'checkout.session.expired':
        break
      case 'checkout.session.async_payment_succeeded':
        break
      case 'checkout.session.async_payment_failed':
        break
      case 'customer.subscription.created':
        break
      case 'customer.subscription.deleted':
        await handleStripeCancelSubscription(event)

        break
      default:
        console.log(`Unhandled event type ${event.type}`)
        break
    }

    return NextResponse.json('Webhook received', { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
