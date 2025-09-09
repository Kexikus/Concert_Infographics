// Navigation Manager - Handles navigation bar functionality
class NavigationManager {
    constructor() {
        this.nav = null;
        this.navToggle = null;
        this.navMenu = null;
        this.navLinks = [];
        this.currentRoute = '';
        this.isInitialized = false;
    }

    // Initialize navigation
    init() {
        try {
            // Get navigation elements
            this.nav = document.getElementById('main-nav');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.querySelector('.nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');

            if (!this.nav) {
                console.warn('Navigation element not found');
                return;
            }

            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize navigation state
            this.updateNavigationState();
            
            this.isInitialized = true;
            console.log('Navigation initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize navigation:', error);
        }
    }

    // Set up event listeners
    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e, link);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!this.nav.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Listen for route changes
        window.addEventListener('hashchange', () => {
            this.updateNavigationState();
        });
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        if (!this.navToggle || !this.navMenu) return;

        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    // Open mobile menu
    openMobileMenu() {
        if (!this.navToggle || !this.navMenu || !this.nav) return;

        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        this.nav.classList.add('nav-open');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    // Close mobile menu
    closeMobileMenu() {
        if (!this.navToggle || !this.navMenu || !this.nav) return;

        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.nav.classList.remove('nav-open');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    // Handle navigation link clicks
    handleNavLinkClick(e, link) {
        // Close mobile menu if open
        this.closeMobileMenu();
        
        // Update active state
        this.setActiveLink(link);
    }

    // Set active navigation link
    setActiveLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Handle window resize
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // Update navigation state based on current route
    updateNavigationState() {
        const hash = window.location.hash.slice(1); // Remove the # symbol
        const route = hash || 'dashboard'; // Default to dashboard if no hash
        
        // Parse route segments for dynamic routing
        const routeSegments = route.split('/');
        const baseRoute = routeSegments[0];
        
        this.currentRoute = baseRoute;
        
        // Show/hide navigation based on route
        this.toggleNavigationVisibility();
        
        // Update active link
        this.updateActiveLink();
    }

    // Toggle navigation visibility based on current route
    toggleNavigationVisibility() {
        if (!this.nav) return;

        // Hide navigation on dashboard, show on all other pages
        if (this.currentRoute === 'dashboard' || this.currentRoute === '') {
            this.nav.classList.add('hidden');
        } else {
            this.nav.classList.remove('hidden');
        }
    }

    // Update active navigation link based on current route
    updateActiveLink() {
        // Find the link that matches the current route
        let activeLink = null;
        
        this.navLinks.forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === this.currentRoute) {
                activeLink = link;
            }
        });
        
        this.setActiveLink(activeLink);
    }

    // Show navigation (for programmatic control)
    show() {
        if (this.nav) {
            this.nav.classList.remove('hidden');
        }
    }

    // Hide navigation (for programmatic control)
    hide() {
        if (this.nav) {
            this.nav.classList.add('hidden');
        }
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Check if navigation is visible
    isVisible() {
        return this.nav && !this.nav.classList.contains('hidden');
    }

    // Refresh navigation state
    refresh() {
        this.updateNavigationState();
    }

    // Destroy navigation (cleanup)
    destroy() {
        try {
            // Remove event listeners
            if (this.navToggle) {
                this.navToggle.removeEventListener('click', this.toggleMobileMenu);
            }
            
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.handleNavLinkClick);
            });
            
            // Clear references
            this.nav = null;
            this.navToggle = null;
            this.navMenu = null;
            this.navLinks = [];
            this.isInitialized = false;
            
            console.log('Navigation destroyed successfully');
            
        } catch (error) {
            console.error('Error during navigation destruction:', error);
        }
    }
}

// Create global navigation manager instance
const navigationManager = new NavigationManager();

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navigationManager.init();
    });
} else {
    navigationManager.init();
}

// Make navigation manager globally available
window.navigationManager = navigationManager;