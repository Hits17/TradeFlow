// Mock clients data

export const mockClients = [
    {
        id: 'CLI-001',
        name: 'Global Tech Industries',
        type: 'IMPORTER',
        country: 'US',
        city: 'Los Angeles, CA',
        email: 'trade@globaltech.com',
        phone: '+1 310-555-0100',
        taxId: '12-3456789',
        status: 'ACTIVE',
        riskLevel: 'LOW',
        totalOrders: 45,
        totalValue: 2450000,
        createdAt: '2024-01-15'
    },
    {
        id: 'CLI-002',
        name: 'Shanghai Electronics Co.',
        type: 'EXPORTER',
        country: 'CN',
        city: 'Shanghai',
        email: 'export@shanghaielectronics.cn',
        phone: '+86 21-5555-0200',
        taxId: 'CN91310000',
        status: 'ACTIVE',
        riskLevel: 'MEDIUM',
        totalOrders: 78,
        totalValue: 5680000,
        createdAt: '2023-08-20'
    },
    {
        id: 'CLI-003',
        name: 'European Auto Parts GmbH',
        type: 'IMPORTER',
        country: 'DE',
        city: 'Munich',
        email: 'import@euautoparts.de',
        phone: '+49 89-555-0300',
        taxId: 'DE123456789',
        status: 'ACTIVE',
        riskLevel: 'LOW',
        totalOrders: 32,
        totalValue: 1890000,
        createdAt: '2024-03-10'
    },
    {
        id: 'CLI-004',
        name: 'Mumbai Textiles Ltd',
        type: 'EXPORTER',
        country: 'IN',
        city: 'Mumbai',
        email: 'exports@mumbaitextiles.in',
        phone: '+91 22-5555-0400',
        taxId: 'AAACM1234A',
        status: 'ACTIVE',
        riskLevel: 'LOW',
        totalOrders: 56,
        totalValue: 890000,
        createdAt: '2023-11-05'
    },
    {
        id: 'CLI-005',
        name: 'Pacific Imports Ltd',
        type: 'IMPORTER',
        country: 'AU',
        city: 'Sydney',
        email: 'info@pacificimports.com.au',
        phone: '+61 2-5555-0500',
        taxId: 'ABN12345678901',
        status: 'INACTIVE',
        riskLevel: 'LOW',
        totalOrders: 12,
        totalValue: 340000,
        createdAt: '2024-06-01'
    },
    {
        id: 'CLI-006',
        name: 'Brazil Coffee Exports',
        type: 'EXPORTER',
        country: 'BR',
        city: 'São Paulo',
        email: 'vendas@brazilcoffee.com.br',
        phone: '+55 11-5555-0600',
        taxId: '12.345.678/0001-90',
        status: 'ACTIVE',
        riskLevel: 'LOW',
        totalOrders: 89,
        totalValue: 1250000,
        createdAt: '2023-05-15'
    }
];

export function getClientById(id) {
    return mockClients.find(c => c.id === id);
}

export function getClientsByType(type) {
    return mockClients.filter(c => c.type === type);
}
