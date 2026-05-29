type Variant = 'green' | 'gray' | 'blue' | 'red'

const variants: Record<Variant, string> = {
  green: 'bg-[#E6FAF9] text-[#0EC8CC]',
  gray:  'bg-gray-100 text-gray-500',
  blue:  'bg-[#E6FAF9] text-[#0EC8CC]',
  red:   'bg-red-50 text-red-600',
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
