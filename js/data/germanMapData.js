// German Map Data - Basic configuration for German map visualization
const germanMapData = {
    // German SVG file path
    svgPath: 'assets/de.svg',

    // Color configuration - simplified with black fill and light gray borders
    colorScale: {
        fill: '#000000',        // Black fill for all states
        borders: '#cccccc'      // Light gray borders
    },

    // German state names (16 federal states)
    germanStates: [
        'Baden-Württemberg',
        'Bayern',
        'Berlin',
        'Brandenburg',
        'Bremen',
        'Hamburg',
        'Hessen',
        'Mecklenburg-Vorpommern',
        'Niedersachsen',
        'Nordrhein-Westfalen',
        'Rheinland-Pfalz',
        'Saarland',
        'Sachsen',
        'Sachsen-Anhalt',
        'Schleswig-Holstein',
        'Thüringen'
    ],

    // State code to state name mapping
    stateCodeMap: {
        'BW': 'Baden-Württemberg',
        'BY': 'Bayern',
        'BE': 'Berlin',
        'BB': 'Brandenburg',
        'HB': 'Bremen',
        'HH': 'Hamburg',
        'HE': 'Hessen',
        'MV': 'Mecklenburg-Vorpommern',
        'NI': 'Niedersachsen',
        'NW': 'Nordrhein-Westfalen',
        'RP': 'Rheinland-Pfalz',
        'SL': 'Saarland',
        'SN': 'Sachsen',
        'ST': 'Sachsen-Anhalt',
        'SH': 'Schleswig-Holstein',
        'TH': 'Thüringen'
    },

    // Get state name from code
    getStateNameFromCode(stateCode) {
        return this.stateCodeMap[stateCode] || stateCode;
    },

    // Get all German state names
    getAllStates() {
        return this.germanStates;
    },

    // Check if state is valid German state
    isValidState(stateName) {
        return this.germanStates.includes(stateName);
    }
};

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = germanMapData;
}