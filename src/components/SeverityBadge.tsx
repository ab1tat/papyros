import { getSeverityColor, getSeverityLabel } from '../shared/theme/cyberColors'

interface SeverityBadgeProps {
  nivel: string
}

export default function SeverityBadge({ nivel }: SeverityBadgeProps) {
  const color = getSeverityColor(nivel)
  const label = getSeverityLabel(nivel)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}40`,
    }}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }} />
      {label}
    </span>
  )
}
