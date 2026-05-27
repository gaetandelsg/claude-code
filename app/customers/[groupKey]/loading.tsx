import Skeleton from '@/components/ui/Skeleton'
import SectionShell from '@/components/ui/SectionShell'

export default function CustomerPageSkeleton() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="space-y-4">
        {['Overview', 'Primo Cockpit', 'MDM / EDR', 'SaaS', 'Orders'].map((title) => (
          <SectionShell key={title} title={title}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </SectionShell>
        ))}
      </div>
    </>
  )
}
