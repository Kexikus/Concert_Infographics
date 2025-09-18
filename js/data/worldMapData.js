// World Map Data - Configuration for SimpleMaps SVG integration
const worldMapData = {
    // SimpleMaps SVG file path
    svgPath: 'assets/world.svg',

    // Color scale configuration
    // Color scale configuration - colors are resolved when accessed
    get colorScale() {
        return {
            min: COLORS.black,  // Black for 0 bands
            max: COLORS.red,  // Bright red for maximum bands
            background: COLORS.darkGrey,  // Dark grey background
            borders: COLORS.lightGrey      // Light grey borders
        };
    },

    // ISO code to country name mapping (for our venue data)
    isoToCountryMap: {
        'US': 'USA',
        'GB': 'UK', 
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        'CA': 'Canada',
        'MX': 'Mexico',
        'BR': 'Brazil',
        'AR': 'Argentina',
        'ES': 'Spain',
        'IT': 'Italy',
        'PL': 'Poland',
        'RU': 'Russia',
        'CN': 'China',
        'JP': 'Japan',
        'IN': 'India',
        'ZA': 'South Africa',
        'EG': 'Egypt',
        'NG': 'Nigeria',
        'IE': 'Ireland',
        'NL': 'Netherlands',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'CH': 'Switzerland',
        'AT': 'Austria',
        'BE': 'Belgium',
        'PT': 'Portugal',
        'GR': 'Greece',
        'TR': 'Turkey',
        'IL': 'Israel',
        'SA': 'Saudi Arabia',
        'AE': 'UAE',
        'KR': 'South Korea',
        'TH': 'Thailand',
        'MY': 'Malaysia',
        'SG': 'Singapore',
        'ID': 'Indonesia',
        'PH': 'Philippines',
        'VN': 'Vietnam',
        'NZ': 'New Zealand'
    },

    // Get country name from ISO code
    getCountryNameFromId(isoCode) {
        return this.isoToCountryMap[isoCode] || isoCode;
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = worldMapData;
}