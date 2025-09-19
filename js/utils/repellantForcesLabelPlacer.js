/**
 * D3 Repellant Forces Label Placer
 * 
 * Advanced label placement algorithm using D3.js force simulation
 * with custom forces for optimal positioning of city labels on maps.
 * 
 * Features:
 * - Initial placement away from city clusters with top-right bias
 * - D3.js force simulation with custom forces (attraction, repulsion, bias, boundary)
 * - Collision detection and line crossing prevention
 * - Performance optimization with adaptive algorithms
 */
class D3RepellantForcesLabelPlacer {
    constructor(config = {}) {
        // Configuration with defaults
        this.config = {
            // Basic positioning
            offsetDistance: config.offsetDistance || 40,
            minDistance: config.minDistance || 50,
            
            // Force simulation parameters
            simulationIterations: config.simulationIterations || 300,
            convergenceThreshold: config.convergenceThreshold || 0.1,
            
            // Force strengths
            attractionStrength: config.attractionStrength || 0.3,
            repulsionStrength: config.repulsionStrength || -30,
            biasStrength: config.biasStrength || 0.1,
            boundaryStrength: config.boundaryStrength || 0.5,
            
            // Collision detection
            spatialGridSize: config.spatialGridSize || 50,
            collisionBuffer: config.collisionBuffer || 15,
            
            // Performance thresholds
            smallDatasetThreshold: config.smallDatasetThreshold || 10,
            largeDatasetThreshold: config.largeDatasetThreshold || 50,
            
            // Debugging
            debug: config.debug || false,
            showMetrics: config.showMetrics || false
        };
        
        // Internal state
        this.simulation = null;
        this.spatialGrid = new Map();
        this.nodes = [];
        this.links = [];
        this.mapBounds = null;
        this.performanceMetrics = {
            startTime: 0,
            endTime: 0,
            iterations: 0,
            convergenceReached: false
        };
    }
    
    /**
     * Main method to calculate optimal positions for all labels
     * @param {Array} cityData - Array of city objects with coordinates and metadata
     * @param {Object} mapBounds - Map boundary constraints
     * @param {Array} existingElements - Existing visual elements to avoid
     * @returns {Array} Array of optimal positions for each city
     */
    calculateOptimalPositions(cityData, mapBounds, existingElements = []) {
        this.performanceMetrics.startTime = performance.now();
        this.mapBounds = mapBounds;
        
        // Choose algorithm based on dataset size
        const datasetSize = cityData.length;
        if (datasetSize <= this.config.smallDatasetThreshold) {
            return this.simpleAlgorithm(cityData, existingElements);
        } else if (datasetSize <= this.config.largeDatasetThreshold) {
            return this.forceSimulationAlgorithm(cityData, existingElements);
        } else {
            return this.adaptiveAlgorithm(cityData, existingElements);
        }
    }
    
    /**
     * Simple algorithm for small datasets (≤10 cities)
     */
    simpleAlgorithm(cityData, existingElements) {
        if (this.config.debug) console.log('Using simple algorithm for', cityData.length, 'cities');
        
        const positions = [];
        const occupiedPositions = [...existingElements];
        
        cityData.forEach((city, index) => {
            const clusters = this.detectClusters(cityData, city, index);
            const initialPos = this.calculateInitialPosition(city, clusters);
            const optimalPos = this.findNonOverlappingPosition(
                initialPos, 
                city.radius || 20, 
                occupiedPositions
            );
            
            positions.push({
                cityX: city.x,
                cityY: city.y,
                labelX: optimalPos.x,
                labelY: optimalPos.y,
                radius: city.radius || 20,
                city: city.data || city // Use nested data if available, fallback to city
            });
            
            occupiedPositions.push(optimalPos);
        });
        
        this.performanceMetrics.endTime = performance.now();
        return positions;
    }
    
    /**
     * Force simulation algorithm for medium datasets (11-50 cities)
     */
    forceSimulationAlgorithm(cityData, existingElements) {
        if (this.config.debug) console.log('Using force simulation for', cityData.length, 'cities');
        
        // Prepare nodes for simulation
        this.prepareNodes(cityData, existingElements);
        
        // Create and configure D3 force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('attraction', this.createAttractionForce())
            .force('repulsion', this.createRepulsionForce())
            .force('bias', this.createBiasForce())
            .force('boundary', this.createBoundaryForce())
            .force('collision', this.createCollisionForce())
            .force('cityAvoidance', this.createCityAvoidanceForce())
            .force('lineCrossing', this.createLineCrossingPreventionForce())
            .alphaDecay(0.02)
            .velocityDecay(0.3);
        
        // Run simulation
        return this.runSimulation();
    }
    
    /**
     * Adaptive algorithm for large datasets (>50 cities)
     */
    adaptiveAlgorithm(cityData, existingElements) {
        if (this.config.debug) console.log('Using adaptive algorithm for', cityData.length, 'cities');
        
        // Use clustering to group nearby cities and process in batches
        const clusters = this.clusterCities(cityData);
        const positions = [];
        
        clusters.forEach(cluster => {
            const clusterPositions = this.forceSimulationAlgorithm(cluster, existingElements);
            positions.push(...clusterPositions);
            // Add cluster positions to existing elements for next cluster
            existingElements.push(...clusterPositions);
        });
        
        return positions;
    }
    
    /**
     * Detect clusters of nearby cities
     */
    detectClusters(cityData, targetCity, targetIndex) {
        const clusters = [];
        const clusterRadius = this.config.offsetDistance * 2;
        
        cityData.forEach((city, index) => {
            if (index !== targetIndex) {
                const distance = Math.sqrt(
                    Math.pow(city.x - targetCity.x, 2) + 
                    Math.pow(city.y - targetCity.y, 2)
                );
                
                if (distance <= clusterRadius) {
                    clusters.push({
                        city: city,
                        distance: distance,
                        angle: Math.atan2(city.y - targetCity.y, city.x - targetCity.x)
                    });
                }
            }
        });
        
        return clusters;
    }
    
    /**
     * Calculate initial position facing away from nearby cities' center
     */
    calculateInitialPosition(city, clusters) {
        // Default top-right direction (-45 degrees in SVG coordinates)
        const preferredAngle = -Math.PI / 4;
        
        // If there are no nearby cities, use the preferred angle
        if (clusters.length === 0) {
            const distance = this.config.offsetDistance;
            return {
                x: city.x + Math.cos(preferredAngle) * distance,
                y: city.y + Math.sin(preferredAngle) * distance,
                radius: city.radius || 20
            };
        }
        
        // Calculate mean position of all nearby cities (including the target city)
        let meanX = city.x;
        let meanY = city.y;
        
        clusters.forEach(cluster => {
            meanX += cluster.city.x;
            meanY += cluster.city.y;
        });
        
        meanX /= (clusters.length + 1); // +1 for the target city itself
        meanY /= (clusters.length + 1);
        
        // Calculate angle facing directly away from the mean position
        const awayAngle = Math.atan2(city.y - meanY, city.x - meanX);
        
        const distance = this.config.offsetDistance;
        return {
            x: city.x + Math.cos(awayAngle) * distance,
            y: city.y + Math.sin(awayAngle) * distance,
            radius: city.radius || 20
        };
    }
    
    /**
     * Find non-overlapping position using iterative placement
     */
    findNonOverlappingPosition(initialPos, radius, occupiedPositions) {
        const angles = [-45, 0, -90, 45, 90, 135, 180, -135]; // Top-right first
        const distances = [
            this.config.offsetDistance,
            this.config.offsetDistance * 1.5,
            this.config.offsetDistance * 2,
            this.config.offsetDistance * 3
        ];
        
        // Try initial position first
        if (!this.hasCollision(initialPos, radius, occupiedPositions)) {
            return initialPos;
        }
        
        // Try different angles and distances
        for (const distance of distances) {
            for (const angle of angles) {
                const radians = (angle * Math.PI) / 180;
                const pos = {
                    x: initialPos.x + Math.cos(radians) * (distance - this.config.offsetDistance),
                    y: initialPos.y + Math.sin(radians) * (distance - this.config.offsetDistance),
                    radius: radius
                };
                
                if (!this.hasCollision(pos, radius, occupiedPositions)) {
                    return pos;
                }
            }
        }
        
        // Fallback to initial position with increased distance
        return {
            x: initialPos.x + this.config.offsetDistance * 1.5,
            y: initialPos.y - this.config.offsetDistance * 1.5,
            radius: radius
        };
    }
    
    /**
     * Check for collisions with existing elements
     */
    hasCollision(pos, radius, occupiedPositions) {
        for (const occupied of occupiedPositions) {
            const distance = Math.sqrt(
                Math.pow(pos.x - occupied.x, 2) +
                Math.pow(pos.y - occupied.y, 2)
            );
            
            const minDistance = radius + (occupied.radius || 20) + this.config.collisionBuffer;
            if (distance < minDistance) {
                return true;
            }
            
            // Also check collision with city positions if available
            if (occupied.cityX !== undefined && occupied.cityY !== undefined) {
                const cityDistance = Math.sqrt(
                    Math.pow(pos.x - occupied.cityX, 2) +
                    Math.pow(pos.y - occupied.cityY, 2)
                );
                
                const minCityDistance = radius + 8 + this.config.collisionBuffer; // Increased city dot buffer from 4 to 8
                if (cityDistance < minCityDistance) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Prepare nodes for D3 force simulation
     */
    prepareNodes(cityData, existingElements) {
        this.nodes = [];
        
        cityData.forEach((city, index) => {
            const clusters = this.detectClusters(cityData, city, index);
            const initialPos = this.calculateInitialPosition(city, clusters);
            
            this.nodes.push({
                id: `city-${index}`,
                x: initialPos.x,
                y: initialPos.y,
                cityX: city.x,
                cityY: city.y,
                radius: city.radius || 20,
                city: city.data || city, // Use nested data if available, fallback to city
                fixed: false
            });
        });
        
        // Add existing elements as fixed nodes
        existingElements.forEach((element, index) => {
            this.nodes.push({
                id: `existing-${index}`,
                x: element.x,
                y: element.y,
                radius: element.radius || 20,
                fixed: true
            });
        });
    }
    
    /**
     * Create attraction force to keep labels close to their cities
     */
    createAttractionForce() {
        return (alpha) => {
            this.nodes.forEach(node => {
                if (!node.fixed && node.cityX !== undefined && node.cityY !== undefined) {
                    const dx = node.cityX - node.x;
                    const dy = node.cityY - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const targetDistance = this.config.offsetDistance;
                        const force = (distance - targetDistance) * this.config.attractionStrength * alpha;
                        
                        node.vx += (dx / distance) * force;
                        node.vy += (dy / distance) * force;
                    }
                }
            });
        };
    }
    
    /**
     * Create repulsion force to prevent label overlap
     */
    createRepulsionForce() {
        return d3.forceManyBody()
            .strength(this.config.repulsionStrength)
            .distanceMin(this.config.minDistance)
            .distanceMax(this.config.offsetDistance * 4);
    }
    
    /**
     * Create bias force towards top-right
     */
    createBiasForce() {
        return (alpha) => {
            this.nodes.forEach(node => {
                if (!node.fixed && node.cityX !== undefined) {
                    // Calculate top-right direction from city with reduced bias
                    const targetX = node.cityX + this.config.offsetDistance * 0.3; // Reduced from 0.7 to 0.3
                    const targetY = node.cityY - this.config.offsetDistance * 0.3; // Reduced from 0.7 to 0.3
                    
                    const dx = targetX - node.x;
                    const dy = targetY - node.y;
                    
                    node.vx += dx * this.config.biasStrength * alpha * 0.5; // Reduced bias strength by half
                    node.vy += dy * this.config.biasStrength * alpha * 0.5;
                }
            });
        };
    }
    
    /**
     * Create boundary force to keep labels within map bounds
     */
    createBoundaryForce() {
        return (alpha) => {
            if (!this.mapBounds) return;
            
            this.nodes.forEach(node => {
                if (!node.fixed) {
                    const margin = node.radius + 10;
                    
                    // Left boundary
                    if (node.x < this.mapBounds.minX + margin) {
                        node.vx += (this.mapBounds.minX + margin - node.x) * this.config.boundaryStrength * alpha;
                    }
                    
                    // Right boundary
                    if (node.x > this.mapBounds.maxX - margin) {
                        node.vx += (this.mapBounds.maxX - margin - node.x) * this.config.boundaryStrength * alpha;
                    }
                    
                    // Top boundary
                    if (node.y < this.mapBounds.minY + margin) {
                        node.vy += (this.mapBounds.minY + margin - node.y) * this.config.boundaryStrength * alpha;
                    }
                    
                    // Bottom boundary
                    if (node.y > this.mapBounds.maxY - margin) {
                        node.vy += (this.mapBounds.maxY - margin - node.y) * this.config.boundaryStrength * alpha;
                    }
                }
            });
        };
    }
    
    /**
     * Create collision force to prevent overlapping
     */
    createCollisionForce() {
        return d3.forceCollide()
            .radius(d => d.radius + this.config.collisionBuffer)
            .strength(0.7)
            .iterations(2);
    }
    
    /**
     * Create city avoidance force to prevent labels from overlapping with city dots
     */
    createCityAvoidanceForce() {
        return (alpha) => {
            this.nodes.forEach(node => {
                if (!node.fixed && node.cityX !== undefined && node.cityY !== undefined) {
                    // Check distance to own city
                    const dx = node.x - node.cityX;
                    const dy = node.y - node.cityY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Increased minimum distance to prevent overlap with cities
                    const minDistance = node.radius + 8 + this.config.collisionBuffer; // Increased city dot buffer from 4 to 8
                    
                    if (distance < minDistance && distance > 0) {
                        // Significantly increased force strength to push labels away from cities
                        const force = (minDistance - distance) * 2.0 * alpha; // Increased from 0.1 to 2.0
                        node.vx += (dx / distance) * force;
                        node.vy += (dy / distance) * force;
                    }
                    
                    // Also check against other cities with stronger force
                    this.nodes.forEach(otherNode => {
                        if (otherNode !== node && otherNode.cityX !== undefined && otherNode.cityY !== undefined) {
                            const otherDx = node.x - otherNode.cityX;
                            const otherDy = node.y - otherNode.cityY;
                            const otherDistance = Math.sqrt(otherDx * otherDx + otherDy * otherDy);
                            
                            if (otherDistance < minDistance && otherDistance > 0) {
                                const otherForce = (minDistance - otherDistance) * 1.0 * alpha; // Increased from 0.05 to 1.0
                                node.vx += (otherDx / otherDistance) * otherForce;
                                node.vy += (otherDy / otherDistance) * otherForce;
                            }
                        }
                    });
                }
            });
        };
    }
    
    /**
     * Create line crossing prevention force
     */
    createLineCrossingPreventionForce() {
        return (alpha) => {
            // Check all pairs of nodes for line crossings
            for (let i = 0; i < this.nodes.length; i++) {
                const nodeA = this.nodes[i];
                if (nodeA.fixed || !nodeA.cityX || !nodeA.cityY) continue;
                
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const nodeB = this.nodes[j];
                    if (nodeB.fixed || !nodeB.cityX || !nodeB.cityY) continue;
                    
                    // Define the two lines: cityA->labelA and cityB->labelB
                    const lineA = {
                        x1: nodeA.cityX, y1: nodeA.cityY,
                        x2: nodeA.x, y2: nodeA.y
                    };
                    const lineB = {
                        x1: nodeB.cityX, y1: nodeB.cityY,
                        x2: nodeB.x, y2: nodeB.y
                    };
                    
                    // Check if lines intersect
                    if (this.linesIntersect(lineA, lineB)) {
                        // Calculate repulsion force to prevent crossing
                        const dx = nodeA.x - nodeB.x;
                        const dy = nodeA.y - nodeB.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance > 0) {
                            // Strong force to separate crossing labels
                            const force = 50 * alpha / (distance + 1);
                            
                            nodeA.vx += (dx / distance) * force;
                            nodeA.vy += (dy / distance) * force;
                            nodeB.vx -= (dx / distance) * force;
                            nodeB.vy -= (dy / distance) * force;
                        }
                    }
                }
            }
        };
    }
    
    /**
     * Run the force simulation
     */
    runSimulation() {
        return new Promise((resolve) => {
            let iterationCount = 0;
            let lastPositions = this.nodes.map(n => ({ x: n.x, y: n.y }));
            
            this.simulation.on('tick', () => {
                iterationCount++;
                
                // Check for convergence every 10 iterations
                if (iterationCount % 10 === 0) {
                    const movement = this.calculateMovement(lastPositions);
                    
                    if (movement < this.config.convergenceThreshold || 
                        iterationCount >= this.config.simulationIterations) {
                        
                        this.performanceMetrics.iterations = iterationCount;
                        this.performanceMetrics.convergenceReached = movement < this.config.convergenceThreshold;
                        this.performanceMetrics.endTime = performance.now();
                        
                        this.simulation.stop();
                        resolve(this.extractPositions());
                    }
                    
                    lastPositions = this.nodes.map(n => ({ x: n.x, y: n.y }));
                }
            });
        });
    }
    
    /**
     * Calculate total movement between iterations
     */
    calculateMovement(lastPositions) {
        let totalMovement = 0;
        
        this.nodes.forEach((node, index) => {
            if (!node.fixed && lastPositions[index]) {
                const dx = node.x - lastPositions[index].x;
                const dy = node.y - lastPositions[index].y;
                totalMovement += Math.sqrt(dx * dx + dy * dy);
            }
        });
        
        return totalMovement / this.nodes.filter(n => !n.fixed).length;
    }
    
    /**
     * Extract final positions from simulation nodes
     */
    extractPositions() {
        return this.nodes
            .filter(node => !node.fixed && node.city)
            .map(node => ({
                cityX: node.cityX,
                cityY: node.cityY,
                labelX: node.x,
                labelY: node.y,
                radius: node.radius,
                city: node.city
            }));
    }
    
    /**
     * Cluster cities for adaptive algorithm
     */
    clusterCities(cityData) {
        // Simple spatial clustering based on distance
        const clusters = [];
        const processed = new Set();
        const clusterRadius = this.config.offsetDistance * 3;
        
        cityData.forEach((city, index) => {
            if (processed.has(index)) return;
            
            const cluster = [city];
            processed.add(index);
            
            // Find nearby cities
            cityData.forEach((otherCity, otherIndex) => {
                if (processed.has(otherIndex)) return;
                
                const distance = Math.sqrt(
                    Math.pow(city.x - otherCity.x, 2) + 
                    Math.pow(city.y - otherCity.y, 2)
                );
                
                if (distance <= clusterRadius) {
                    cluster.push(otherCity);
                    processed.add(otherIndex);
                }
            });
            
            clusters.push(cluster);
        });
        
        return clusters;
    }
    
    /**
     * Check if two line segments intersect (for line crossing prevention)
     */
    linesIntersect(line1, line2) {
        const { x1: x1, y1: y1, x2: x2, y2: y2 } = line1;
        const { x1: x3, y1: y3, x2: x4, y2: y4 } = line2;
        
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 1e-10) return false; // Lines are parallel
        
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
        
        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }
    
    
    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            duration: this.performanceMetrics.endTime - this.performanceMetrics.startTime,
            algorithmsUsed: this.getAlgorithmType()
        };
    }
    
    /**
     * Get algorithm type based on dataset size
     */
    getAlgorithmType() {
        const size = this.nodes.filter(n => !n.fixed).length;
        if (size <= this.config.smallDatasetThreshold) return 'simple';
        if (size <= this.config.largeDatasetThreshold) return 'force-simulation';
        return 'adaptive';
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.simulation) {
            this.simulation.stop();
            this.simulation = null;
        }
        
        this.nodes = [];
        this.links = [];
        this.spatialGrid.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = D3RepellantForcesLabelPlacer;
}