import Badge from './Badge'

export default function YesNo({ value }: { value: boolean }) {
  return <Badge label={value ? 'Yes' : 'No'} variant={value ? 'green' : 'red'} />
}
