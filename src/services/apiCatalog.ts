export const apiCatalog = {
  assets: {
    listar:        { method: 'GET',    path: '/api/assets' },
    buscarPorId:   { method: 'GET',    path: '/api/assets/{id}' },
    criar:         { method: 'POST',   path: '/api/assets' },
    editar:        { method: 'PUT',    path: '/api/assets/{id}' },
    arquivar:      { method: 'PATCH',  path: '/api/assets/{id}/archive' },
    restaurar:     { method: 'PATCH',  path: '/api/assets/{id}/restore' },
    adicionarVuln: { method: 'POST',   path: '/api/assets/{id}/vulnerabilities/{vulnId}' },
    removerVuln:   { method: 'DELETE', path: '/api/assets/{id}/vulnerabilities/{vulnId}' },
  },
  vulns: {
    listar:      { method: 'GET',   path: '/api/vulns' },
    buscarPorId: { method: 'GET',   path: '/api/vulns/{id}' },
    criar:       { method: 'POST',  path: '/api/vulns' },
    editar:      { method: 'PUT',   path: '/api/vulns/{id}' },
    arquivar:    { method: 'PATCH', path: '/api/vulns/{id}/archive' },
    restaurar:   { method: 'PATCH', path: '/api/vulns/{id}/restore' },
  },
}
