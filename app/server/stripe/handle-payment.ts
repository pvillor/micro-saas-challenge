import { db } from '@/app/lib/firebase'
import { resend } from '@/app/lib/resend'
import 'server-only'

import type Stripe from 'stripe'

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === 'paid') {
    console.log('Payment succeeded! Send an access e-mail to the customer.')

    const metadata = event.data.object.metadata
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email

    const userId = metadata?.userId

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
