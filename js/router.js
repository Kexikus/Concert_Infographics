// Router - Hash-based routing system
class Router {
    constructor() {
        this.routes = {
            'dashboard': this.showDashboard.bind(this),
            'events': this.showEvents.bind(this),
            'bands': this.showBands.bind(this),
            'locations': this.showLocations.bind(this),
            'cost': this.showCost.bind(this),
            '': this.showDashboard.bind(this) // Default route
        };
        this.currentRoute = '';
        this.init();
    }

    // Initialize router
    init() {
        // Set up hash change listener
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
        
        // Handle initial route
        this.handleRouteChange();
    }
    
    // Handle route changes
    handleRouteChange() {
        const hash = window.location.hash.slice(1); // Remove the # symbol
        const route = hash || 'dashboard'; // Default to dashboard if no hash
        
        // Parse route segments for dynamic routing
        const routeSegments = route.split('/');
        const baseRoute = routeSegments[0];
        const parameter = routeSegments[1];
        
        // Check for exact route match first
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routes[route]();
        }
        // Check for dynamic routes (artist, city, year)
        else if (this.isDynamicRoute(baseRoute) && parameter) {
            this.currentRoute = route;
            this.handleDynamicRoute(baseRoute, parameter);
        }
        // Check for base route match
        else if (this.routes[baseRoute]) {
            this.currentRoute = baseRoute;
            this.routes[baseRoute]();
        }
        else {
            console.warn(`Route '${route}' not found, redirecting to dashboard`);
            this.navigateTo('dashboard');
        }
    }

    // Check if route is dynamic
    isDynamicRoute(route) {
        return ['artist', 'city', 'year'].includes(route);
    }

    // Handle dynamic routes
    handleDynamicRoute(type, parameter) {
        switch (type) {
            case 'artist':
                this.showArtistPage(parameter);
                break;
            case 'city':
                this.showCityPage(parameter);
                break;
            case 'year':
                this.showYearPage(parameter);
                break;
            default:
                console.warn(`Unknown dynamic route type: ${type}`);
                this.navigateTo('dashboard');
        }
    }

    // Show/hide views
    showView(viewId) {
        // Hide all views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
    }

    // Route handlers
    showDashboard() {
        this.showView('dashboard-view');
        
        // Initialize dashboard components if not already done
        if (!chartsManager.areChartsInitialized()) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                statisticsManager.initializeStatistics();
                chartsManager.initializeCharts();
                statisticsManager.addInteractivity();
            }, 100);
        } else {
            // Refresh existing charts and statistics
            statisticsManager.refresh();
            chartsManager.updateCharts();
        }
    }
    
    // Show Events page
    showEvents() {
        this.showView('events-view');
        
        // Initialize events-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            statisticsManager.initializeEventsStatistics();
        }, 100);
        
        console.log('Events page loaded');
    }
    
    // Show Bands page
    showBands() {
        this.showView('bands-view');
        
        // Initialize band-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            statisticsManager.initializeBandsStatistics();
            worldMapManager.initializeWorldMap();
            chartsManager.createBandsPerYearChart();
            chartsManager.createBandFrequencyChart();
            chartsManager.renderOtherArtists();
        }, 100);
        
        console.log('Bands page loaded');
    }
    
    // Show Locations page
    showLocations() {
        this.showView('locations-view');
        
        // Initialize location-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            statisticsManager.initializeLocationStatistics();
            germanMapManager.initializeGermanMap();
            chartsManager.createTopVenuesChart();
            chartsManager.createTopCitiesChart();
            chartsManager.createVenueSizeChart();
        }, 100);
        
        console.log('Locations page loaded');
    }
    
    // Show Cost page
    showCost() {
        this.showView('cost-view');
        
        // Initialize cost-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            statisticsManager.initializeCostStatistics();
        }, 100);
        
        console.log('Cost page loaded');
    }

    // Show Artist page
    showArtistPage(artistId) {
        this.showView('artist-view');
        
        // Find artist data
        const artist = artistsData.find(a => a.id === artistId);
        if (!artist) {
            console.warn(`Artist '${artistId}' not found, redirecting to bands`);
            this.navigateTo('bands');
            return;
        }
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeArtistPage(artist);
        }, 100);
        
        console.log(`Artist page loaded: ${artist.name}`);
    }

    // Initialize artist page with logo and chart
    initializeArtistPage(artist) {
        // Handle logo display
        const logoContainer = document.getElementById('artist-logo-container');
        const logoElement = document.getElementById('artist-logo');
        const titleElement = document.getElementById('artist-title');
        
        if (logoContainer && logoElement && titleElement) {
            // Get artist logo path
            const logoPath = dataManager.getArtistLogo(artist.id);
            
            if (logoPath) {
                // Show logo and hide text title
                logoElement.src = logoPath;
                logoElement.alt = artist.name;
                logoElement.style.display = 'block';
                logoContainer.classList.add('has-logo');
                
                // Handle logo load error - fallback to text
                logoElement.onerror = function() {
                    logoElement.style.display = 'none';
                    logoContainer.classList.remove('has-logo');
                    titleElement.textContent = artist.name;
                };
            } else {
                // No logo available, show text title
                logoElement.style.display = 'none';
                logoContainer.classList.remove('has-logo');
                titleElement.textContent = artist.name;
            }
        }
        
        // Update country information
        this.updateArtistCountryInfo(artist);
        
        // Delegate to component managers
        statisticsManager.initializeArtistStatistics(artist.id);
        chartsManager.createArtistShowsPerYearChart(artist.id);
        chartsManager.createArtistVenueSizeChart(artist.id);
        showDisplayManager.initializeArtistShowDisplays(artist.id);
    }

    // Update artist country information
    updateArtistCountryInfo(artist) {
        const countryElement = document.getElementById('artist-country');
        if (countryElement && artist.country) {
            countryElement.textContent = artist.country;
        }
    }

    // Show City page
    showCityPage(cityName) {
        this.showView('city-view');
        
        // Find city data (check if any venues exist in this city)
        const cityVenues = venuesData.filter(v =>
            v.city.toLowerCase().replace(/\s+/g, '-') === cityName.toLowerCase()
        );
        
        if (cityVenues.length === 0) {
            console.warn(`City '${cityName}' not found, redirecting to locations`);
            this.navigateTo('locations');
            return;
        }
        
        // Get the actual city name from venue data
        const actualCityName = cityVenues[0].city;
        
        // Update page title
        const titleElement = document.getElementById('city-title');
        if (titleElement) {
            titleElement.textContent = actualCityName;
        }
        
        // Initialize city-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            statisticsManager.initializeCityStatistics(cityName);
            chartsManager.createCityEventsPerYearChart(cityName);
            chartsManager.createCityVisitsPerVenueChart(cityName);
            chartsManager.createCityCapacityPerVenueChart(cityName);
            showDisplayManager.initializeCityShowDisplays(actualCityName);
        }, 100);
        
        console.log(`City page loaded: ${actualCityName}`);
    }

    // Show Year page
    showYearPage(year) {
        this.showView('year-view');
        
        // Validate year
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 2010 || yearNum > 2100) {
            console.warn(`Invalid year '${year}', redirecting to events`);
            this.navigateTo('events');
            return;
        }
        
        // Check if any concerts exist for this year
        const yearConcerts = concertsData.filter(c =>
            new Date(c.date).getFullYear() === yearNum
        );
        
        if (yearConcerts.length === 0) {
            console.warn(`No concerts found for year '${year}', redirecting to events`);
            this.navigateTo('events');
            return;
        }
        
        // Update page title
        const titleElement = document.getElementById('year-title');
        if (titleElement) {
            titleElement.textContent = year;
        }
        
        // Initialize year-related components
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeYearPage(yearNum);
        }, 100);
        
        console.log(`Year page loaded: ${year}`);
    }

    // Initialize year page with data filtering and component loading
    initializeYearPage(year) {
        // Initialize year statistics
        statisticsManager.initializeYearStatistics(year);
        
        // Initialize year charts
        chartsManager.createEventsPerMonthChart(year);
        chartsManager.createShowsPerMonthChart(year);
        chartsManager.createYearTopBandsChart(year);
        
        // Initialize year events display
        showDisplayManager.initializeYearShowDisplays(year);
    }

    // Navigate programmatically
    navigateTo(route) {
        window.location.hash = `#${route}`;
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Check if route exists
    routeExists(route) {
        return this.routes.hasOwnProperty(route);
    }

    // Add new route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Remove route
    removeRoute(path) {
        delete this.routes[path];
    }

    // Get all available routes
    getRoutes() {
        return Object.keys(this.routes);
    }

    // Handle browser back/forward buttons
    handlePopState() {
        this.handleRouteChange();
    }
}

// Create global router instance
const router = new Router();

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    router.handlePopState();
});