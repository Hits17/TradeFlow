// HS Code database with duty rates
// Structure: Chapter > Heading > Subheading

export const hsChapters = [
    { chapter: '01', title: 'Live Animals' },
    { chapter: '02', title: 'Meat and Edible Meat Offal' },
    { chapter: '03', title: 'Fish and Crustaceans' },
    { chapter: '08', title: 'Edible Fruit and Nuts' },
    { chapter: '09', title: 'Coffee, Tea, and Spices' },
    { chapter: '27', title: 'Mineral Fuels and Oils' },
    { chapter: '29', title: 'Organic Chemicals' },
    { chapter: '30', title: 'Pharmaceutical Products' },
    { chapter: '39', title: 'Plastics and Articles Thereof' },
    { chapter: '61', title: 'Apparel - Knitted or Crocheted' },
    { chapter: '62', title: 'Apparel - Not Knitted' },
    { chapter: '71', title: 'Precious Metals and Stones' },
    { chapter: '84', title: 'Machinery and Mechanical Appliances' },
    { chapter: '85', title: 'Electrical Machinery and Equipment' },
    { chapter: '87', title: 'Vehicles Other Than Railway' },
    { chapter: '90', title: 'Optical, Medical, and Precision Instruments' },
    { chapter: '94', title: 'Furniture, Bedding, Lamps' },
    { chapter: '95', title: 'Toys, Games, and Sports Equipment' },
];

export const hsCodes = [
    // Electronics
    { code: '8471.30.01', description: 'Laptop computers', chapter: '84', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
    { code: '8471.41.01', description: 'Desktop computers', chapter: '84', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
    { code: '8517.12.00', description: 'Smartphones', chapter: '85', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
    { code: '8528.72.64', description: 'LED/LCD televisions', chapter: '85', dutyUS: 5, dutyEU: 14, dutyChina: 0, unit: 'NO' },
    { code: '8523.51.00', description: 'Solid-state storage devices', chapter: '85', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },

    // Apparel
    { code: '6109.10.00', description: 'T-shirts, cotton, knitted', chapter: '61', dutyUS: 16.5, dutyEU: 12, dutyChina: 14, unit: 'DOZ' },
    { code: '6110.20.20', description: 'Sweaters, cotton', chapter: '61', dutyUS: 16.5, dutyEU: 12, dutyChina: 14, unit: 'DOZ' },
    { code: '6203.42.40', description: 'Men\'s trousers, cotton', chapter: '62', dutyUS: 16.6, dutyEU: 12, dutyChina: 16, unit: 'DOZ' },
    { code: '6204.62.40', description: 'Women\'s trousers, cotton', chapter: '62', dutyUS: 16.6, dutyEU: 12, dutyChina: 16, unit: 'DOZ' },

    // Food & Beverages
    { code: '0901.11.00', description: 'Coffee, not roasted, not decaffeinated', chapter: '09', dutyUS: 0, dutyEU: 0, dutyChina: 8, unit: 'KG' },
    { code: '0901.21.00', description: 'Coffee, roasted, not decaffeinated', chapter: '09', dutyUS: 0, dutyEU: 7.5, dutyChina: 15, unit: 'KG' },
    { code: '0902.10.00', description: 'Green tea', chapter: '09', dutyUS: 0, dutyEU: 0, dutyChina: 15, unit: 'KG' },
    { code: '0803.90.00', description: 'Bananas, fresh', chapter: '08', dutyUS: 0, dutyEU: 16, dutyChina: 10, unit: 'KG' },

    // Automotive
    { code: '8703.23.00', description: 'Motor vehicles, 1500-3000cc', chapter: '87', dutyUS: 2.5, dutyEU: 10, dutyChina: 25, unit: 'NO' },
    { code: '8703.80.00', description: 'Electric vehicles', chapter: '87', dutyUS: 2.5, dutyEU: 10, dutyChina: 15, unit: 'NO' },
    { code: '8708.29.50', description: 'Auto body parts', chapter: '87', dutyUS: 2.5, dutyEU: 4.5, dutyChina: 10, unit: 'KG' },

    // Machinery
    { code: '8429.51.00', description: 'Front-end shovel loaders', chapter: '84', dutyUS: 0, dutyEU: 0, dutyChina: 8, unit: 'NO' },
    { code: '8443.32.10', description: 'Printers', chapter: '84', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
    { code: '8479.89.98', description: 'Other machinery n.e.s.', chapter: '84', dutyUS: 2.5, dutyEU: 1.7, dutyChina: 10, unit: 'NO' },

    // Pharmaceuticals
    { code: '3004.90.92', description: 'Medicaments, packaged for retail', chapter: '30', dutyUS: 0, dutyEU: 0, dutyChina: 3, unit: 'KG' },
    { code: '3002.15.00', description: 'Immunological products', chapter: '30', dutyUS: 0, dutyEU: 0, dutyChina: 3, unit: 'KG' },

    // Plastics
    { code: '3901.10.10', description: 'Polyethylene, primary form', chapter: '39', dutyUS: 6.5, dutyEU: 6.5, dutyChina: 6.5, unit: 'KG' },
    { code: '3923.30.00', description: 'Plastic bottles', chapter: '39', dutyUS: 3, dutyEU: 6.5, dutyChina: 10, unit: 'KG' },

    // Furniture
    { code: '9401.61.60', description: 'Upholstered wooden seats', chapter: '94', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
    { code: '9403.60.80', description: 'Other wooden furniture', chapter: '94', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },

    // Toys
    { code: '9503.00.00', description: 'Toys, general', chapter: '95', dutyUS: 0, dutyEU: 4.7, dutyChina: 0, unit: 'NO' },
    { code: '9504.50.00', description: 'Video game consoles', chapter: '95', dutyUS: 0, dutyEU: 0, dutyChina: 0, unit: 'NO' },
];

export function searchHSCodes(query) {
    const normalized = query.toLowerCase();
    return hsCodes.filter(hs =>
        hs.code.includes(normalized) ||
        hs.description.toLowerCase().includes(normalized)
    );
}

export function getHSCode(code) {
    return hsCodes.find(hs => hs.code === code);
}

export function calculateDuty(hsCode, value, destinationCountry) {
    const hs = getHSCode(hsCode);
    if (!hs) return null;

    let rate = 0;
    switch (destinationCountry) {
        case 'US': rate = hs.dutyUS; break;
        case 'EU': rate = hs.dutyEU; break;
        case 'CN': rate = hs.dutyChina; break;
        default: rate = hs.dutyUS;
    }

    return {
        hsCode,
        description: hs.description,
        rate,
        dutyAmount: (value * rate) / 100,
        totalWithDuty: value + (value * rate) / 100
    };
}
