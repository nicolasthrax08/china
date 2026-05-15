import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SupplierDashboard() {
  const supabase = await createClient()

  // IMPORTANT: Use getUser() for server-side validation to prevent JWT spoofing.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* Dashboard content here */}
    </div>
  )
}
