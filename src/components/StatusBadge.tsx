import { getStatusColor, getStatusLabel } from '../shared/theme/cyberColors'

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = getStatusColor(status)
  const label = getStatusLabel(status)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: 600,
      color,
    }}>
      <span style={{
        width: 7, height: 7,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 5px ${color}`,
        flexShrink: 0,
        animation: status === 'Ativa' ? 'pulse 2s infinite' : 'none',
      }} />
      {label}
    </span>
  )
}
