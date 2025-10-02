// src\app\dashboard\page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Get additional user data if needed
  const stats = {
    savedComparisons: 0,
    recentActivity: []
  }

  return <DashboardClient user={session.user} stats={stats} />
}