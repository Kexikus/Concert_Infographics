// German Map Component - Enhanced with concert data visualization
class GermanMapManager {
    constructor() {
        this.mapContainer = null;
        this.svgElement = null;
        this.stateElements = {}; // Maps state name to array of path elements
        this.isInitialized = false;
        this.concertData = [];
        this.venueData = [];
        this.cityStats = new Map(); // Maps city name to concert count and coordinates
        this.visualElements = {
            cityDots: [],
            countCircles: [],
            connectingLines: [],
            tooltips: []
        };
        
        // Initialize the new repellant forces label placer
        this.labelPlacer = new D3RepellantForcesLabelPlacer({
            offsetDistance: 25,
            minDistance: 25, // Reduced by 50% from 25 to allow labels closer together
            simulationIterations: 50, // Reduced for faster calculation
            convergenceThreshold: 0.2, // Slightly higher for faster convergence
            attractionStrength: 0.25, // Increased to keep labels closer to cities
            repulsionStrength: -20, // Reduced to allow closer placement
            biasStrength: 0.15,
            boundaryStrength: 0.5,
            collisionBuffer: 8, // Reduced buffer for closer placement
            debug: false,
            showMetrics: false // Enable to see performance metrics
        });
        
        // Color configuration - colors are resolved when accessed
        this._colors = null;
        
        // Visual configuration
        this.config = {
            cityDotRadius: 4,
            countCircleRadius: 12, // Fixed radius of 12px for all labels
            lineStrokeWidth: 3,
            minDistance: 50, // Minimum distance between count circles
            offsetDistance: 40 // Distance from city dot to count circle
        };
    }

    // Getter for colors - resolves COLORS when first accessed
    get colors() {
        if (!this._colors) {
            this._colors = {
                fill: COLORS.black,        // Black fill for all states
                borders: COLORS.lightGrey,     // Light gray borders
                cityDot: COLORS.red,     // Bright red for city dots
                countCircle: COLORS.darkRed, // Dark red for count circles
                connectingLine: COLORS.darkRed, // Dark red for connecting lines
                countText: COLORS.white    // White text for count numbers
            };
        }
        return this._colors;
    }

    // Initialize German map with concert data
    initializeGermanMap() {
        try {
            this.mapContainer = document.getElementById('german-map-container');
            if (!this.mapContainer) {
                console.warn('German map container not found');
                return;
            }

            // Load concert and venue data
            this.loadConcertData();
            
            // Load and create SVG map
            this.loadSVGMap();
            
            console.log('German map initialized successfully');
            
        } catch (error) {
            console.error('Error initializing German map:', error);
            this.handleError(error);
        }
    }

    // Load and process concert data
    loadConcertData() {
        try {
            // Load data from global variables
            this.concertData = typeof concertsData !== 'undefined' ? concertsData : [];
            this.venueData = typeof venuesData !== 'undefined' ? venuesData : [];
            
            // Process city statistics
            this.processCityStatistics();
            
            console.log(`Loaded ${this.concertData.length} concerts and ${this.venueData.length} venues`);
            console.log(`Processed ${this.cityStats.size} cities with concerts`);
            
        } catch (error) {
            console.error('Error loading concert data:', error);
            this.concertData = [];
            this.venueData = [];
        }
    }

    // Process concert data to calculate city statistics
    processCityStatistics() {
        this.cityStats.clear();
        
        // Create venue lookup map
        const venueMap = new Map();
        this.venueData.forEach(venue => {
            venueMap.set(venue.id, venue);
        });
        
        // Count concerts per city
        this.concertData.forEach(concert => {
            const venue = venueMap.get(concert.venueId);
            if (venue && venue.city) {
                const city = venue.city;
                
                if (!this.cityStats.has(city)) {
                    this.cityStats.set(city, {
                        count: 0,
                        latitude: venue.latitude,
                        longitude: venue.longitude,
                        venues: new Set(),
                        venueVisits: new Map() // Track visits per venue
                    });
                }
                
                const cityData = this.cityStats.get(city);
                cityData.count++;
                cityData.venues.add(venue.name);
                
                // Count visits per venue
                if (!cityData.venueVisits.has(venue.name)) {
                    cityData.venueVisits.set(venue.name, 0);
                }
                cityData.venueVisits.set(venue.name, cityData.venueVisits.get(venue.name) + 1);
            }
        });
        
        console.log('City statistics:', Array.from(this.cityStats.entries()));
    }

    // Convert latitude/longitude to SVG coordinates using Mercator projection
    latLngToSVG(lat, lng) {
        if (!this.svgElement) {
            return { x: 0, y: 0 };
        }
        
        // Get SVG viewBox dimensions
        const viewBox = this.svgElement.getAttribute('viewBox');
        if (!viewBox) {
            return { x: 0, y: 0 };
        }
        
        const [minX, minY, width, height] = viewBox.split(' ').map(Number);
        
        // Dynamically calculate the actual map bounds within the SVG viewBox
        const paths = this.svgElement.querySelectorAll('path');
        let globalMinX = Infinity, globalMinY = Infinity;
        let globalMaxX = -Infinity, globalMaxY = -Infinity;

        paths.forEach(path => {
          const bbox = path.getBBox(); // Accounts for transformations/curves
          globalMinX = Math.min(globalMinX, bbox.x);
          globalMinY = Math.min(globalMinY, bbox.y);
          globalMaxX = Math.max(globalMaxX, bbox.x + bbox.width);
          globalMaxY = Math.max(globalMaxY, bbox.y + bbox.height);
        });

        // Results:
        const mapBounds = {
            minX: globalMinX,
            maxX: globalMaxX,
            minY: globalMinY,
            maxY: globalMaxY
        };
        
        // Germany geographic bounds
        const germanyBounds = {
            north: 55.1,
            south: 47.3,
            east: 15.0,
            west: 5.9
        };
        
        // Apply Mercator projection to latitude
        // Mercator formula: y = ln(tan(π/4 + lat * π/360))
        const mercatorLat = Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
        const mercatorNorth = Math.log(Math.tan(Math.PI / 4 + germanyBounds.north * Math.PI / 360));
        const mercatorSouth = Math.log(Math.tan(Math.PI / 4 + germanyBounds.south * Math.PI / 360));
        
        // Convert lng/mercator-lat to normalized coordinates (0-1) within Germany bounds
        const normalizedX = (lng - germanyBounds.west) / (germanyBounds.east - germanyBounds.west);
        const normalizedY = 1 - (mercatorLat - mercatorSouth) / (mercatorNorth - mercatorSouth);
        
        // Map normalized coordinates to actual map bounds within SVG
        const svgX = mapBounds.minX + (normalizedX * (mapBounds.maxX - mapBounds.minX));
        const svgY = mapBounds.minY + (normalizedY * (mapBounds.maxY - mapBounds.minY));
        
        return { x: svgX, y: svgY };
    }

    // Calculate optimal positions using the new D3 repellant forces algorithm
    async calculateOptimalPositions(cityDataArray, mapBounds) {
        try {
            // Prepare city data for the algorithm
            const cityData = cityDataArray.map(city => ({
                x: city.x,
                y: city.y,
                radius: city.radius,
                count: city.count,
                name: city.name,
                data: city.data
            }));
            
            // Calculate optimal positions using the new algorithm
            const positions = await this.labelPlacer.calculateOptimalPositions(cityData, mapBounds);
            
            // Log performance metrics if debugging is enabled
            if (this.labelPlacer.config.debug || this.labelPlacer.config.showMetrics) {
                const metrics = this.labelPlacer.getPerformanceMetrics();
                console.log('Label placement metrics:', metrics);
            }
            
            return positions;
        } catch (error) {
            console.error('Error in new label placement algorithm, falling back to legacy method:', error);
            
            // Fallback to legacy algorithm
            return this.calculateOptimalPositionsLegacy(cityDataArray);
        }
    }
    
    // Legacy fallback method (simplified version of the old algorithm)
    calculateOptimalPositionsLegacy(cityDataArray) {
        const positions = [];
        const existingPositions = [];
        
        cityDataArray.forEach(city => {
            const position = this.calculateOptimalPositionLegacy(city.x, city.y, existingPositions, city.radius);
            
            positions.push({
                cityX: city.x,
                cityY: city.y,
                labelX: position.x,
                labelY: position.y,
                radius: city.radius,
                city: city.data
            });
            
            existingPositions.push({
                x: position.x,
                y: position.y,
                radius: city.radius,
                cityX: city.x,
                cityY: city.y
            });
        });
        
        return positions;
    }
    
    // Legacy position calculation method (kept as fallback)
    calculateOptimalPositionLegacy(cityX, cityY, existingPositions, currentRadius) {
        const angles = [-45, 0, -90, 45, 90, 135, 180, -135]; // Top-right first
        const distances = [this.config.offsetDistance, this.config.offsetDistance * 1.5, this.config.offsetDistance * 2, this.config.offsetDistance * 3];
        
        for (const distance of distances) {
            for (const angle of angles) {
                const radians = (angle * Math.PI) / 180;
                const x = cityX + Math.cos(radians) * distance;
                const y = cityY + Math.sin(radians) * distance;
                
                let hasConflict = false;
                
                for (const pos of existingPositions) {
                    const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                    const minRequiredDistance = currentRadius + pos.radius + 15;
                    if (dist < minRequiredDistance) {
                        hasConflict = true;
                        break;
                    }
                }
                
                if (!hasConflict) {
                    return { x, y };
                }
            }
        }
        
        return {
            x: cityX + this.config.offsetDistance * 1.5,
            y: cityY - this.config.offsetDistance * 1.5
        };
    }


    // Load SVG map from assets/de.svg
    loadSVGMap() {
        try {
            // Clear existing content
            this.mapContainer.innerHTML = '';
            
            // Load the German SVG file
            this.loadGermanSVG();
            
        } catch (error) {
            console.error('Error loading German SVG map:', error);
            this.handleError(error);
        }
    }

    // Load the German SVG file directly
    loadGermanSVG() {
        // Create XMLHttpRequest to load SVG file
        const xhr = new XMLHttpRequest();
        xhr.open('GET', './assets/de.svg', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Successfully loaded SVG
                    this.processSVGContent(xhr.responseText);
                } else {
                    // Failed to load
                    console.error('Failed to load German SVG file');
                    this.handleError(new Error('Failed to load German SVG file'));
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
            
            // Ensure viewBox is set for proper scaling
            let viewBox = this.svgElement.getAttribute('viewBox');
            if (!viewBox) {
                // Try to get original dimensions from the SVG
                const originalWidth = svgElement.getAttribute('width') || '1000';
                const originalHeight = svgElement.getAttribute('height') || '1000';
                
                // Remove 'px' or other units if present
                const cleanWidth = originalWidth.toString().replace(/[^\d.]/g, '');
                const cleanHeight = originalHeight.toString().replace(/[^\d.]/g, '');
                
                viewBox = `0 0 ${cleanWidth} ${cleanHeight}`;
                this.svgElement.setAttribute('viewBox', viewBox);
            }
            
            this.svgElement.classList.add('german-map-svg');
            
            // Process all path elements (German states)
            const paths = this.svgElement.querySelectorAll('path');
            paths.forEach(path => {
                // Try to get state name from various attributes
                let stateName = null;
                const classAttr = path.getAttribute('class');
                const idAttr = path.getAttribute('id');
                const nameAttr = path.getAttribute('name');
                const titleAttr = path.getAttribute('title');
                
                if (nameAttr) {
                    stateName = nameAttr;
                } else if (titleAttr) {
                    stateName = titleAttr;
                } else if (classAttr) {
                    stateName = classAttr;
                } else if (idAttr) {
                    stateName = this.getStateNameFromId(idAttr);
                }
                
                if (stateName) {
                    // Set consistent styling - black fill with light gray borders
                    path.classList.add('german-state-path');
                    path.setAttribute('data-state-id', idAttr || classAttr || stateName);
                    path.setAttribute('data-state', stateName);
                    
                    // Apply simplified styling
                    path.style.fill = this.colors.fill;
                    path.style.stroke = this.colors.borders;
                    path.style.strokeWidth = '1';
                    path.style.cursor = 'default';
                    
                    // Store reference - support multiple paths per state
                    if (!this.stateElements[stateName]) {
                        this.stateElements[stateName] = [];
                    }
                    this.stateElements[stateName].push(path);
                }
            });
            
            // Add the SVG to the container
            this.mapContainer.appendChild(this.svgElement);
            
            // Add concert visualization elements with proper timing
            setTimeout(() => {
                this.addConcertVisualization().then(() => {
                    this.isInitialized = true;
                    console.log(`German map initialized successfully with ${Object.keys(this.stateElements).length} states`);
                }).catch(error => {
                    console.error('Error adding concert visualization:', error);
                    this.isInitialized = true; // Still mark as initialized even if visualization fails
                });
            }, 50); // Small delay to ensure DOM is ready
            
        } catch (error) {
            console.error('Error processing German SVG content:', error);
            this.handleError(error);
        }
    }

    // Get state name from ID (basic mapping for common German state codes)
    getStateNameFromId(id) {
        const stateIdMap = {
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
        };
        
        return stateIdMap[id] || id;
    }

    // Add concert visualization elements to the SVG using the new algorithm
    async addConcertVisualization() {
        if (!this.svgElement || this.cityStats.size === 0) {
            console.log('Skipping concert visualization: SVG not ready or no city data');
            return;
        }
        
        console.log(`Starting concert visualization for ${this.cityStats.size} cities`);
        
        // Clear existing visual elements
        this.clearVisualElements();
        
        // Create container groups for different element types
        const cityDotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        cityDotsGroup.setAttribute('class', 'city-dots-group');
        
        const connectingLinesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        connectingLinesGroup.setAttribute('class', 'connecting-lines-group');
        
        const countCirclesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        countCirclesGroup.setAttribute('class', 'count-circles-group');
        
        // Prepare city data for the new algorithm
        const cityDataArray = [];
        this.cityStats.forEach((cityData, cityName) => {
            const svgCoords = this.latLngToSVG(cityData.latitude, cityData.longitude);
            const circleRadius = this.config.countCircleRadius;
            
            cityDataArray.push({
                x: svgCoords.x,
                y: svgCoords.y,
                radius: circleRadius,
                count: cityData.count,
                name: cityName,
                data: {
                    // Preserve all original city data in a nested structure
                    count: cityData.count,
                    venues: cityData.venues,
                    venueVisits: cityData.venueVisits,
                    latitude: cityData.latitude,
                    longitude: cityData.longitude,
                    name: cityName
                }
            });
        });
        
        // Calculate map bounds for boundary constraints
        const mapBounds = this.calculateMapBounds();
        
        try {
            // Use the new algorithm to calculate optimal positions
            const optimalPositions = await this.calculateOptimalPositions(cityDataArray, mapBounds);
            
            // Create visual elements using the calculated positions
            optimalPositions.forEach(position => {
                const cityName = position.city.name;
                const cityData = position.city; // City data now contains all the original properties
                
                // Create city dot
                const cityDot = this.createCityDot(position.cityX, position.cityY, cityName, cityData);
                cityDotsGroup.appendChild(cityDot);
                this.visualElements.cityDots.push(cityDot);
                
                // Create connecting line
                const connectingLine = this.createConnectingLine(
                    position.cityX, position.cityY,
                    position.labelX, position.labelY
                );
                connectingLinesGroup.appendChild(connectingLine);
                this.visualElements.connectingLines.push(connectingLine);
                
                // Create count circle
                const countCircle = this.createCountCircle(
                    position.labelX, position.labelY,
                    position.radius, cityData.count,
                    cityName, cityData
                );
                countCirclesGroup.appendChild(countCircle);
                this.visualElements.countCircles.push(countCircle);
            });
            
        } catch (error) {
            console.error('Error using new algorithm, falling back to legacy method:', error);
            
            // Fallback to legacy method
            const existingPositions = [];
            
            this.cityStats.forEach((cityData, cityName) => {
                const svgCoords = this.latLngToSVG(cityData.latitude, cityData.longitude);
                const circleRadius = this.config.countCircleRadius;
                
                // Create city dot
                const cityDot = this.createCityDot(svgCoords.x, svgCoords.y, cityName, cityData);
                cityDotsGroup.appendChild(cityDot);
                this.visualElements.cityDots.push(cityDot);
                
                // Calculate position using legacy method
                const circlePos = this.calculateOptimalPositionLegacy(svgCoords.x, svgCoords.y, existingPositions, circleRadius);
                existingPositions.push({
                    x: circlePos.x,
                    y: circlePos.y,
                    radius: circleRadius,
                    cityX: svgCoords.x,
                    cityY: svgCoords.y
                });
                
                // Create connecting line
                const connectingLine = this.createConnectingLine(svgCoords.x, svgCoords.y, circlePos.x, circlePos.y);
                connectingLinesGroup.appendChild(connectingLine);
                this.visualElements.connectingLines.push(connectingLine);
                
                // Create count circle
                const countCircle = this.createCountCircle(circlePos.x, circlePos.y, circleRadius, cityData.count, cityName, cityData);
                countCirclesGroup.appendChild(countCircle);
                this.visualElements.countCircles.push(countCircle);
            });
        }
        
        // Add groups to SVG in correct order (lines first, then dots, then circles)
        this.svgElement.appendChild(connectingLinesGroup);
        this.svgElement.appendChild(cityDotsGroup);
        this.svgElement.appendChild(countCirclesGroup);
        
        // Force a repaint to ensure elements are visible
        this.svgElement.style.display = 'none';
        this.svgElement.offsetHeight; // Trigger reflow
        this.svgElement.style.display = 'block';
        
        console.log(`Added concert visualization for ${this.cityStats.size} cities using advanced label placement`);
        
        // Verify elements are actually in the DOM
        const cityDots = this.svgElement.querySelectorAll('.city-dot');
        const countCircles = this.svgElement.querySelectorAll('.count-circle-group');
        const connectingLines = this.svgElement.querySelectorAll('.connecting-line');
        
        console.log(`Verification: ${cityDots.length} city dots, ${countCircles.length} count circles, ${connectingLines.length} connecting lines in DOM`);
        
        if (cityDots.length === 0 && this.cityStats.size > 0) {
            console.warn('Warning: No city dots found in DOM despite having city data');
        }
    }
    
    // Calculate map bounds for boundary constraints
    calculateMapBounds() {
        if (!this.svgElement) {
            return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
        }
        
        const paths = this.svgElement.querySelectorAll('path');
        let globalMinX = Infinity, globalMinY = Infinity;
        let globalMaxX = -Infinity, globalMaxY = -Infinity;

        paths.forEach(path => {
            const bbox = path.getBBox();
            globalMinX = Math.min(globalMinX, bbox.x);
            globalMinY = Math.min(globalMinY, bbox.y);
            globalMaxX = Math.max(globalMaxX, bbox.x + bbox.width);
            globalMaxY = Math.max(globalMaxY, bbox.y + bbox.height);
        });

        return {
            minX: globalMinX,
            maxX: globalMaxX,
            minY: globalMinY,
            maxY: globalMaxY
        };
    }

    // Create a city dot element
    createCityDot(x, y, cityName, cityData) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', this.config.cityDotRadius);
        dot.setAttribute('fill', this.colors.cityDot);
        dot.setAttribute('stroke', 'none');
        dot.setAttribute('class', 'city-dot');
        dot.setAttribute('data-city', cityName);
        dot.setAttribute('data-count', cityData.count);
        
        // Add tooltip functionality and cross-highlighting
        this.addTooltipEvents(dot, cityName, cityData);
        this.addCrossHighlighting(dot, cityName);
        this.addCityNavigation(dot, cityName);
        
        return dot;
    }

    // Create a connecting line element
    createConnectingLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', this.colors.connectingLine);
        line.setAttribute('stroke-width', this.config.lineStrokeWidth);
        line.setAttribute('class', 'connecting-line');
        
        return line;
    }

    // Create a count circle element
    createCountCircle(x, y, radius, count, cityName, cityData) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'count-circle-group');
        group.setAttribute('data-city', cityName);
        
        // Create circle background
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', this.colors.countCircle);
        circle.setAttribute('stroke', 'none');
        circle.setAttribute('class', 'count-circle');
        
        // Create count text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', this.colors.countText);
        text.setAttribute('font-size', Math.max(12, radius * 0.6));
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('class', 'count-text');
        text.textContent = count;
        
        group.appendChild(circle);
        group.appendChild(text);
        
        // Add tooltip functionality and cross-highlighting
        this.addTooltipEvents(group, cityName, cityData);
        this.addCrossHighlighting(group, cityName);
        this.addCityNavigation(group, cityName);
        
        return group;
    }

    // Add tooltip event handlers
    addTooltipEvents(element, cityName, cityData) {
        let tooltip = null;
        
        element.addEventListener('mouseenter', (e) => {
            tooltip = this.createTooltip(cityName, cityData);
            this.mapContainer.appendChild(tooltip);
            this.updateTooltipPosition(tooltip, e);
        });
        
        element.addEventListener('mousemove', (e) => {
            if (tooltip) {
                this.updateTooltipPosition(tooltip, e);
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                this.mapContainer.removeChild(tooltip);
                tooltip = null;
            }
        });
    }

    // Create tooltip element
    createTooltip(cityName, cityData) {
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        
        // Sort venues by number of events (descending) and create list with visit counts
        const sortedVenues = cityData.venueVisits ? Array.from(cityData.venueVisits.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by visit count descending
            .map(([venueName, visitCount]) => `<div class="map-tooltip-list-item">${venueName} (${visitCount})</div>`)
            .join('') : '';
        
        tooltip.innerHTML = `
            <div class="map-tooltip-title">${cityName}</div>
            <div class="map-tooltip-numbering">${cityData.count} concert${cityData.count !== 1 ? 's' : ''}</div>
            <div class="map-tooltip-list">
                ${sortedVenues}
            </div>
        `;
        
        return tooltip;
    }

    // Update tooltip position
    updateTooltipPosition(tooltip, event) {
        const rect = this.mapContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Get actual tooltip dimensions from DOM
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;
        
        let left = x + 10;
        let top = y - 10;
        
        // Adjust if tooltip would go outside container bounds
        if (left + tooltipWidth > rect.width) {
            left = x - tooltipWidth - 10;
        }
        if (top < 0) {
            top = y + 20;
        }
        if (top + tooltipHeight > rect.height) {
            top = y - tooltipHeight - 10;
        }
        
        // Position tooltip relative to container since it's appended to mapContainer
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    // Add cross-highlighting functionality between city dots and count circles
    addCrossHighlighting(element, cityName) {
        element.addEventListener('mouseenter', () => {
            // Find and highlight corresponding elements
            const cityDot = this.svgElement.querySelector(`.city-dot[data-city="${cityName}"]`);
            const countCircleGroup = this.svgElement.querySelector(`.count-circle-group[data-city="${cityName}"]`);
            
            if (cityDot) {
                // Grow the city dot
                cityDot.setAttribute('r', this.config.cityDotRadius * 1.5);
                cityDot.style.filter = 'brightness(1.3)';
            }
            
            if (countCircleGroup) {
                // Highlight the count circle
                const countCircle = countCircleGroup.querySelector('.count-circle');
                if (countCircle) {
                    countCircle.style.filter = 'brightness(1.2)';
                    countCircle.style.strokeWidth = '2';
                    countCircle.style.stroke = this.colors.countText;
                }
            }
        });
        
        element.addEventListener('mouseleave', () => {
            // Reset corresponding elements
            const cityDot = this.svgElement.querySelector(`.city-dot[data-city="${cityName}"]`);
            const countCircleGroup = this.svgElement.querySelector(`.count-circle-group[data-city="${cityName}"]`);
            
            if (cityDot) {
                // Reset city dot size
                cityDot.setAttribute('r', this.config.cityDotRadius);
                cityDot.style.filter = '';
            }
            
            if (countCircleGroup) {
                // Reset count circle
                const countCircle = countCircleGroup.querySelector('.count-circle');
                if (countCircle) {
                    countCircle.style.filter = '';
                    countCircle.style.strokeWidth = '';
                    countCircle.style.stroke = '';
                }
            }
        });
    }

    // Add city navigation functionality
    addCityNavigation(element, cityName) {
        element.style.cursor = 'pointer';
        
        element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('German map city clicked - navigating to city:', cityName);
            router.navigateTo(`city/${normalizeStringForId(cityName)}`);
        });
    }

    // Clear all visual elements
    clearVisualElements() {
        // Remove existing groups
        const existingGroups = this.svgElement.querySelectorAll('.city-dots-group, .connecting-lines-group, .count-circles-group');
        existingGroups.forEach(group => group.remove());
        
        // Clear arrays
        this.visualElements.cityDots = [];
        this.visualElements.countCircles = [];
        this.visualElements.connectingLines = [];
        this.visualElements.tooltips = [];
    }

    // Refresh map (reload data and recreate visualization)
    refresh() {
        if (!this.isInitialized) {
            console.log('German map not initialized, initializing now');
            this.initializeGermanMap();
            return;
        }
        
        console.log('Refreshing German map visualization');
        
        // Reload concert data
        this.loadConcertData();
        
        // Recreate visualization with proper async handling
        if (this.svgElement && this.cityStats.size > 0) {
            this.addConcertVisualization().then(() => {
                console.log('German map refreshed successfully');
            }).catch(error => {
                console.error('Error refreshing German map visualization:', error);
            });
        } else {
            console.warn('Cannot refresh: SVG element missing or no city data');
        }
    }

    // Handle errors
    handleError(error) {
        console.error('GermanMapManager error:', error);
        
        if (this.mapContainer) {
            this.mapContainer.innerHTML = `
                <div class="map-error">
                    <h3>German Map Loading Error</h3>
                    <p>Unable to load the German map visualization.</p>
                    <button onclick="germanMapManager.initializeGermanMap()" class="retry-button">
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
            statesLoaded: Object.keys(this.stateElements).length,
            totalPaths: Object.values(this.stateElements).reduce((sum, paths) => sum + paths.length, 0)
        };
    }

    // Resize map (for responsive design)
    resize() {
        if (this.svgElement && this.mapContainer) {
            // SVG will automatically resize due to viewBox and 100% width/height
            console.log('German map resized');
        }
    }

    // Destroy map (cleanup)
    destroy() {
        if (this.mapContainer) {
            this.mapContainer.innerHTML = '';
        }
        
        // Cleanup the label placer
        if (this.labelPlacer) {
            this.labelPlacer.destroy();
        }
        
        this.stateElements = {};
        this.isInitialized = false;
        
        console.log('German map destroyed');
    }
}

// Create global instance
const germanMapManager = new GermanMapManager();