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
        
        if (this.routes[route]) {
            this.currentRoute = route;
            this.routes[route]();
        } else {
            console.warn(`Route '${route}' not found, redirecting to dashboard`);
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
        console.log('Cost page loaded');
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