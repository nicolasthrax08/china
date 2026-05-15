import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SupplierDashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Double-check safety (though middleware handles this)
  if (!session) redirect('/login');

  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      {/* Dashboard content here */}
    </div>
  );
}
