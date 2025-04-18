import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Link Start',
  description: 'Link Start',
}

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Link Start</h1>
      <Link href="/login">
        <button type="button">Login</button>
      </Link>
    </div>
  )
}
