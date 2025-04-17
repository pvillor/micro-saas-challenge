import 'server-only'

import { db } from '@/app/lib/firebase'

import type Stripe from 'stripe'
import { resend } from '@/app/lib/resend'

export async function handleStripeSubscription(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === 'paid') {
    const metadata = event.data.object.metadata

    const userId = metadata?.userId
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email

    if (!userId || !userEmail) {
      console.error('No user ID found in metadata')
      return
    }

    await db.collection('users').doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: 'active',
    })

    const { data, error } = await resend.emails.send({
      from: 'Acme <pvillor@gmail.com>',
      to: userEmail,
      subject: 'Resend test',
      text: 'Payment succeeded!',
    })

    if (error) {
      console.error('Error sending email:', error)
    }

    console.log(data)
  }
}
