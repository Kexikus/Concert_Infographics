// Statistics Component - Handles overview statistics display and updates
class StatisticsManager {
    constructor() {
        this.elements = {
            // Paired statistics elements
            pairedTotalShows: document.getElementById('paired-total-shows'),
            pairedTotalEvents: document.getElementById('paired-total-events'),
            pairedTotalBands: document.getElementById('paired-total-bands'),
            pairedCountries: document.getElementById('paired-countries'),
            pairedTotalVenues: document.getElementById('paired-total-venues'),
            pairedCities: document.getElementById('paired-cities'),
            pairedTotalCost: document.getElementById('paired-total-cost'),
            pairedYears: document.getElementById('paired-years'),
            
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
        const bandsStats = dataManager.getBandsStatistics();
        const locationStats = dataManager.getLocationStatistics();
        const years = dataManager.getAvailableYears();
        
        // Animate paired statistics
        this.animateNumber(this.elements.pairedTotalShows, 0, stats.totalShows);
        this.animateNumber(this.elements.pairedTotalEvents, 0, stats.totalEvents);
        this.animateNumber(this.elements.pairedTotalBands, 0, stats.totalUniqueBands);
        this.animateNumber(this.elements.pairedCountries, 0, bandsStats.uniqueCountries);
        this.animateNumber(this.elements.pairedTotalVenues, 0, locationStats.totalVenues);
        this.animateNumber(this.elements.pairedCities, 0, locationStats.totalCities);
        this.animateEuro(this.elements.pairedTotalCost, 0, stats.totalCost);
        this.animateNumber(this.elements.pairedYears, 0, years.length);
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

    // Update events statistics
    updateEventsStatistics() {
        const eventsStats = dataManager.getEventsStatistics();
        
        // Find the events statistics elements (matching HTML IDs)
        const totalEventsElement = document.getElementById('events-total');
        const totalShowsElement = document.getElementById('shows-total');
        const avgEventsPerYearElement = document.getElementById('events-avg-per-year');
        const maxEventsInOneYearElement = document.getElementById('events-max-per-year');
        const avgShowsPerYearElement = document.getElementById('shows-avg-per-year');
        const avgShowsPerEventElement = document.getElementById('shows-avg-per-event');
        const totalConcertsElement = document.getElementById('event-types-concerts');
        const totalFestivalsElement = document.getElementById('event-types-festivals');
        
        // Animate the events statistics
        if (totalEventsElement) {
            this.animateNumber(totalEventsElement, 0, eventsStats.totalEvents);
        }
        if (totalShowsElement) {
            this.animateNumber(totalShowsElement, 0, eventsStats.totalShows);
        }
        if (avgEventsPerYearElement) {
            this.animateNumber(avgEventsPerYearElement, 0, parseFloat(eventsStats.avgEventsPerYear));
        }
        if (maxEventsInOneYearElement) {
            this.animateNumber(maxEventsInOneYearElement, 0, eventsStats.maxEventsInOneYear);
        }
        if (avgShowsPerYearElement) {
            this.animateNumber(avgShowsPerYearElement, 0, parseFloat(eventsStats.avgShowsPerYear));
        }
        if (avgShowsPerEventElement) {
            // Calculate average shows per event
            const avgShowsPerEvent = eventsStats.totalEvents > 0 ? (eventsStats.totalShows / eventsStats.totalEvents).toFixed(1).replace('.', '.') : '0.0';
            this.animateNumber(avgShowsPerEventElement, 0, parseFloat(avgShowsPerEvent));
        }
        if (totalConcertsElement) {
            this.animateNumber(totalConcertsElement, 0, eventsStats.totalConcerts);
        }
        if (totalFestivalsElement) {
            this.animateNumber(totalFestivalsElement, 0, eventsStats.totalFestivals);
        }
        
        // Create the events charts
        chartsManager.createEventsPerYearChartEvents();
        chartsManager.createShowsPerYearChart();
        chartsManager.createEventTypePieChart();
    }

    // Initialize events statistics display
    initializeEventsStatistics() {
        this.updateEventsStatistics();
    }

    // Update artist statistics (moved from router.js)
    updateArtistStatistics(artistId) {
        // Get all concerts for this artist
        const artistConcerts = dataManager.getConcertsByArtist(artistId);
        
        // Calculate total shows (number of concerts this artist appeared in)
        const totalShows = artistConcerts.length;
        
        // Calculate headline shows (concerts only, not festivals, where this artist is listed first)
        const headlineShows = artistConcerts.filter(concert => {
            // Check if this artist is the first in the artistIds array (headliner) AND it's a concert (not festival)
            return concert.type === 'concert' &&
                   concert.artistIds.length > 0 &&
                   concert.artistIds[0] === artistId;
        }).length;
        
        // Update the statistics display with animation
        const totalShowsElement = document.getElementById('artist-total-shows');
        const headlineShowsElement = document.getElementById('artist-headline-shows');
        
        if (totalShowsElement) {
            this.animateNumber(totalShowsElement, 0, totalShows);
        }
        
        if (headlineShowsElement) {
            this.animateNumber(headlineShowsElement, 0, headlineShows);
        }
    }

    // Initialize artist statistics display
    initializeArtistStatistics(artistId) {
        this.updateArtistStatistics(artistId);
    }
}

// Create global instance
const statisticsManager = new StatisticsManager();