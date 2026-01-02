// Sample sanctions and watchlist data
// In production, this would be fetched from a real API like OpenSanctions

export const sanctionsSources = [
    { id: 'OFAC_SDN', name: 'OFAC SDN List', country: 'US', description: 'Office of Foreign Assets Control Specially Designated Nationals' },
    { id: 'EU_SANCTIONS', name: 'EU Consolidated List', country: 'EU', description: 'European Union Consolidated Financial Sanctions List' },
    { id: 'UN_CONSOLIDATED', name: 'UN Consolidated List', country: 'UN', description: 'United Nations Security Council Consolidated List' },
    { id: 'UK_SANCTIONS', name: 'UK Sanctions List', country: 'UK', description: 'UK Financial Sanctions Targets' },
];

export const sanctionedEntities = [
    // Sample OFAC SDN entries
    { id: 1, name: 'BANCO DELTA ASIA', type: 'ENTITY', country: 'MO', source: 'OFAC_SDN', programs: ['NPWMD'], addedDate: '2005-09-15' },
    { id: 2, name: 'KOREA KWANGSON BANKING CORP', type: 'ENTITY', country: 'KP', source: 'OFAC_SDN', programs: ['DPRK'], addedDate: '2013-08-30' },
    { id: 3, name: 'PETROPARS LTD', type: 'ENTITY', country: 'IR', source: 'OFAC_SDN', programs: ['IRAN'], addedDate: '2010-06-16' },
    { id: 4, name: 'RUSSIAN MILITARY CORP', type: 'ENTITY', country: 'RU', source: 'OFAC_SDN', programs: ['RUSSIA'], addedDate: '2022-02-25' },
    { id: 5, name: 'SBERBANK', type: 'ENTITY', country: 'RU', source: 'OFAC_SDN', programs: ['RUSSIA'], addedDate: '2022-02-24' },

    // Sample EU entries  
    { id: 6, name: 'SYRIAN MILITARY INDUSTRIES', type: 'ENTITY', country: 'SY', source: 'EU_SANCTIONS', programs: ['SYRIA'], addedDate: '2011-05-09' },
    { id: 7, name: 'BELARUS POTASH COMPANY', type: 'ENTITY', country: 'BY', source: 'EU_SANCTIONS', programs: ['BELARUS'], addedDate: '2021-06-24' },

    // Sample UN entries
    { id: 8, name: 'AL-QAIDA', type: 'ENTITY', country: null, source: 'UN_CONSOLIDATED', programs: ['TERRORISM'], addedDate: '2001-10-08' },
    { id: 9, name: 'TALIBAN', type: 'ENTITY', country: 'AF', source: 'UN_CONSOLIDATED', programs: ['TERRORISM'], addedDate: '2001-10-08' },

    // Individual names
    { id: 10, name: 'KIM JONG UN', type: 'INDIVIDUAL', country: 'KP', source: 'OFAC_SDN', programs: ['DPRK'], addedDate: '2016-07-06' },
    { id: 11, name: 'VLADIMIR PUTIN', type: 'INDIVIDUAL', country: 'RU', source: 'EU_SANCTIONS', programs: ['RUSSIA'], addedDate: '2022-02-25' },
    { id: 12, name: 'BASHAR AL-ASSAD', type: 'INDIVIDUAL', country: 'SY', source: 'EU_SANCTIONS', programs: ['SYRIA'], addedDate: '2011-05-09' },
];

export const restrictedCountries = [
    { code: 'KP', name: 'North Korea', level: 'FULL_EMBARGO', programs: ['DPRK'] },
    { code: 'IR', name: 'Iran', level: 'PARTIAL', programs: ['IRAN'] },
    { code: 'CU', name: 'Cuba', level: 'FULL_EMBARGO', programs: ['CUBA'] },
    { code: 'SY', name: 'Syria', level: 'FULL_EMBARGO', programs: ['SYRIA'] },
    { code: 'RU', name: 'Russia', level: 'PARTIAL', programs: ['RUSSIA'] },
    { code: 'BY', name: 'Belarus', level: 'PARTIAL', programs: ['BELARUS'] },
    { code: 'VE', name: 'Venezuela', level: 'PARTIAL', programs: ['VENEZUELA'] },
    { code: 'MM', name: 'Myanmar', level: 'PARTIAL', programs: ['BURMA'] },
];

// Fuzzy matching function for screening
export function screenParty(searchName) {
    const normalized = searchName.toUpperCase().trim();
    const results = [];

    sanctionedEntities.forEach(entity => {
        const entityName = entity.name.toUpperCase();

        // Exact match
        if (entityName === normalized) {
            results.push({ ...entity, matchType: 'EXACT', confidence: 100 });
            return;
        }

        // Contains match
        if (entityName.includes(normalized) || normalized.includes(entityName)) {
            results.push({ ...entity, matchType: 'PARTIAL', confidence: 75 });
            return;
        }

        // Word match
        const searchWords = normalized.split(/\s+/);
        const entityWords = entityName.split(/\s+/);
        const matchingWords = searchWords.filter(w => entityWords.includes(w));

        if (matchingWords.length > 0) {
            const confidence = Math.round((matchingWords.length / Math.max(searchWords.length, entityWords.length)) * 60);
            if (confidence >= 30) {
                results.push({ ...entity, matchType: 'FUZZY', confidence });
            }
        }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
}

export function checkCountryRestrictions(countryCode) {
    return restrictedCountries.find(c => c.code === countryCode);
}
