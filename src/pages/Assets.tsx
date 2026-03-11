import React, { useEffect, useState } from 'react';
// [CTO] Usando 'type' no import para cumprir a regra verbatimModuleSyntax
import { assetService, type Asset } from '../services/assetService';

const Assets: React.FC = () => {
  // O restante do código permanece o mesmo...
  const [assets, setAssets] = useState<Asset[]>([
    { id: 1, name: "Firewall Corporate", type: "Network", status: "Critical", isActive: true },
    { id: 2, name: "Database PostgreSQL", type: "Database", status: "High", isActive: true },
    { id: 3, name: "Web Server Nginx", type: "Server", status: "Medium", isActive: false }
  ]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetService.getAll();
        if (data && data.length > 0) {
          setAssets(data);
        }
      } catch (err) {
        console.log("Mantendo dados Mock.");
      }
    };
    fetchAssets();
  }, []);

  return (
    <div style={{ backgroundColor: '#0B1120', minHeight: '100vh', padding: '24px', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Assets Management</h1>
        <button 
          onClick={() => alert('Abrir Modal de Cadastro')}
          style={{ backgroundColor: '#3B82F6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
          + New Asset
        </button>
      </header>

      <div style={{ backgroundColor: '#16213E', borderRadius: '12px', padding: '20px', border: '1px solid #1E293B' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#94A3B8', textAlign: 'left', borderBottom: '1px solid #1E293B' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th>NAME</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} style={{ borderBottom: '1px solid #1E293B' }}>
                <td style={{ padding: '16px', color: '#3B82F6' }}>#{asset.id}</td>
                <td style={{ fontWeight: '500' }}>{asset.name}</td>
                <td>
                  <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {asset.type}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: asset.status === 'Critical' ? '#F87171' : asset.status === 'High' ? '#FB923C' : '#10B981',
                    fontWeight: 'bold'
                  }}>
                    ● {asset.status || (asset.isActive ? 'Active' : 'Archived')}
                  </span>
                </td>
                <td>
                  <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assets;