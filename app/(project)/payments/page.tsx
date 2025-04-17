'use client'

import { useMercadoPago } from '@/app/hooks/use-mercado-pago'
import { useStripe } from '@/app/hooks/use-stripe'

export default function Payments() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe()

  const { createMercadoPagoCheckout } = useMercadoPago()

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Payments</h1>

      <button
        type="button"
        className="border rounded-md px-1"
        onClick={() =>
          createPaymentStripeCheckout({
            testId: '123',
          })
        }
      >
        Criar Pagamento Stripe
      </button>

      <button
        type="button"
        className="border rounded-md px-1"
        onClick={() =>
          createSubscriptionStripeCheckout({
            testId: '123',
          })
        }
      >
        Criar Assinatura Stripe
      </button>

      <button
        type="button"
        className="border rounded-md px-1"
        onClick={handleCreateStripePortal}
      >
        Criar Portal de Pagamentos
      </button>

      <button
        type="button"
        className="border rounded-md px-1"
        onClick={() =>
          createMercadoPagoCheckout({
            testId: '123',
            userEmail: 'pvillor@gmail.com',
          })
        }
      >
        Criar Pagamento Mercado Pago
      </button>
    </div>
  )
}
