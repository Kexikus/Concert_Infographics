// Main Application - Entry point and initialization
class ConcertInfographicsApp {
    constructor() {
        this.isInitialized = false;
        this.components = {
            dataManager: null,
            chartsManager: null,
            statisticsManager: null,
            worldMapManager: null,
            germanMapManager: null,
            navigationManager: null,
            router: null
        };
    }

    // Initialize the application
    async init() {
        try {
            console.log('Initializing Concert Infographics Application...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inject CSS custom properties from centralized color configuration
            if (typeof injectCSSProperties === 'function') {
                injectCSSProperties();
            }

            // Initialize components
            this.initializeComponents();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('Application initialized successfully');
            
            // Dispatch custom event for initialization complete
            this.dispatchEvent('app:initialized');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    // Initialize all components
    initializeComponents() {
        // Components are already initialized globally, just store references
        this.components.dataManager = dataManager;
        this.components.chartsManager = chartsManager;
        this.components.statisticsManager = statisticsManager;
        this.components.worldMapManager = worldMapManager;
        this.components.germanMapManager = germanMapManager;
        this.components.navigationManager = navigationManager;
        this.components.router = router;
        
        // Verify all components are available
        const missingComponents = Object.entries(this.components)
            .filter(([name, component]) => !component)
            .map(([name]) => name);
            
        if (missingComponents.length > 0) {
            throw new Error(`Missing components: ${missingComponents.join(', ')}`);
        }
    }

    // Set up global error handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error, 'Global Error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason, 'Unhandled Promise Rejection');
        });
    }

    // Handle initialization errors
    handleInitializationError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error initialization-error';
        const errorMessage = error && error.message ? error.message : 'Unknown initialization error';
        errorContainer.innerHTML = `
            <h3>Application Initialization Failed</h3>
            <p>There was an error starting the application. Please refresh the page and try again.</p>
            <details>
                <summary>Technical Details</summary>
                <pre>${errorMessage}</pre>
            </details>
        `;
        
        document.body.insertBefore(errorContainer, document.body.firstChild);
    }

    // Handle runtime errors
    handleError(error, context = 'Runtime Error') {
        console.error(`${context}:`, error);
        
        // Show user-friendly error message
        const errorMessage = error && error.message ? error.message : 'Unknown error occurred';
        this.showErrorNotification(`${context}: ${errorMessage}`);
    }

    // Show error notification to user
    showErrorNotification(message) {
        // Remove existing error notifications
        const existingErrors = document.querySelectorAll('.error-notification');
        existingErrors.forEach(error => error.remove());
        
        // Create new error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Dispatch custom events
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }

    // Get application status
    getStatus() {
        return {
            initialized: this.isInitialized,
            components: Object.keys(this.components).reduce((status, name) => {
                status[name] = !!this.components[name];
                return status;
            }, {}),
            currentRoute: this.components.router ? this.components.router.getCurrentRoute() : null
        };
    }

    // Refresh application data
    async refresh() {
        try {
            console.log('Refreshing application data...');
            
            if (this.components.statisticsManager) {
                this.components.statisticsManager.refresh();
            }
            
            if (this.components.worldMapManager) {
                this.components.worldMapManager.refresh();
            }
            
            if (this.components.germanMapManager) {
                this.components.germanMapManager.refresh();
            }
            
            console.log('Application data refreshed successfully');
            this.dispatchEvent('app:refreshed');
            
        } catch (error) {
            this.handleError(error, 'Refresh Error');
        }
    }

    // Get component by name
    getComponent(name) {
        return this.components[name];
    }

    // Check if application is ready
    isReady() {
        return this.isInitialized && Object.values(this.components).every(component => !!component);
    }

    // Destroy application (cleanup)
    destroy() {
        try {
            console.log('Destroying application...');
            
            if (this.components.chartsManager) {
                this.components.chartsManager.destroyCharts();
            }
            
            if (this.components.worldMapManager) {
                this.components.worldMapManager.destroy();
            }
            
            if (this.components.germanMapManager) {
                this.components.germanMapManager.destroy();
            }
            
            if (this.components.navigationManager) {
                this.components.navigationManager.destroy();
            }
            
            // Clear component references
            this.components = {};
            this.isInitialized = false;
            
            console.log('Application destroyed successfully');
            this.dispatchEvent('app:destroyed');
            
        } catch (error) {
            console.error('Error during application destruction:', error);
        }
    }
}

// Create global application instance
const app = new ConcertInfographicsApp();

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    app.init();
}

// Make app globally available for debugging
window.concertApp = app;