import type { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const {
    id,
    status,
    date_created,
    date_approved,
    transaction_amount,
    currency_id,
    payer,
    external_reference,
    payment_method_id,
  } = paymentData

  const metadata = paymentData.metadata
  const userEmail = metadata?.user_email
  const testId = metadata?.test_id

  console.log(paymentData)
}
