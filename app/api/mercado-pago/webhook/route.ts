import { mpClient } from '@/app/lib/mercado-pago'
import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment'
import { Payment } from 'mercadopago'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, type } = body

    switch (type) {
      case 'payment': {
        const payment = new Payment(mpClient)
        const paymentData = await payment.get({
          id: data.id,
        })

        if (
          paymentData.status === 'approved' ||
          paymentData.date_approved !== null
        ) {
          await handleMercadoPagoPayment(paymentData)
        }

        break
      }
      case 'subscription_preapproval': {
        break
      }
      default: {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {}
}
