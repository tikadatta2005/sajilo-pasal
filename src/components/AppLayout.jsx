import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { getAuth } from "@/lib/storage"

export default function AppLayout() {
  const auth = getAuth()
  if (!auth?.loggedIn) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
