import { useEffect, useState } from 'react'
import { loadStripe, type Stripe } from '@stripe/stripe-js'

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>()

  useEffect(() => {
    async function getStripeInstance() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY ?? ''
      )

      setStripe(stripeInstance)
    }

    getStripeInstance()
  }, [])

  async function createPaymentStripeCheckout(checkoutData: unknown) {
    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    try {
      const response = await fetch('/api/stripe/create-pay-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error)
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: unknown) {
    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })
      console.log(response)
      const data = await response.json()

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error)
    }
  }

  async function handleCreateStripePortal() {
    const response = await fetch('/api/stripe/create-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    window.location.href = data.url
  }

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  }
}
