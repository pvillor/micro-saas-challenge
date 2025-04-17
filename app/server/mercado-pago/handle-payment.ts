import { resend } from '@/app/lib/resend'
import type { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata
  const userEmail = metadata?.user_email
  const testId = metadata?.test_id

  console.log('Payment succeeded!', { userEmail, testId, paymentData })

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
