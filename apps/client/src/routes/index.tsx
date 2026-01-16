import { createFileRoute } from '@tanstack/react-router'
import { useMeQuery } from '../hooks'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const { data, isLoading, error } = useMeQuery()

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Hello World!</h2>
        <p className='text-gray-600'>Cloudflare Fullstack Template</p>
      </div>

      <div className='bg-white rounded-lg shadow p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>API Response</h3>
        {isLoading && <p className='text-gray-500'>Loading...</p>}
        {error && <p className='text-red-500'>Error: {error.message}</p>}
        {data && <pre className='bg-gray-100 p-4 rounded text-sm overflow-auto'>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  )
}
