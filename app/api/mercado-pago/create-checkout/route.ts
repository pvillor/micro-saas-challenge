import { mpClient } from '@/app/lib/mercado-pago'
import { Preference } from 'mercadopago'
import { init } from 'next/dist/compiled/webpack/webpack'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json()

  try {
    const preference = new Preference(mpClient)

    const createdPreference = await preference.create({
      body: {
        external_reference: testId,
        metadata: {
          testId, // test_id
        },
        ...(userEmail && { payer: { email: userEmail } }),
        items: [
          {
            id: '',
            title: 'Test',
            description: 'Test',
            picture_url:
              'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif',
            quantity: 1,
            unit_price: 1,
            currency_id: 'BRL',
            category_id: 'services',
          },
        ],
        // payment_methods: {
        //   installments: 12,
        //   excluded_payment_methods: [
        //     {
        //       id: 'bolbradesco',
        //     },
        //     {
        //       id: 'pec',
        //     },
        //   ],
        //   excluded_payment_types: [
        //     {
        //       id: 'debit_card',
        //     },
        //     {
        //       id: 'credit_card',
        //     },
        //   ],
        // },
        auto_return: 'approved',
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercado-pago/pending`,
        },
      },
    })

    if (!createdPreference.id) {
      return NextResponse.json(
        {
          error: 'Error creating checkout with mercado pago',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        error: 'Error creating checkout with mercado pago',
      },
      { status: 500 }
    )
  }
}
