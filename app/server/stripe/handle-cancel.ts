import { db } from '@/app/lib/firebase'
import { resend } from '@/app/lib/resend'
import 'server-only'

import type Stripe from 'stripe'

export async function handleStripeCancelSubscription(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  console.log('Subscription canceled.')

  const customerId = event.data.object.customer

  const userRef = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .get()

  if (userRef.empty) {
    console.error('User not found')
    return
  }

  const userId = userRef.docs[0].id
  const userEmail = userRef.docs[0].data().email

  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'inactive',
  })

  const { data, error } = await resend.emails.send({
    from: 'Acme <pvillor@gmail.com>',
    to: userEmail,
    subject: 'Resend test',
    text: 'Signature cancelled',
  })

  if (error) {
    console.error('Error sending email:', error)
  }

  console.log(data)
}
