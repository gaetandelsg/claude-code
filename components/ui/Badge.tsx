type Variant = 'green' | 'gray' | 'blue' | 'red'

const variants: Record<Variant, string> = {
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-700',
}

export default function Badge({
  label,
  variant = 'gray',
}: {
  label: string
  variant?: Variant
}) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}
