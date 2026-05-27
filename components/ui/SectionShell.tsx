export default function SectionShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border border-gray-200 rounded-xl p-6 space-y-3">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  )
}
