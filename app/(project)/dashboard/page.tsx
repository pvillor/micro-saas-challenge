import { handleAuth } from '@/app/actions/handle-auth'
import { auth } from '@/app/lib/auth'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <p>{session.user?.email}</p>

      <form action={handleAuth}>
        <button
          type="submit"
          className="border rounded-md px-2 py-1 hover:cursor-pointer"
        >
          Logout
        </button>
      </form>

      <Link href="/payments">Pagamentos</Link>
    </div>
  )
}
