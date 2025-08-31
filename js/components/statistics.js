// Statistics Component - Handles overview statistics display and updates
class StatisticsManager {
    constructor() {
        this.elements = {
            // Main statistics
            totalEvents: document.getElementById('total-events'),
            totalBands: document.getElementById('total-bands'),
            totalShows: document.getElementById('total-shows'),
            totalCost: document.getElementById('total-cost'),
            
            // Sub-statistics
            totalConcerts: document.getElementById('total-concerts'),
            totalFestivals: document.getElementById('total-festivals'),
            avgEventsPerYear: document.getElementById('avg-events-per-year'),
            
            repeatBandsPercentage: document.getElementById('repeat-bands-percentage'),
            avgBandsPerYear: document.getElementById('avg-bands-per-year'),
            avgNewBandsPerYear: document.getElementById('avg-new-bands-per-year'),
            
            avgShowsPerYear: document.getElementById('avg-shows-per-year'),
            avgShowsPerBand: document.getElementById('avg-shows-per-band'),
            avgShowsPerEvent: document.getElementById('avg-shows-per-event'),
            
            avgCostPerYear: document.getElementById('avg-cost-per-year'),
            avgCostPerEvent: document.getElementById('avg-cost-per-event'),
            avgCostPerShow: document.getElementById('avg-cost-per-show'),
            
            // Bands statistics elements
            bandsAvgPerYear: document.getElementById('bands-avg-per-year'),
            bandsTotal: document.getElementById('bands-total'),
            bandsAtLeastTwice: document.getElementById('bands-at-least-twice'),
            bandsShowsPerBand: document.getElementById('bands-shows-per-band'),
            bandsCountries: document.getElementById('bands-countries')
        };
        this.animationDuration = 1500; // Animation duration in milliseconds
    }

    // Initialize statistics display
    initializeStatistics() {
        this.updateStatistics();
    }

    // Update all statistics
    updateStatistics() {
        const stats = dataManager.getStatistics();
        
        // Animate main statistics
        this.animateNumber(this.elements.totalEvents, 0, stats.totalEvents);
        this.animateNumber(this.elements.totalBands, 0, stats.totalUniqueBands);
        this.animateNumber(this.elements.totalShows, 0, stats.totalShows);
        this.animateEuro(this.elements.totalCost, 0, stats.totalCost);
        
        // Update sub-statistics (no animation for these)
        this.updateElement(this.elements.totalConcerts, stats.totalConcerts);
        this.updateElement(this.elements.totalFestivals, stats.totalFestivals);
        this.updateElement(this.elements.avgEventsPerYear, stats.avgEventsPerYear);
        
        this.updateElement(this.elements.repeatBandsPercentage, stats.repeatBandsPercentage);
        this.updateElement(this.elements.avgBandsPerYear, stats.avgBandsPerYear);
        this.updateElement(this.elements.avgNewBandsPerYear, stats.avgNewBandsPerYear);
        
        this.updateElement(this.elements.avgShowsPerYear, stats.avgShowsPerYear);
        this.updateElement(this.elements.avgShowsPerBand, stats.avgShowsPerBand);
        this.updateElement(this.elements.avgShowsPerEvent, stats.avgShowsPerEvent);
        
        this.updateElement(this.elements.avgCostPerYear, stats.avgCostPerYear + '€');
        this.updateElement(this.elements.avgCostPerEvent, stats.avgCostPerEvent + '€');
        this.updateElement(this.elements.avgCostPerShow, stats.avgCostPerShow + '€');
    }

    // Update element without animation
    updateElement(element, value) {
        if (element) {
            element.textContent = value;
        }
    }

    // Animate number counting up
    animateNumber(element, start, end, duration = this.animationDuration) {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = this.easeOutQuart(progress);
            const current = Math.floor(start + (difference * easedProgress));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString();
            }
        };

        requestAnimationFrame(step);
    }

    // Animate euro amounts (integers)
    animateEuro(element, start, end, duration = this.animationDuration) {
        if (!element) return;

        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = this.easeOutQuart(progress);
            const current = Math.round(start + (difference * easedProgress));
            
            element.textContent = `${current}€`;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = `${end}€`;
            }
        };

        requestAnimationFrame(step);
    }

    // Easing function for smooth animations
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // Get detailed statistics for tooltips or additional info
    getDetailedStatistics() {
        const stats = dataManager.getStatistics();
        const typeStats = dataManager.getConcertTypeStats();
        const yearStats = dataManager.getConcertsPerYearStats();
        const topArtists = dataManager.getTopArtists(5);
        
        // Calculate additional metrics
        const concerts = dataManager.getConcerts();
        const prices = concerts.map(c => c.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Calculate median price
        const sortedPrices = [...prices].sort((a, b) => a - b);
        const medianPrice = sortedPrices.length % 2 === 0
            ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
            : sortedPrices[Math.floor(sortedPrices.length / 2)];

        // Get venue statistics
        const venueStats = this.getVenueStatistics();
        
        return {
            basic: stats,
            types: typeStats,
            years: yearStats,
            topArtists: topArtists,
            pricing: {
                min: minPrice,
                max: maxPrice,
                median: medianPrice.toFixed(2),
                average: stats.avgPrice
            },
            venues: venueStats
        };
    }

    // Get venue-related statistics
    getVenueStatistics() {
        const venues = dataManager.getVenues();
        const concerts = dataManager.getConcerts();
        
        // Calculate venue utilization
        const venueUsage = {};
        concerts.forEach(concert => {
            venueUsage[concert.venueId] = (venueUsage[concert.venueId] || 0) + 1;
        });

        // Find most used venue
        const mostUsedVenueId = Object.keys(venueUsage).reduce((a, b) => 
            venueUsage[a] > venueUsage[b] ? a : b
        );
        const mostUsedVenue = dataManager.getVenueById(mostUsedVenueId);

        // Calculate capacity statistics
        const capacities = venues.map(v => v.capacity);
        const avgCapacity = capacities.reduce((sum, cap) => sum + cap, 0) / capacities.length;
        const maxCapacity = Math.max(...capacities);
        const minCapacity = Math.min(...capacities);

        // Get country distribution
        const countryStats = {};
        venues.forEach(venue => {
            countryStats[venue.country] = (countryStats[venue.country] || 0) + 1;
        });

        return {
            mostUsed: {
                venue: mostUsedVenue,
                count: venueUsage[mostUsedVenueId]
            },
            capacity: {
                average: Math.round(avgCapacity),
                max: maxCapacity,
                min: minCapacity
            },
            countries: countryStats,
            utilization: venueUsage
        };
    }

    // Create tooltip content for statistics cards
    createTooltipContent(statType) {
        const detailedStats = this.getDetailedStatistics();
        
        switch (statType) {
            case 'concerts':
                return `
                    <div class="stat-tooltip">
                        <h4>Concert Breakdown</h4>
                        <ul>
                            ${Object.entries(detailedStats.types).map(([type, count]) => 
                                `<li>${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
            
            case 'artists':
                return `
                    <div class="stat-tooltip">
                        <h4>Top Artists</h4>
                        <ul>
                            ${detailedStats.topArtists.map(artist => 
                                `<li>${artist.name}: ${artist.count} concerts</li>`
                            ).join('')}
                        </ul>
                    </div>
                `;
            
            case 'venues':
                return `
                    <div class="stat-tooltip">
                        <h4>Venue Statistics</h4>
                        <ul>
                            <li>Most Used: ${detailedStats.venues.mostUsed.venue.name} (${detailedStats.venues.mostUsed.count} concerts)</li>
                            <li>Avg Capacity: ${detailedStats.venues.capacity.average.toLocaleString()}</li>
                            <li>Countries: ${Object.keys(detailedStats.venues.countries).length}</li>
                        </ul>
                    </div>
                `;
            
            case 'price':
                return `
                    <div class="stat-tooltip">
                        <h4>Price Statistics</h4>
                        <ul>
                            <li>Average: $${detailedStats.pricing.average}</li>
                            <li>Median: $${detailedStats.pricing.median}</li>
                            <li>Range: $${detailedStats.pricing.min} - $${detailedStats.pricing.max}</li>
                        </ul>
                    </div>
                `;
            
            default:
                return '';
        }
    }

    // Add hover effects and tooltips to stat cards
    addInteractivity() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            const statTypes = ['concerts', 'artists', 'venues', 'price'];
            const statType = statTypes[index];
            
            if (statType) {
                card.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, statType);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            }
        });
    }

    // Show tooltip (placeholder for future implementation)
    showTooltip(element, statType) {
        // This could be expanded to show actual tooltips
        element.style.transform = 'translateY(-8px)';
    }

    // Hide tooltip
    hideTooltip() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.transform = 'translateY(-5px)';
        });
    }

    // Refresh statistics (useful for data updates)
    refresh() {
        this.updateStatistics();
    }

    // Get current statistics without animation
    getCurrentStatistics() {
        return dataManager.getStatistics();
    }

    // Update bands statistics
    updateBandsStatistics() {
        const bandsStats = dataManager.getBandsStatistics();
        
        // Animate the statistics
        this.animateNumber(this.elements.bandsAvgPerYear, 0, parseFloat(bandsStats.avgBandsPerYear));
        this.animateNumber(this.elements.bandsTotal, 0, bandsStats.totalBands);
        this.updateElement(this.elements.bandsAtLeastTwice, bandsStats.percentageAtLeastTwice);
        
        // Animate the new statistics
        this.animateNumber(this.elements.bandsShowsPerBand, 0, parseFloat(bandsStats.showsPerBand));
        this.animateNumber(this.elements.bandsCountries, 0, bandsStats.uniqueCountries);
    }

    // Initialize bands statistics display
    initializeBandsStatistics() {
        this.updateBandsStatistics();
    }

    // Update location statistics
    updateLocationStatistics() {
        const locationStats = dataManager.getLocationStatistics();
        
        // Find the location statistics elements with correct IDs
        const venuesCountElement = document.getElementById('locations-total-venues');
        const citiesCountElement = document.getElementById('locations-total-cities');
        
        // Animate the venue and city counts
        if (venuesCountElement) {
            this.animateNumber(venuesCountElement, 0, locationStats.totalVenues);
        }
        if (citiesCountElement) {
            this.animateNumber(citiesCountElement, 0, locationStats.totalCities);
        }
        
        // Create Chart.js charts for top venues and cities
        chartsManager.createTopVenuesChart();
        chartsManager.createTopCitiesChart();
        
        // Store top venues and cities data for potential use by charts component
        this.topVenuesData = locationStats.topVenues;
        this.topCitiesData = locationStats.topCities;
    }

    // Initialize location statistics display
    initializeLocationStatistics() {
        this.updateLocationStatistics();
    }

    // Update cost statistics
    updateCostStatistics() {
        const costStats = dataManager.getCostStatistics();
        
        // Find the cost statistics elements
        const totalCostElement = document.getElementById('costs-total');
        const avgCostPerYearElement = document.getElementById('costs-avg-per-year');
        const avgCostPerEventElement = document.getElementById('costs-avg-per-event');
        
        // Animate the cost statistics
        if (totalCostElement) {
            this.animateEuro(totalCostElement, 0, costStats.totalCost);
        }
        if (avgCostPerYearElement) {
            this.animateEuro(avgCostPerYearElement, 0, costStats.avgCostPerYear);
        }
        if (avgCostPerEventElement) {
            this.animateEuro(avgCostPerEventElement, 0, costStats.avgCostPerEvent);
        }
        
        // Create the cost charts
        chartsManager.createCostPerYearChart();
        chartsManager.createCostTrendChart();
    }

    // Initialize cost statistics display
    initializeCostStatistics() {
        this.updateCostStatistics();
    }
}

// Create global instance
const statisticsManager = new StatisticsManager();