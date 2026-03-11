import React, { useEffect, useState, useMemo } from 'react';
import { vulnService } from '../services/vulnService';
import type { VulnResponseDTO } from '../shared/vulnTypes';
import { cyberColors } from '../shared/theme/cyberColors';

const Dashboard: React.FC = () => {
  const [vulns, setVulns] = useState<VulnResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await vulnService.listar();
        setVulns(data);
      } catch (error) {
        console.error("Erro ao carregar Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => ({
    critica: vulns.filter(v => v.nivel === "Critica").length,
    alta: vulns.filter(v => v.nivel === "Alta").length,
    media: vulns.filter(v => v.nivel === "Media").length,
    baixa: vulns.filter(v => v.nivel === "Baixa").length,
  }), [vulns]);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Iniciando protocolos de segurança... 🛡️</div>;

  return (
    <div style={{ backgroundColor: cyberColors.background, minHeight: '100vh', padding: '32px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          Security Overview
        </h1>
        <p style={{ color: cyberColors.text.secondary, marginTop: '8px' }}>
          Monitoramento em tempo real de ativos e vulnerabilidades.
        </p>
      </header>
      
      {/* Grid de Cards com efeito Glow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Critical', key: 'Critica', color: cyberColors.severity.critical, count: stats.critica, glow: cyberColors.effects.glowCritical },
          { label: 'High', key: 'Alta', color: cyberColors.severity.high, count: stats.alta, glow: cyberColors.effects.glowHigh },
          { label: 'Medium', key: 'Media', color: cyberColors.severity.medium, count: stats.media, glow: 'rgba(59, 130, 246, 0.15)' },
          { label: 'Low', key: 'Baixa', color: cyberColors.severity.low, count: stats.baixa, glow: 'rgba(16, 185, 129, 0.15)' },
        ].map(item => {
          const isActive = filterLevel === item.key;
          return (
            <div 
              key={item.key}
              onClick={() => setFilterLevel(isActive ? null : item.key)}
              style={{ 
                backgroundColor: cyberColors.card,
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${isActive ? item.color : cyberColors.border}`,
                boxShadow: isActive ? `0 0 20px ${item.glow}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                opacity: filterLevel && !isActive ? 0.5 : 1,
                transform: isActive ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: cyberColors.text.secondary, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {item.label}
                </span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
              </div>
              <h2 style={{ color: 'white', fontSize: '36px', margin: 0, fontWeight: 'bold' }}>
                {item.count}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Placeholder para a Tabela (Passo 2) */}
      <div style={{ backgroundColor: cyberColors.card, padding: '32px', borderRadius: '16px', border: `1px solid ${cyberColors.border}` }}>
         <h3 style={{ color: 'white', marginBottom: '20px' }}>Vulnerability Log</h3>
         <p style={{ color: cyberColors.text.secondary }}>Aguardando estilização da tabela...</p>
      </div>
    </div>
  );
};

export default Dashboard;