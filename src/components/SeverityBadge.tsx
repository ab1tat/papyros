import React from 'react';
import { cyberColors } from '../shared/theme/cyberColors';

interface SeverityBadgeProps {
  level: string;
}

export default function SeverityBadge({ level }: SeverityBadgeProps) {
  // [CTO] Mapeamento de cores baseado no nosso Design System
  const config: Record<string, { color: string; label: string }> = {
    Critica: { color: cyberColors.severity.critical, label: 'CRITICAL' },
    Alta: { color: cyberColors.severity.high, label: 'HIGH' },
    Media: { color: cyberColors.severity.medium, label: 'MEDIUM' },
    Baixa: { color: cyberColors.severity.low, label: 'LOW' },
  };

  const current = config[level] || { color: cyberColors.text.secondary, label: level.toUpperCase() };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 'bold',
      color: current.color,
      backgroundColor: `${current.color}15`, // Cor com 15% de opacidade
      border: `1px solid ${current.color}33`, // Cor com 33% de opacidade
      boxShadow: `0 0 10px ${current.color}15`,
      letterSpacing: '0.5px'
    }}>
      <span style={{ 
        width: '6px', 
        height: '6px', 
        borderRadius: '50%', 
        backgroundColor: current.color, 
        marginRight: '8px',
        boxShadow: `0 0 6px ${current.color}`
      }} />
      {current.label}
    </span>
  );
}