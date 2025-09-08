// Data Manager - Centralized data management and utility functions
class DataManager {
    constructor() {
        this.concerts = concertsData || [];
        this.artists = artistsData || [];
        this.venues = venuesData || [];
    }

    // Get all concerts
    getConcerts() {
        return this.concerts;
    }

    // Get all artists
    getArtists() {
        return this.artists;
    }

    // Get all venues
    getVenues() {
        return this.venues;
    }

    // Get artist by ID
    getArtistById(id) {
        return this.artists.find(artist => artist.id === id);
    }

    // Get venue by ID
    getVenueById(id) {
        return this.venues.find(venue => venue.id === id);
    }

    // Get concert by ID
    getConcertById(id) {
        return this.concerts.find(concert => concert.id === id);
    }

    // Get concerts by type
    getConcertsByType(type) {
        return this.concerts.filter(concert => concert.type === type);
    }

    // Get concerts by year
    getConcertsByYear(year) {
        return this.concerts.filter(concert => {
            const concertYear = new Date(concert.date).getFullYear();
            return concertYear === year;
        });
    }

    // Get concerts by artist ID
    getConcertsByArtist(artistId) {
        return this.concerts.filter(concert => 
            concert.artistIds.includes(artistId)
        );
    }

    // Get enriched concert data (with artist and venue details)
    getEnrichedConcerts() {
        return this.concerts.map(concert => ({
            ...concert,
            artists: concert.artistIds.map(id => this.getArtistById(id)).filter(Boolean),
            venue: this.getVenueById(concert.venueId)
        }));
    }

    // Get concert statistics
    getStatistics() {
        const totalEvents = this.concerts.length;
        const totalArtists = this.artists.length;
        const totalVenues = this.venues.length;
        
        // Calculate total cost only from concerts with non-null prices
        const concertsWithPrice = this.concerts.filter(concert => concert.price !== null && concert.price !== undefined);
        const totalCost = concertsWithPrice.reduce((sum, concert) => sum + concert.price, 0);
        
        // Get concerts and festivals counts
        const concertTypeStats = this.getConcertTypeStats();
        const totalConcerts = concertTypeStats.concert || 0;
        const totalFestivals = concertTypeStats.festival || 0;
        
        // Calculate years span
        const years = this.getAvailableYears();
        const yearSpan = years.length > 0 ? years.length : 1;
        
        // Calculate total shows (sum of artists per event)
        const totalShows = this.concerts.reduce((sum, concert) => sum + concert.artistIds.length, 0);
        const totalShowsWithPrice = concertsWithPrice.reduce((sum, concert) => sum + concert.artistIds.length, 0);
        
        // Calculate unique artists seen
        const uniqueArtistIds = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => uniqueArtistIds.add(artistId));
        });
        const totalUniqueBands = uniqueArtistIds.size;
        
        // Calculate repeat bands percentage
        const artistFrequency = this.getArtistFrequencyStats();
        const repeatBands = Object.values(artistFrequency).filter(count => count > 1).length;
        const repeatBandsPercentage = totalUniqueBands > 0 ? (repeatBands / totalUniqueBands * 100).toFixed(1) : 0;
        
        // Calculate new bands per year
        const newBandsPerYear = totalUniqueBands / yearSpan;

        // Calculate years with non-zero costs for average per year calculation
        const costPerYearStats = this.getCostPerYearStats();
        const yearsWithCosts = Object.values(costPerYearStats).filter(cost => cost > 0);
        const yearsWithCostsCount = yearsWithCosts.length;

        return {
            // Main statistics
            totalEvents,
            totalUniqueBands,
            totalShows,
            totalCost: Math.round(totalCost),
            
            // Sub-statistics
            totalConcerts,
            totalFestivals,
            avgEventsPerYear: (totalEvents / yearSpan).toFixed(1),
            
            repeatBandsPercentage: repeatBandsPercentage + '%',
            avgBandsPerYear: (totalUniqueBands / yearSpan).toFixed(1),
            avgNewBandsPerYear: newBandsPerYear.toFixed(1),
            
            avgShowsPerYear: (totalShows / yearSpan).toFixed(1),
            avgShowsPerBand: totalUniqueBands > 0 ? (totalShows / totalUniqueBands).toFixed(1) : 0,
            avgShowsPerEvent: totalEvents > 0 ? (totalShows / totalEvents).toFixed(1) : 0,
            
            avgCostPerYear: yearsWithCostsCount > 0 ? Math.round(totalCost / yearsWithCostsCount) : 0,
            avgCostPerEvent: concertsWithPrice.length > 0 ? Math.round(totalCost / concertsWithPrice.length) : 0,
            avgCostPerShow: totalShowsWithPrice > 0 ? Math.round(totalCost / totalShowsWithPrice) : 0
        };
    }

    // Get concerts by type statistics
    getConcertTypeStats() {
        const stats = {};
        this.concerts.forEach(concert => {
            stats[concert.type] = (stats[concert.type] || 0) + 1;
        });
        return stats;
    }

    // Get concerts per year statistics
    getConcertsPerYearStats() {
        const stats = {};
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            stats[year] = (stats[year] || 0) + 1;
        });
        return stats;
    }

    // Get events per year broken down by type (concerts and festivals)
    getEventsPerYearByType() {
        const stats = {};
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            if (!stats[year]) {
                stats[year] = { concert: 0, festival: 0 };
            }
            stats[year][concert.type] = (stats[year][concert.type] || 0) + 1;
        });
        return stats;
    }

    // Get shows per year (total number of artist performances)
    getShowsPerYearStats() {
        const stats = {};
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            const showCount = concert.artistIds.length;
            stats[year] = (stats[year] || 0) + showCount;
        });
        return stats;
    }

    // Get bands per year statistics (total bands seen each year)
    getBandsPerYearStats() {
        const stats = {};
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            if (!stats[year]) {
                stats[year] = new Set();
            }
            // Add all artist IDs from this concert to the year's set
            concert.artistIds.forEach(artistId => {
                stats[year].add(artistId);
            });
        });
        
        // Convert sets to counts
        const result = {};
        Object.keys(stats).forEach(year => {
            result[year] = stats[year].size;
        });
        
        return result;
    }

    // Get first-time bands per year statistics (bands seen for the first time each year)
    getFirstTimeBandsPerYearStats() {
        const stats = {};
        const seenArtists = new Set();
        
        // Sort concerts by date to process chronologically
        const sortedConcerts = [...this.concerts].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedConcerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            if (!stats[year]) {
                stats[year] = 0;
            }
            
            // Check each artist in this concert
            concert.artistIds.forEach(artistId => {
                if (!seenArtists.has(artistId)) {
                    // This is the first time seeing this artist
                    seenArtists.add(artistId);
                    stats[year]++;
                }
            });
        });
        
        return stats;
    }

    // Get artist frequency statistics
    getArtistFrequencyStats() {
        const stats = {};
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => {
                const artist = this.getArtistById(artistId);
                if (artist) {
                    stats[artist.name] = (stats[artist.name] || 0) + 1;
                }
            });
        });
        return stats;
    }

    // Get top artists by frequency
    getTopArtists(limit = 10) {
        const frequencyStats = this.getArtistFrequencyStats();
        return Object.entries(frequencyStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    // Get artists seen at least a minimum number of times
    getFrequentArtists(minCount = 2) {
        const frequencyStats = this.getArtistFrequencyStats();
        
        // Get first appearance info for each artist
        const artistFirstAppearance = {};
        
        // Sort concerts by date to find first appearances
        const sortedConcerts = [...this.concerts].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedConcerts.forEach(concert => {
            concert.artistIds.forEach((artistId, index) => {
                const artist = this.getArtistById(artistId);
                if (artist && !artistFirstAppearance[artist.name]) {
                    artistFirstAppearance[artist.name] = {
                        date: new Date(concert.date),
                        orderInEvent: index
                    };
                }
            });
        });
        
        return Object.entries(frequencyStats)
            .filter(([name, count]) => count >= minCount)
            .sort(([nameA, countA], [nameB, countB]) => {
                // First sort by count (descending)
                if (countA !== countB) {
                    return countB - countA;
                }
                
                // If counts are equal, sort by first appearance date (ascending)
                const firstA = artistFirstAppearance[nameA];
                const firstB = artistFirstAppearance[nameB];
                
                if (firstA && firstB) {
                    const dateComparison = firstA.date - firstB.date;
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    
                    // If same date, sort by order in event (ascending)
                    return firstA.orderInEvent - firstB.orderInEvent;
                }
                
                return 0;
            })
            .map(([name, count]) => {
                // Find the artist object to get additional info like ID and logo
                const artist = this.artists.find(a => a.name === name);
                return {
                    name,
                    count,
                    id: artist ? artist.id : null,
                    logo: artist ? this.getArtistLogo(artist.id) : null
                };
            });
    }

    // Get artist logo with automatic path prepending and multi-logo support
    getArtistLogo(artistId, concertDate = null) {
        const artist = this.getArtistById(artistId);
        if (!artist || !artist.logo) return null;

        let logoPath = '';

        if (typeof artist.logo === 'string') {
            // Backward compatibility: Simple string logo
            logoPath = artist.logo;
        } else if (Array.isArray(artist.logo)) {
            // New multi-logo format: array of {filename, from} objects
            logoPath = this.selectLogoFromArray(artist.logo, concertDate);
        }

        // Automatically prepend assets/images/ path
        return logoPath ? `assets/images/${logoPath}` : null;
    }

    // Select appropriate logo from multi-logo array based on date
    selectLogoFromArray(logoArray, concertDate = null) {
        if (!Array.isArray(logoArray) || logoArray.length === 0) {
            return '';
        }

        if (concertDate) {
            // Find logo applicable for the specific concert date
            const concertDateObj = new Date(concertDate);
            
            // Find the logo that was active at the concert date
            // We want the most recent logo that started before or on the concert date
            let applicableLogo = null;
            
            for (const logo of logoArray) {
                if (logo.from === null) {
                    // Original logo - always a candidate
                    if (!applicableLogo) {
                        applicableLogo = logo;
                    }
                } else {
                    const logoStartDate = new Date(logo.from);
                    // If this logo started before or on the concert date
                    if (concertDateObj >= logoStartDate) {
                        // If we don't have an applicable logo yet, or this one is more recent
                        if (!applicableLogo ||
                            (applicableLogo.from === null) ||
                            (new Date(logo.from) > new Date(applicableLogo.from))) {
                            applicableLogo = logo;
                        }
                    }
                }
            }

            return applicableLogo ? applicableLogo.filename : logoArray[0].filename;
        } else {
            // Return current logo (most recent one or the one with from: null)
            // For current logo, we want the most recent logo available
            let currentLogo = null;
            
            for (const logo of logoArray) {
                if (logo.from === null) {
                    // Original logo - only use if no dated logo exists
                    if (!currentLogo) {
                        currentLogo = logo;
                    }
                } else {
                    // Dated logo - use the most recent one
                    if (!currentLogo ||
                        (currentLogo.from === null) ||
                        (new Date(logo.from) > new Date(currentLogo.from))) {
                        currentLogo = logo;
                    }
                }
            }
            
            return currentLogo ? currentLogo.filename : logoArray[0].filename;
        }
    }

    // Get all logos for an artist (for admin interface)
    getArtistLogos(artistId) {
        const artist = this.getArtistById(artistId);
        if (!artist || !artist.logo) return [];

        if (typeof artist.logo === 'string') {
            return [{
                filename: artist.logo,
                from: null,
                fullPath: `assets/images/${artist.logo}`,
                isCurrent: true,
                isOriginal: true
            }];
        }

        if (Array.isArray(artist.logo)) {
            return artist.logo.map(logo => ({
                ...logo,
                fullPath: `assets/images/${logo.filename}`,
                isCurrent: logo.from === null,
                isOriginal: logo.from === null
            })).sort((a, b) => {
                // Sort: original first, then by date
                if (a.from === null) return -1;
                if (b.from === null) return 1;
                return new Date(a.from) - new Date(b.from);
            });
        }

        return [];
    }

    // Check if artist has multiple logos
    hasMultipleLogos(artistId) {
        const artist = this.getArtistById(artistId);
        return artist && Array.isArray(artist.logo) && artist.logo.length > 1;
    }

    // Get concert logo with automatic path prepending
    getConcertLogo(concertId) {
        const concert = this.getConcertById(concertId);
        if (!concert || !concert.logo) return null;

        // Automatically prepend assets/images/ path
        return `assets/images/${concert.logo}`;
    }

    // Get venue coordinates for mapping
    getVenueCoordinates() {
        return this.venues.map(venue => ({
            id: venue.id,
            name: venue.name,
            city: venue.city,
            country: venue.country,
            latitude: venue.latitude,
            longitude: venue.longitude,
            concertCount: this.concerts.filter(concert => concert.venueId === venue.id).length
        }));
    }

    // Search functionality
    searchConcerts(query) {
        const lowerQuery = query.toLowerCase();
        return this.getEnrichedConcerts().filter(concert => 
            concert.name.toLowerCase().includes(lowerQuery) ||
            concert.artists.some(artist => artist.name.toLowerCase().includes(lowerQuery)) ||
            concert.venue.name.toLowerCase().includes(lowerQuery) ||
            concert.venue.city.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter concerts by date range
    getConcertsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.concerts.filter(concert => {
            const concertDate = new Date(concert.date);
            return concertDate >= start && concertDate <= end;
        });
    }

    // Get unique years from concerts
    getAvailableYears() {
        const years = [...new Set(this.concerts.map(concert => 
            new Date(concert.date).getFullYear()
        ))];
        return years.sort((a, b) => a - b);
    }

    // Get unique countries from venues
    getAvailableCountries() {
        const countries = [...new Set(this.venues.map(venue => venue.country))];
        return countries.sort();
    }

    // Get other artists (not in frequent artists list)
    getOtherArtists() {
        // Get all unique artists
        const allArtists = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => {
                const artist = this.getArtistById(artistId);
                if (artist) {
                    allArtists.add(artist.name);
                }
            });
        });

        // Get frequent artists (seen at least twice)
        const frequentArtists = new Set(
            this.getFrequentArtists(2).map(item => item.name)
        );

        // Filter out frequent artists and sort alphabetically
        return Array.from(allArtists)
            .filter(artistName => !frequentArtists.has(artistName))
            .sort((a, b) => a.localeCompare(b))
            .map(artistName => {
                // Find the artist object to get additional info like ID and logo
                const artist = this.artists.find(a => a.name === artistName);
                return {
                    name: artistName,
                    id: artist ? artist.id : null,
                    logo: artist ? this.getArtistLogo(artist.id) : null
                };
            });
    }

    // Get country band statistics for world map based on artist origins
    getCountryBandStats() {
        const countryStats = {};
        
        // Country name mapping from artist data to world map names
        const countryNameMap = {
            'USA': 'United States',
            'UK': 'United Kingdom',
            'Australia': 'Australia',
            'Germany': 'Germany',
            'France': 'France',
            'Norway': 'Norway',
            'Canada': 'Canada',
            'Brazil': 'Brazil',
            'Japan': 'Japan',
            'Italy': 'Italy',
            'Spain': 'Spain',
            'Netherlands': 'Netherlands',
            'Belgium': 'Belgium',
            'Sweden': 'Sweden',
            'Denmark': 'Denmark',
            'Finland': 'Finland',
            'Austria': 'Austria',
            'Switzerland': 'Switzerland',
            'Portugal': 'Portugal',
            'Ireland': 'Ireland',
            'Poland': 'Poland',
            'Czech Republic': 'Czech Republic',
            'Hungary': 'Hungary',
            'Greece': 'Greece',
            'Turkey': 'Turkey',
            'Russia': 'Russian Federation',
            'China': 'China',
            'India': 'India',
            'South Korea': 'Republic of Korea',
            'Mexico': 'Mexico',
            'Argentina': 'Argentina',
            'Chile': 'Chile',
            'Colombia': 'Colombia',
            'Peru': 'Peru',
            'Venezuela': 'Venezuela',
            'South Africa': 'South Africa',
            'Egypt': 'Egypt',
            'Morocco': 'Morocco',
            'Nigeria': 'Nigeria',
            'Kenya': 'Kenya',
            'New Zealand': 'New Zealand',
            'Thailand': 'Thailand',
            'Malaysia': 'Malaysia',
            'Singapore': 'Singapore',
            'Indonesia': 'Indonesia',
            'Philippines': 'Philippines',
            'Vietnam': 'Vietnam'
        };
        
        // Get all artists that have been seen in concerts
        const seenArtistIds = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => {
                seenArtistIds.add(artistId);
            });
        });
        
        // Count bands by their origin country (only those that have been seen)
        this.artists.forEach(artist => {
            if (seenArtistIds.has(artist.id)) {
                const artistCountry = artist.country;
                const mappedCountry = countryNameMap[artistCountry] || artistCountry;
                
                if (!countryStats[mappedCountry]) {
                    countryStats[mappedCountry] = 0;
                }
                countryStats[mappedCountry]++;
            }
        });
        
        return countryStats;
    }

    // Get artists by country (based on artist origin)
    getArtistsByCountry(countryName) {
        // Reverse country name mapping for lookup
        const reverseCountryNameMap = {
            'United States': 'USA',
            'United Kingdom': 'UK',
            'Australia': 'Australia',
            'Germany': 'Germany',
            'France': 'France',
            'Norway': 'Norway',
            'Canada': 'Canada',
            'Brazil': 'Brazil',
            'Japan': 'Japan',
            'Italy': 'Italy',
            'Spain': 'Spain',
            'Netherlands': 'Netherlands',
            'Belgium': 'Belgium',
            'Sweden': 'Sweden',
            'Denmark': 'Denmark',
            'Finland': 'Finland',
            'Austria': 'Austria',
            'Switzerland': 'Switzerland',
            'Portugal': 'Portugal',
            'Ireland': 'Ireland',
            'Poland': 'Poland',
            'Czech Republic': 'Czech Republic',
            'Hungary': 'Hungary',
            'Greece': 'Greece',
            'Turkey': 'Turkey',
            'Russian Federation': 'Russia',
            'China': 'China',
            'India': 'India',
            'Republic of Korea': 'South Korea',
            'Mexico': 'Mexico',
            'Argentina': 'Argentina',
            'Chile': 'Chile',
            'Colombia': 'Colombia',
            'Peru': 'Peru',
            'Venezuela': 'Venezuela',
            'South Africa': 'South Africa',
            'Egypt': 'Egypt',
            'Morocco': 'Morocco',
            'Nigeria': 'Nigeria',
            'Kenya': 'Kenya',
            'New Zealand': 'New Zealand',
            'Thailand': 'Thailand',
            'Malaysia': 'Malaysia',
            'Singapore': 'Singapore',
            'Indonesia': 'Indonesia',
            'Philippines': 'Philippines',
            'Vietnam': 'Vietnam'
        };
        
        const artistCountryName = reverseCountryNameMap[countryName] || countryName;
        
        // Get all artists that have been seen in concerts
        const seenArtistIds = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => {
                seenArtistIds.add(artistId);
            });
        });
        
        // Filter artists by their origin country (only those that have been seen)
        return this.artists.filter(artist =>
            artist.country === artistCountryName && seenArtistIds.has(artist.id)
        );
    }

    // Get concerts by country
    getConcertsByCountry(countryName) {
        const venues = this.getVenues().filter(venue => venue.country === countryName);
        const venueIds = venues.map(venue => venue.id);
        
        return this.concerts.filter(concert => venueIds.includes(concert.venueId));
    }

    // Get country statistics (venues, concerts, artists)
    getCountryStatistics(countryName) {
        const venues = this.getVenues().filter(venue => venue.country === countryName);
        const concerts = this.getConcertsByCountry(countryName);
        const artists = this.getArtistsByCountry(countryName);
        
        return {
            country: countryName,
            venueCount: venues.length,
            concertCount: concerts.length,
            artistCount: artists.length,
            venues: venues,
            concerts: concerts,
            artists: artists
        };
    }

    // Get all countries with statistics
    getAllCountryStatistics() {
        const countries = this.getAvailableCountries();
        return countries.map(country => this.getCountryStatistics(country));
    }

    // Get bands statistics for the bands view
    getBandsStatistics() {
        const stats = this.getStatistics();
        const years = this.getAvailableYears();
        const yearSpan = years.length > 0 ? years.length : 1;
        
        // Calculate unique artists seen
        const uniqueArtistIds = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => uniqueArtistIds.add(artistId));
        });
        const totalUniqueBands = uniqueArtistIds.size;
        
        // Calculate average bands per year with period as decimal point
        const avgBandsPerYear = (totalUniqueBands / yearSpan).toFixed(1).replace('.', '.');
        
        // Calculate percentage of bands seen at least twice (rounded to integer)
        const artistFrequency = this.getArtistFrequencyStats();
        const bandsSeenAtLeastTwice = Object.values(artistFrequency).filter(count => count >= 2).length;
        const percentageAtLeastTwice = totalUniqueBands > 0 ?
            Math.round((bandsSeenAtLeastTwice / totalUniqueBands) * 100) : 0;
        
        // Calculate shows per band (average number of shows per unique band)
        const totalShows = this.concerts.reduce((sum, concert) => sum + concert.artistIds.length, 0);
        const showsPerBand = totalUniqueBands > 0 ? (totalShows / totalUniqueBands).toFixed(1) : '0.0';
        
        // Calculate unique countries (countries of origin for seen bands)
        const seenArtistIds = new Set();
        this.concerts.forEach(concert => {
            concert.artistIds.forEach(artistId => seenArtistIds.add(artistId));
        });
        
        const countries = new Set();
        this.artists.forEach(artist => {
            if (seenArtistIds.has(artist.id)) {
                countries.add(artist.country);
            }
        });
        const uniqueCountries = countries.size;
        
        return {
            avgBandsPerYear: avgBandsPerYear,
            totalBands: totalUniqueBands,
            percentageAtLeastTwice: percentageAtLeastTwice + '%',
            showsPerBand: showsPerBand,
            uniqueCountries: uniqueCountries
        };
    }

    // Get location statistics for the locations view
    getLocationStatistics() {
        // Calculate unique venues
        const uniqueVenueIds = new Set();
        this.concerts.forEach(concert => {
            uniqueVenueIds.add(concert.venueId);
        });
        const totalVenues = uniqueVenueIds.size;
        
        // Calculate unique cities
        const uniqueCities = new Set();
        this.concerts.forEach(concert => {
            const venue = this.getVenueById(concert.venueId);
            if (venue) {
                uniqueCities.add(venue.city);
            }
        });
        const totalCities = uniqueCities.size;
        
        // Calculate venue frequency (events per venue)
        const venueFrequency = {};
        this.concerts.forEach(concert => {
            const venue = this.getVenueById(concert.venueId);
            if (venue) {
                venueFrequency[venue.name] = (venueFrequency[venue.name] || 0) + 1;
            }
        });
        
        // Get top 3 venues by event count
        const topVenues = Object.entries(venueFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));
        
        // Calculate city frequency (events per city)
        const cityFrequency = {};
        this.concerts.forEach(concert => {
            const venue = this.getVenueById(concert.venueId);
            if (venue) {
                cityFrequency[venue.city] = (cityFrequency[venue.city] || 0) + 1;
            }
        });
        
        // Get top 3 cities by event count
        const topCities = Object.entries(cityFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));
        
        return {
            totalVenues: totalVenues,
            totalCities: totalCities,
            topVenues: topVenues,
            topCities: topCities
        };
    }

    // Get average venue size per year statistics
    getAverageVenueSizePerYear() {
        const yearStats = {};
        
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            const venue = this.getVenueById(concert.venueId);
            
            if (venue && venue.capacity) {
                if (!yearStats[year]) {
                    yearStats[year] = {
                        overall: [],
                        concert: [],
                        festival: []
                    };
                }
                
                // Add venue capacity to overall and type-specific arrays
                yearStats[year].overall.push(venue.capacity);
                yearStats[year][concert.type].push(venue.capacity);
            }
        });
        
        // Calculate averages for each year
        const result = {};
        Object.keys(yearStats).forEach(year => {
            result[year] = {
                overall: yearStats[year].overall.length > 0 ?
                    Math.round(yearStats[year].overall.reduce((sum, cap) => sum + cap, 0) / yearStats[year].overall.length) : 0,
                concert: yearStats[year].concert.length > 0 ?
                    Math.round(yearStats[year].concert.reduce((sum, cap) => sum + cap, 0) / yearStats[year].concert.length) : 0,
                festival: yearStats[year].festival.length > 0 ?
                    Math.round(yearStats[year].festival.reduce((sum, cap) => sum + cap, 0) / yearStats[year].festival.length) : 0
            };
        });
        
        return result;
    }

    // Get cost statistics for the costs view
    getCostStatistics() {
        const stats = this.getStatistics();
        const years = this.getAvailableYears();
        const yearSpan = years.length > 0 ? years.length : 1;
        
        return {
            totalCost: stats.totalCost,
            avgCostPerYear: stats.avgCostPerYear,
            avgCostPerEvent: stats.avgCostPerEvent,
            avgCostPerShow: stats.avgCostPerShow
        };
    }

    // Get cost per year statistics
    getCostPerYearStats() {
        const stats = {};
        
        // Initialize all years with 0
        const allYears = this.getAvailableYears();
        allYears.forEach(year => {
            stats[year] = 0;
        });
        
        // Add costs for concerts with non-null prices
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            if (concert.price !== null && concert.price !== undefined) {
                const price = concert.price;
                stats[year] = (stats[year] || 0) + price;
            }
        });
        
        // Round all values to integers
        Object.keys(stats).forEach(year => {
            stats[year] = Math.round(stats[year]);
        });
        
        return stats;
    }

    // Get average cost per show by year and type (cost per event, not per artist)
    getAverageCostPerShowByYear() {
        const yearStats = {};
        
        // Initialize all years with empty arrays
        const allYears = this.getAvailableYears();
        allYears.forEach(year => {
            yearStats[year] = {
                overall: [],
                concert: [],
                festival: []
            };
        });
        
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            
            // Only process concerts with non-null prices
            if (concert.price !== null && concert.price !== undefined) {
                const price = concert.price;
                
                // Add event cost to overall and type-specific arrays (not divided by artist count)
                yearStats[year].overall.push(price);
                yearStats[year][concert.type].push(price);
            }
        });
        
        // Calculate averages for each year and round to integers
        const result = {};
        allYears.forEach(year => {
            result[year] = {
                overall: yearStats[year].overall.length > 0 ?
                    Math.round(yearStats[year].overall.reduce((sum, cost) => sum + cost, 0) / yearStats[year].overall.length) : null,
                concert: yearStats[year].concert.length > 0 ?
                    Math.round(yearStats[year].concert.reduce((sum, cost) => sum + cost, 0) / yearStats[year].concert.length) : null,
                festival: yearStats[year].festival.length > 0 ?
                    Math.round(yearStats[year].festival.reduce((sum, cost) => sum + cost, 0) / yearStats[year].festival.length) : null
            };
        });
        
        return result;
    }

    // Get events statistics for the events view
    getEventsStatistics() {
        const years = this.getAvailableYears();
        const yearSpan = years.length > 0 ? years.length : 1;
        
        // Calculate total events (concerts and festivals)
        const totalEvents = this.concerts.length;
        
        // Calculate total shows (sum of artistIds.length for each concert)
        const totalShows = this.concerts.reduce((sum, concert) => sum + concert.artistIds.length, 0);
        
        // Calculate events per year statistics
        const eventsPerYearStats = this.getConcertsPerYearStats();
        const maxEventsInOneYear = Math.max(...Object.values(eventsPerYearStats));
        const avgEventsPerYear = (totalEvents / yearSpan).toFixed(1).replace('.', '.');
        
        // Calculate shows per year statistics
        const showsPerYearStats = this.getShowsPerYearStats();
        const maxShowsInOneYear = Math.max(...Object.values(showsPerYearStats));
        const avgShowsPerYear = (totalShows / yearSpan).toFixed(1).replace('.', '.');
        
        // Get event type breakdown
        const eventTypeStats = this.getConcertTypeStats();
        const totalConcerts = eventTypeStats.concert || 0;
        const totalFestivals = eventTypeStats.festival || 0;
        
        return {
            totalEvents,
            totalShows,
            avgEventsPerYear,
            maxEventsInOneYear,
            avgShowsPerYear,
            maxShowsInOneYear,
            totalConcerts,
            totalFestivals
        };
    }

    // Get average venue size per year statistics for a specific artist
    getArtistVenueSizePerYear(artistId) {
        // Get all concerts for this artist
        const artistConcerts = this.getConcertsByArtist(artistId);
        
        const yearStats = {};
        
        artistConcerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            const venue = this.getVenueById(concert.venueId);
            
            if (venue && venue.capacity !== null && venue.capacity !== undefined) {
                if (!yearStats[year]) {
                    yearStats[year] = {
                        allShows: [],
                        concertsOnly: [],
                        headlineShows: []
                    };
                }
                
                // All shows where this artist appeared
                yearStats[year].allShows.push(venue.capacity);
                
                // Concerts only (not festivals)
                if (concert.type === 'concert') {
                    yearStats[year].concertsOnly.push(venue.capacity);
                    
                    // Headline shows (concerts where this artist is listed first)
                    if (concert.artistIds.length > 0 && concert.artistIds[0] === artistId) {
                        yearStats[year].headlineShows.push(venue.capacity);
                    }
                }
            }
        });
        
        // Calculate averages for each year
        const result = {};
        Object.keys(yearStats).forEach(year => {
            result[year] = {
                allShows: yearStats[year].allShows.length > 0 ?
                    Math.round(yearStats[year].allShows.reduce((sum, cap) => sum + cap, 0) / yearStats[year].allShows.length) : null,
                concertsOnly: yearStats[year].concertsOnly.length > 0 ?
                    Math.round(yearStats[year].concertsOnly.reduce((sum, cap) => sum + cap, 0) / yearStats[year].concertsOnly.length) : null,
                headlineShows: yearStats[year].headlineShows.length > 0 ?
                    Math.round(yearStats[year].headlineShows.reduce((sum, cap) => sum + cap, 0) / yearStats[year].headlineShows.length) : null
            };
        });
        
        return result;
    }

    // Get events per year statistics (concerts only, no shows)
    getEventsPerYearStatsEvents() {
        const stats = {};
        this.concerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            stats[year] = (stats[year] || 0) + 1;
        });
        return stats;
    }

    // Get event type pie chart data
    getEventTypePieData() {
        const typeStats = this.getConcertTypeStats();
        return [
            {
                label: 'Festivals',
                value: typeStats.festival || 0,
                color: '#dc3545' // red
            },
            {
                label: 'Concerts',
                value: typeStats.concert || 0,
                color: '#a71e2a' // darkRed
            }
        ];
    }
}

// Utility function to normalize strings for ID generation
// Converts German umlauts and other diacritics to ASCII equivalents
// and formats the string as kebab-case for use as IDs
function normalizeStringForId(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    
    // Define character mappings for diacritics and special characters
    const charMap = {
        // German umlauts (lowercase)
        'ä': 'ae',
        'ö': 'oe',
        'ü': 'ue',
        'ß': 'ss',
        
        // German umlauts (uppercase)
        'Ä': 'Ae',
        'Ö': 'Oe',
        'Ü': 'Ue',
        
        // Common diacritics (lowercase)
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'å': 'a', 'æ': 'ae',
        'ç': 'c',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ñ': 'n',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ø': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u',
        'ý': 'y', 'ÿ': 'y',
        
        // Common diacritics (uppercase)
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Å': 'A', 'Æ': 'Ae',
        'Ç': 'C',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ñ': 'N',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ø': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U',
        'Ý': 'Y', 'Ÿ': 'Y',
        
        // Additional European characters
        'š': 's', 'Š': 'S',
        'ž': 'z', 'Ž': 'Z',
        'č': 'c', 'Č': 'C',
        'ř': 'r', 'Ř': 'R',
        'ď': 'd', 'Ď': 'D',
        'ť': 't', 'Ť': 'T',
        'ň': 'n', 'Ň': 'N',
        'ľ': 'l', 'Ľ': 'L',
        'ĺ': 'l', 'Ĺ': 'L',
        'ŕ': 'r', 'Ŕ': 'R',
        
        // Polish characters
        'ą': 'a', 'Ą': 'A',
        'ć': 'c', 'Ć': 'C',
        'ę': 'e', 'Ę': 'E',
        'ł': 'l', 'Ł': 'L',
        'ń': 'n', 'Ń': 'N',
        'ś': 's', 'Ś': 'S',
        'ź': 'z', 'Ź': 'Z',
        'ż': 'z', 'Ż': 'Z'
    };
    
    // Replace special characters with their ASCII equivalents
    let normalized = str;
    for (const [char, replacement] of Object.entries(charMap)) {
        normalized = normalized.replace(new RegExp(char, 'g'), replacement);
    }
    
    // Convert to lowercase and create kebab-case
    return normalized
        .toLowerCase()                    // Convert to lowercase
        .trim()                          // Remove leading/trailing whitespace
        .replace(/[^a-z0-9\s-]/g, '')   // Remove non-alphanumeric chars (except spaces and hyphens)
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens
}

// Create global instance
const dataManager = new DataManager();