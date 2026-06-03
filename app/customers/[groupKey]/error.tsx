'use client'

export default function CustomerPageError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="py-16 text-center">
      <p className="text-gray-500 mb-4">Failed to load customer data.</p>
      <p className="text-xs text-gray-300 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="text-sm text-blue-600 underline hover:text-blue-800"
      >
        Try again
      </button>
    </div>
  )
}
