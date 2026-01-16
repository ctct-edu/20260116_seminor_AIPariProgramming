import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({ component: RootComponent })

function RootComponent() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <h1 className='text-xl font-bold text-gray-900'>App Template</h1>
        </div>
      </header>
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  )
}
