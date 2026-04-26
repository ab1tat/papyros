import { getEnvColor } from '../shared/theme/cyberColors'

interface EnvBadgeProps {
  ambiente: string
}

export default function EnvBadge({ ambiente }: EnvBadgeProps) {
  const color = getEnvColor(ambiente)
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '1px',
      color,
      backgroundColor: `${color}18`,
      border: `1px solid ${color}35`,
    }}>
      {ambiente}
    </span>
  )
}
