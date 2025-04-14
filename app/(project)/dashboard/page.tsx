import { handleAuth } from '@/app/actions/handle-auth'
import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      {session.user?.email === 'test@test.com' && (
        <form action={handleAuth}>
          <button
            type="submit"
            className="border rounded-md px-2 py-1 hover:cursor-pointer"
          >
            Logout
          </button>
        </form>
      )}
    </div>
  )
}
