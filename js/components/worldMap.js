// World Map Component - Handles world map visualization with country coloring
class WorldMapManager {
    constructor() {
        this.mapContainer = null;
        this.svgElement = null;
        this.countryElements = {}; // Maps country name to array of path elements
        this.countryData = {};
        this.isInitialized = false;
        
        // Color configuration
        this.colors = {
            background: worldMapData.colorScale.background,
            borders: worldMapData.colorScale.borders,
            minColor: worldMapData.colorScale.min,
            maxColor: worldMapData.colorScale.max
        };
        
        // Animation settings
        this.animationDuration = 300;
    }

    // Initialize world map
    initializeWorldMap() {
        try {
            this.mapContainer = document.getElementById('world-map-container');
            if (!this.mapContainer) {
                console.warn('World map container not found');
                return;
            }

            // Get country band data
            this.countryData = dataManager.getCountryBandStats();
            
            // Load and create SVG map
            this.loadSVGMap();
            
            this.isInitialized = true;
            console.log('World map initialized successfully');
            
        } catch (error) {
            console.error('Error initializing world map:', error);
            this.handleError(error);
        }
    }

    // Load SVG map from SimpleMaps
    loadSVGMap() {
        try {
            // Clear existing content
            this.mapContainer.innerHTML = '';
            
            // Try to load the original SVG file
            this.loadOriginalSVG();
            
        } catch (error) {
            console.error('Error loading SVG map:', error);
            this.handleError(error);
        }
    }

    // Load the original SVG file directly
    loadOriginalSVG() {
        // Create XMLHttpRequest to load SVG file
        const xhr = new XMLHttpRequest();
        xhr.open('GET', './assets/world.svg', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Successfully loaded SVG
                    this.processSVGContent(xhr.responseText);
                } else {
                    // Failed to load SVG file
                    console.error('Failed to load original SVG file');
                    this.handleError(new Error('Failed to load SVG file'));
                }
            }
        };
        xhr.send();
    }

    // Process the loaded SVG content
    processSVGContent(svgText) {
        try {
            // Parse the SVG text
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            
            if (!svgElement) {
                throw new Error('Invalid SVG content');
            }
            
            // Clone the SVG element for our use
            this.svgElement = svgElement.cloneNode(true);
            
            // Remove any fixed width/height attributes from the original SVG
            this.svgElement.removeAttribute('width');
            this.svgElement.removeAttribute('height');
            
            // Set up proper responsive scaling
            this.svgElement.setAttribute('width', '100%');
            this.svgElement.setAttribute('height', '100%');
            this.svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            
            // Ensure viewBox is set for proper scaling - use the original SVG's viewBox or create one
            let viewBox = this.svgElement.getAttribute('viewBox');
            if (!viewBox) {
                // Try to get original dimensions from the SVG
                const originalWidth = svgElement.getAttribute('width') || '2000';
                const originalHeight = svgElement.getAttribute('height') || '857';
                
                // Remove 'px' or other units if present
                const cleanWidth = originalWidth.toString().replace(/[^\d.]/g, '');
                const cleanHeight = originalHeight.toString().replace(/[^\d.]/g, '');
                
                viewBox = `0 0 ${cleanWidth} ${cleanHeight}`;
                this.svgElement.setAttribute('viewBox', viewBox);
            }
            
            this.svgElement.classList.add('world-map-svg');
            
            // Process all path elements (countries)
            const paths = this.svgElement.querySelectorAll('path');
            paths.forEach(path => {
                // Try to get country name from class attribute first, then id, then name
                let countryName = null;
                const classAttr = path.getAttribute('class');
                const idAttr = path.getAttribute('id');
                const nameAttr = path.getAttribute('name');
                
                if (classAttr) {
                    // Use class attribute as country name (e.g., "United States", "United Kingdom")
                    countryName = classAttr;
                } else if (nameAttr) {
                    // Use name attribute
                    countryName = nameAttr;
                } else if (idAttr) {
                    // Convert ISO code to country name
                    countryName = this.getCountryNameFromId(idAttr);
                }
                
                if (countryName) {
                    // Set default styling - force consistent border colors
                    path.classList.add('country-path');
                    path.setAttribute('data-country-id', idAttr || classAttr || countryName);
                    path.setAttribute('data-country', countryName);
                    
                    // Force consistent styling via CSS to override any existing SVG styles
                    path.style.fill = this.colors.minColor;
                    path.style.stroke = this.colors.borders;
                    path.style.strokeWidth = '0.5';
                    path.style.cursor = 'pointer';
                    path.style.transition = `fill ${this.animationDuration}ms ease`;
                    
                    // Store reference - support multiple paths per country
                    if (!this.countryElements[countryName]) {
                        this.countryElements[countryName] = [];
                    }
                    this.countryElements[countryName].push(path);
                    
                    // Add event listeners directly here
                    path.addEventListener('mouseenter', (e) => {
                        this.handleCountryHover(e, countryName, true);
                    });
                    
                    path.addEventListener('mouseleave', (e) => {
                        this.handleCountryHover(e, countryName, false);
                    });
                    
                    path.addEventListener('click', (e) => {
                        this.handleCountryClick(e, countryName);
                    });
                }
            });
            
            // Add the SVG to the container
            this.mapContainer.appendChild(this.svgElement);
            
            // Update colors based on data
            this.updateMapColors();
            
            this.isInitialized = true;
            console.log(`World map initialized successfully with ${Object.keys(this.countryElements).length} countries from original SVG`);
            
        } catch (error) {
            console.error('Error processing SVG content:', error);
            this.handleError(error);
        }
    }


    // Get country name from ISO code
    getCountryNameFromId(isoCode) {
        // Map ISO codes to country names used in our venue data
        const isoToCountryMap = {
            'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AO': 'Angola',
            'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia', 'AT': 'Austria',
            'AZ': 'Azerbaijan', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BY': 'Belarus',
            'BE': 'Belgium', 'BJ': 'Benin', 'BT': 'Bhutan', 'BO': 'Bolivia',
            'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana', 'BR': 'Brazil',
            'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi',
            'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada', 'CF': 'Central African Republic',
            'TD': 'Chad', 'CL': 'Chile', 'CN': 'China', 'CO': 'Colombia',
            'CG': 'Republic of Congo', 'CD': 'Democratic Republic of Congo', 'CR': 'Costa Rica',
            'CI': 'Ivory Coast', 'HR': 'Croatia', 'CU': 'Cuba', 'CY': 'Cyprus',
            'CZ': 'Czech Republic', 'DK': 'Denmark', 'DJ': 'Djibouti', 'DO': 'Dominican Republic',
            'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador', 'GQ': 'Equatorial Guinea',
            'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia', 'FI': 'Finland',
            'FR': 'France', 'GA': 'Gabon', 'GM': 'Gambia', 'GE': 'Georgia',
            'DE': 'Germany', 'GH': 'Ghana', 'GR': 'Greece', 'GL': 'Greenland',
            'GT': 'Guatemala', 'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana',
            'HT': 'Haiti', 'HN': 'Honduras', 'HU': 'Hungary', 'IS': 'Iceland',
            'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran', 'IQ': 'Iraq',
            'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica',
            'JP': 'Japan', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya',
            'KP': 'North Korea', 'KR': 'South Korea', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan',
            'LA': 'Laos', 'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho',
            'LR': 'Liberia', 'LY': 'Libya', 'LT': 'Lithuania', 'LU': 'Luxembourg',
            'MK': 'Macedonia', 'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia',
            'ML': 'Mali', 'MT': 'Malta', 'MR': 'Mauritania', 'MU': 'Mauritius',
            'MX': 'Mexico', 'MD': 'Moldova', 'MN': 'Mongolia', 'ME': 'Montenegro',
            'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia',
            'NP': 'Nepal', 'NL': 'Netherlands', 'NZ': 'New Zealand', 'NI': 'Nicaragua',
            'NE': 'Niger', 'NG': 'Nigeria', 'NO': 'Norway', 'OM': 'Oman',
            'PK': 'Pakistan', 'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay',
            'PE': 'Peru', 'PH': 'Philippines', 'PL': 'Poland', 'PT': 'Portugal',
            'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia', 'RW': 'Rwanda',
            'SA': 'Saudi Arabia', 'SN': 'Senegal', 'RS': 'Serbia', 'SL': 'Sierra Leone',
            'SK': 'Slovakia', 'SI': 'Slovenia', 'SO': 'Somalia', 'ZA': 'South Africa',
            'SS': 'South Sudan', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan',
            'SR': 'Suriname', 'SZ': 'Swaziland', 'SE': 'Sweden', 'CH': 'Switzerland',
            'SY': 'Syria', 'TW': 'Taiwan', 'TJ': 'Tajikistan', 'TZ': 'Tanzania',
            'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TN': 'Tunisia',
            'TR': 'Turkey', 'TM': 'Turkmenistan', 'UG': 'Uganda', 'UA': 'Ukraine',
            'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States',
            'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VE': 'Venezuela',
            'VN': 'Vietnam', 'EH': 'Western Sahara', 'YE': 'Yemen', 'ZM': 'Zambia',
            'ZW': 'Zimbabwe'
        };
        
        return isoToCountryMap[isoCode] || isoCode;
    }

    // Update map colors based on band data
    updateMapColors() {
        // Get country data
        this.countryData = dataManager.getCountryBandStats();
        
        if (!this.countryData || Object.keys(this.countryData).length === 0) {
            console.warn('No country data available for coloring');
            // Set all countries to default color (black)
            Object.values(this.countryElements).forEach(countryPaths => {
                if (Array.isArray(countryPaths)) {
                    countryPaths.forEach(path => {
                        path.style.fill = this.colors.minColor; // Use CSS style instead of attribute
                        path.setAttribute('data-band-count', '0');
                    });
                } else {
                    // Handle fallback case for single path
                    countryPaths.style.fill = this.colors.minColor; // Use CSS style instead of attribute
                    countryPaths.setAttribute('data-band-count', '0');
                }
            });
            return;
        }

        // Find max band count for scaling
        const maxBands = Math.max(...Object.values(this.countryData));
        console.log('Country data:', this.countryData);
        console.log('Max bands:', maxBands);
        
        // Update ALL countries - those with data get colored, others stay black
        Object.entries(this.countryElements).forEach(([countryName, countryPaths]) => {
            const bandCount = this.countryData[countryName] || 0;
            const color = this.interpolateColor(bandCount, maxBands);
            
            // Handle both array (multiple paths) and single path cases
            if (Array.isArray(countryPaths)) {
                // Update all paths for this country
                countryPaths.forEach(path => {
                    path.style.fill = color; // Use CSS style instead of attribute
                    path.setAttribute('data-band-count', bandCount.toString());
                });
            } else {
                // Handle fallback case for single path
                countryPaths.style.fill = color; // Use CSS style instead of attribute
                countryPaths.setAttribute('data-band-count', bandCount.toString());
            }
        });
        
        console.log(`Updated colors for ${Object.keys(this.countryElements).length} countries (${Object.keys(this.countryData).length} with data)`);
    }

    // Interpolate color between min and max based on band count using logarithmic scale
    interpolateColor(bandCount, maxBands) {
        if (maxBands === 0) return this.colors.minColor;
        
        // Handle zero bands - keep them black
        if (bandCount === 0) return this.colors.minColor;
        
        // Calculate logarithmic ratio
        // Use log(bandCount + 1) to handle bandCount = 1 properly
        // Use log(maxBands + 1) to ensure consistent scaling
        const logBandCount = Math.log(bandCount + 1);
        const logMaxBands = Math.log(maxBands + 1);
        const ratio = logBandCount / logMaxBands;
        
        // Convert hex colors to RGB
        const minRGB = this.hexToRgb(this.colors.minColor);
        const maxRGB = this.hexToRgb(this.colors.maxColor);
        
        // Interpolate each RGB component
        const r = Math.round(minRGB.r + (maxRGB.r - minRGB.r) * ratio);
        const g = Math.round(minRGB.g + (maxRGB.g - minRGB.g) * ratio);
        const b = Math.round(minRGB.b + (maxRGB.b - minRGB.b) * ratio);
        
        return this.rgbToHex(r, g, b);
    }

    // Convert hex color to RGB object
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    // Convert RGB values to hex color
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }


    // Handle country hover effects
    handleCountryHover(event, countryName, isEntering) {
        const bandCount = this.countryData[countryName] || 0;
        const countryPaths = this.countryElements[countryName] || [];
        
        if (isEntering) {
            // Highlight ALL paths for this country
            countryPaths.forEach(path => {
                path.style.strokeWidth = '2';
                path.style.stroke = this.colors.borders; // Ensure consistent border color
                path.style.filter = 'brightness(1.2)';
            });
            
            // Show tooltip
            this.showTooltip(event, countryName, bandCount);
        } else {
            // Remove highlight from ALL paths for this country
            countryPaths.forEach(path => {
                path.style.strokeWidth = '0.5';
                path.style.stroke = this.colors.borders; // Ensure consistent border color
                path.style.filter = 'none';
            });
            
            // Hide tooltip
            this.hideTooltip();
        }
    }

    // Handle country click events
    handleCountryClick(event, countryName) {
        const bandCount = this.countryData[countryName] || 0;
        
        console.log(`Clicked on ${countryName}: ${bandCount} bands`);
        
        // Future implementation: Show artist list for country
        // For now, just log the click
        if (bandCount > 0) {
            const artists = dataManager.getArtistsByCountry(countryName);
            console.log(`Artists from ${countryName}:`, artists);
        }
    }

    // Show tooltip with country information
    showTooltip(event, countryName, bandCount) {
        // Remove existing tooltip
        this.hideTooltip();
        
        // Get artists from this country
        const artists = dataManager.getArtistsByCountry(countryName);
        const artistNames = artists.map(artist => artist.name).sort();
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        
        let tooltipContent = `
            <div class="map-tooltip-title">${countryName}</div>
            <div class="map-tooltip-numbering">${bandCount} band${bandCount !== 1 ? 's' : ''}</div>
        `;
        
        // Add artist list if there are any
        if (artistNames.length > 0) {
            tooltipContent += `<div class="map-tooltip-list">`;
            artistNames.forEach(artistName => {
                tooltipContent += `<div class="map-tooltip-list-item">${artistName}</div>`;
            });
            tooltipContent += `</div>`;
        }
        
        tooltip.innerHTML = tooltipContent;
        
        // Position tooltip
        const rect = this.mapContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Adjust positioning based on content size
        const tooltipWidth = Math.max(200, Math.max(...artistNames.map(name => name.length * 8 + 20)));
        const tooltipHeight = 60 + (artistNames.length * 18);
        
        let left = x + 10;
        let top = y - 10;
        
        // Adjust if tooltip would go outside container
        if (left + tooltipWidth > rect.width) {
            left = x - tooltipWidth - 10;
        }
        if (top < 0) {
            top = y + 20;
        }
        if (top + tooltipHeight > rect.height) {
            top = y - tooltipHeight - 10;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        this.mapContainer.appendChild(tooltip);
    }

    // Hide tooltip
    hideTooltip() {
        const existingTooltip = this.mapContainer.querySelector('.map-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // Refresh map with updated data
    refresh() {
        if (!this.isInitialized) {
            this.initializeWorldMap();
            return;
        }
        
        try {
            // Update country data
            this.countryData = dataManager.getCountryBandStats();
            
            // Update colors
            this.updateMapColors();
            
            console.log('World map refreshed successfully');
            
        } catch (error) {
            console.error('Error refreshing world map:', error);
            this.handleError(error);
        }
    }

    // Handle errors
    handleError(error) {
        console.error('WorldMapManager error:', error);
        
        if (this.mapContainer) {
            this.mapContainer.innerHTML = `
                <div class="map-error">
                    <h3>Map Loading Error</h3>
                    <p>Unable to load the world map visualization.</p>
                    <button onclick="worldMapManager.initializeWorldMap()" class="retry-button">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    // Get current map status
    getStatus() {
        return {
            initialized: this.isInitialized,
            countriesLoaded: Object.keys(this.countryElements).length,
            totalPaths: Object.values(this.countryElements).reduce((sum, paths) => sum + paths.length, 0),
            dataAvailable: Object.keys(this.countryData).length > 0
        };
    }

    // Resize map (for responsive design)
    resize() {
        if (this.svgElement && this.mapContainer) {
            // SVG will automatically resize due to viewBox and 100% width/height
            console.log('World map resized');
        }
    }

    // Destroy map (cleanup)
    destroy() {
        if (this.mapContainer) {
            this.mapContainer.innerHTML = '';
        }
        
        this.countryElements = {};
        this.countryData = {};
        this.isInitialized = false;
        
        console.log('World map destroyed');
    }
}

// Create global instance
const worldMapManager = new WorldMapManager();