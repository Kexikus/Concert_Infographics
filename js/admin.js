/**
 * Concert Data Admin Interface
 * Comprehensive functionality for managing artists, venues, and concerts
 * 
 * Features:
 * - Tab navigation system
 * - Artist management (CRUD operations)
 * - Form validation and error handling
 * - Modal management for editing
 * - Search and filter functionality
 * - Data export capabilities
 */

class AdminManager {
    constructor() {
        // In-memory copies of data for editing
        this.artists = [...artistsData];
        this.venues = [...venuesData];
        this.concerts = [...concertsData];
        
        // Current editing state
        this.currentEditingItem = null;
        this.currentEditingType = null;
        
        // Search debounce timer
        this.searchTimer = null;
        
        // Initialize the admin interface
        this.init();
    }

    /**
     * Initialize the admin interface
     */
    init() {
        this.setupEventListeners();
        this.showSection('artists'); // Show artists section by default
        this.loadArtistsList();
        this.initializeMultiLogoInterface(); // Initialize multi-logo interface
        // this.updateDatabaseStats(); // Remove this call for now since method doesn't exist
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form submissions
        document.getElementById('artist-form').addEventListener('submit', (e) => this.handleArtistSubmit(e));
        document.getElementById('venue-form').addEventListener('submit', (e) => this.handleVenueSubmit(e));
        document.getElementById('concert-form').addEventListener('submit', (e) => this.handleConcertSubmit(e));
        
        // Search inputs with debouncing
        document.getElementById('artist-search').addEventListener('input', (e) => this.debounceSearch('artists', e.target.value));
        document.getElementById('venue-search').addEventListener('input', (e) => this.debounceSearch('venues', e.target.value));
        document.getElementById('concert-search').addEventListener('input', (e) => this.debounceSearch('concerts', e.target.value));
        
        // Auto-generate ID from name
        document.getElementById('artist-name').addEventListener('input', (e) => this.autoGenerateId('artist', e.target.value));
        document.getElementById('venue-name').addEventListener('input', (e) => this.autoGenerateId('venue', e.target.value));
        document.getElementById('concert-name').addEventListener('input', (e) => this.autoGenerateId('concert', e.target.value));
        
        // Multi-logo interface
        document.getElementById('add-logo-btn').addEventListener('click', () => this.addLogoRow());
        
        // Modal close events
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('confirm-no').addEventListener('click', () => this.closeConfirmModal());
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeConfirmModal();
            }
        });
    }

    /**
     * Show specific admin section
     * @param {string} sectionName - Name of section to show
     */
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected section
        const section = document.getElementById(`${sectionName}-section`);
        if (section) {
            section.style.display = 'block';
        }
        
        // Add active class to the corresponding nav button
        const navButton = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (navButton) {
            navButton.classList.add('active');
        }
        
        // Load data for the section
        switch (sectionName) {
            case 'artists':
                this.loadArtistsList();
                break;
            case 'venues':
                this.loadVenuesList();
                break;
            case 'concerts':
                this.loadConcertsList();
                this.populateConcertFormSelects();
                break;
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Parse comma-separated coordinates string into latitude and longitude
     * @param {string} coordinatesStr - Coordinates string in format "latitude, longitude"
     * @returns {Object} Object with latitude and longitude properties, or null if invalid
     */
    parseCoordinates(coordinatesStr) {
        if (!coordinatesStr || typeof coordinatesStr !== 'string') {
            return null;
        }
        
        // Clean and split the coordinates string
        const parts = coordinatesStr.trim().split(',');
        if (parts.length !== 2) {
            return null;
        }
        
        // Parse latitude and longitude
        const latitude = parseFloat(parts[0].trim());
        const longitude = parseFloat(parts[1].trim());
        
        // Validate the parsed values
        if (isNaN(latitude) || isNaN(longitude)) {
            return null;
        }
        
        // Validate coordinate ranges
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return null;
        }
        
        return {
            latitude: latitude,
            longitude: longitude
        };
    }

    /**
     * Generate unique ID from name (kebab-case)
     * @param {string} name - Name to convert to ID
     * @returns {string} Generated ID
     */
    generateIdFromName(name) {
        return normalizeStringForId(name);
    }

    /**
     * Auto-generate ID from name input
     * @param {string} type - Type of form (artist, venue, concert)
     * @param {string} name - Name value
     */
    autoGenerateId(type, name) {
        const idField = document.getElementById(`${type}-id`);
        if (idField && name.trim()) {
            const generatedId = this.generateIdFromName(name);
            idField.value = generatedId;
        }
    }

    /**
     * Validate form data
     * @param {Object} data - Form data to validate
     * @param {string} type - Type of data (artist, venue, concert)
     * @returns {Object} Validation result
     */
    validateFormData(data, type) {
        const errors = [];
        
        switch (type) {
            case 'artist':
                if (!data.id || data.id.trim() === '') {
                    errors.push('ID is required');
                }
                if (!data.name || data.name.trim() === '') {
                    errors.push('Name is required');
                }
                if (!data.country || data.country.trim() === '') {
                    errors.push('Country is required');
                }
                
                // Validate logos if present
                if (data.logo && Array.isArray(data.logo)) {
                    const logoValidation = this.validateLogos(data.logo);
                    if (!logoValidation.isValid) {
                        errors.push(...logoValidation.errors);
                    }
                }
                
                // Check for duplicate ID (excluding current editing item)
                const existingArtist = this.artists.find(a => a.id === data.id);
                if (existingArtist && (!this.currentEditingItem || this.currentEditingItem.id !== data.id)) {
                    errors.push('An artist with this ID already exists');
                }
                break;
                
            case 'venue':
                if (!data.id || data.id.trim() === '') {
                    errors.push('ID is required');
                }
                if (!data.name || data.name.trim() === '') {
                    errors.push('Name is required');
                }
                if (!data.city || data.city.trim() === '') {
                    errors.push('City is required');
                }
                if (!data.country || data.country.trim() === '') {
                    errors.push('Country is required');
                }
                // Validate coordinates - they should already be parsed in handleVenueSubmit
                if (data.latitude === null || data.latitude === undefined) {
                    errors.push('Valid coordinates are required (format: latitude, longitude)');
                } else {
                    const lat = parseFloat(data.latitude);
                    if (isNaN(lat) || lat < -90 || lat > 90) {
                        errors.push('Latitude must be a number between -90 and 90');
                    }
                }
                if (data.longitude === null || data.longitude === undefined) {
                    errors.push('Valid coordinates are required (format: latitude, longitude)');
                } else {
                    const lng = parseFloat(data.longitude);
                    if (isNaN(lng) || lng < -180 || lng > 180) {
                        errors.push('Longitude must be a number between -180 and 180');
                    }
                }
                if (data.capacity !== null && data.capacity !== undefined && data.capacity !== '') {
                    const capacity = parseInt(data.capacity);
                    if (isNaN(capacity) || capacity < 0) {
                        errors.push('Capacity must be a positive number');
                    }
                }
                // Check for duplicate ID (excluding current editing item)
                const existingVenue = this.venues.find(v => v.id === data.id);
                if (existingVenue && (!this.currentEditingItem || this.currentEditingItem.id !== data.id)) {
                    errors.push('A venue with this ID already exists');
                }
                break;
                
            case 'concert':
                if (!data.id || data.id.trim() === '') {
                    errors.push('ID is required');
                }
                if (!data.name || data.name.trim() === '') {
                    errors.push('Name is required');
                }
                if (!data.date || data.date.trim() === '') {
                    errors.push('Date is required');
                } else {
                    const date = new Date(data.date);
                    if (isNaN(date.getTime())) {
                        errors.push('Date must be a valid date');
                    }
                }
                if (data.endDate && data.endDate.trim() !== '') {
                    const endDate = new Date(data.endDate);
                    const startDate = new Date(data.date);
                    if (isNaN(endDate.getTime())) {
                        errors.push('End date must be a valid date');
                    } else if (endDate < startDate) {
                        errors.push('End date must be after start date');
                    }
                }
                if (!data.type || data.type.trim() === '') {
                    errors.push('Concert type is required');
                } else if (!['concert', 'festival'].includes(data.type)) {
                    errors.push('Concert type must be either "concert" or "festival"');
                }
                if (!data.artistIds || data.artistIds.length === 0) {
                    errors.push('At least one artist is required');
                } else {
                    // Validate that all artist IDs exist
                    const invalidArtists = data.artistIds.filter(id => !this.artists.find(a => a.id === id));
                    if (invalidArtists.length > 0) {
                        errors.push(`Invalid artist IDs: ${invalidArtists.join(', ')}`);
                    }
                }
                if (!data.venueId || data.venueId.trim() === '') {
                    errors.push('Venue is required');
                } else {
                    // Validate that venue ID exists
                    const venue = this.venues.find(v => v.id === data.venueId);
                    if (!venue) {
                        errors.push('Selected venue does not exist');
                    }
                }
                if (data.price !== null && data.price !== undefined && data.price !== '') {
                    const price = parseFloat(data.price);
                    if (isNaN(price) || price < 0) {
                        errors.push('Price must be a positive number');
                    }
                }
                // Check for duplicate ID (excluding current editing item)
                const existingConcert = this.concerts.find(c => c.id === data.id);
                if (existingConcert && (!this.currentEditingItem || this.currentEditingItem.id !== data.id)) {
                    errors.push('A concert with this ID already exists');
                }
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Show success message
     * @param {string} message - Success message to display
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Show message with specified type
     * @param {string} message - Message to display
     * @param {string} type - Message type (success, error, info)
     */
    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.admin-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `admin-message ${type}`;
        messageEl.textContent = message;
        
        // Insert at top of main content
        const main = document.querySelector('main');
        main.insertBefore(messageEl, main.firstChild);
        
        // Auto-remove after longer time for info messages
        const timeout = type === 'info' ? 10000 : 5000;
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, timeout);
    }

    /**
     * Show info message
     * @param {string} message - Info message to display
     */
    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    /**
     * Clear form fields
     * @param {string} formId - ID of form to clear
     */
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            this.currentEditingItem = null;
            this.currentEditingType = null;
            
            // Special handling for artist form with multi-logo interface
            if (formId === 'artist-form') {
                this.clearLogosForm();
            }
            
            // Special handling for concert form with enhanced selects
            if (formId === 'concert-form') {
                // Clear artist selection
                const artistSelect = document.getElementById('concert-artists');
                if (artistSelect && artistSelect._selectedArtists !== undefined) {
                    artistSelect._selectedArtists = [];
                    this.updateOriginalSelect(artistSelect);
                    if (artistSelect._searchableElements) {
                        this.updateSelectedArtistsDisplay(artistSelect._searchableElements.selectedDisplay, artistSelect);
                    }
                }
                
                // Clear venue selection
                const venueSelect = document.getElementById('concert-venue');
                if (venueSelect && venueSelect._searchableElements) {
                    venueSelect.value = '';
                    venueSelect._searchableElements.searchInput.value = '';
                }
            }
            
            // Update submit button text
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = formId.includes('artist') ? 'Add Artist' :
                                       formId.includes('venue') ? 'Add Venue' : 'Add Concert';
            }
        }
    }

    /**
     * Debounce search input
     * @param {string} type - Type of search (artists, venues, concerts)
     * @param {string} query - Search query
     */
    debounceSearch(type, query) {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            this.filterData(type, query);
        }, 300);
    }

    /**
     * Filter data based on search query
     * @param {string} type - Type of data to filter
     * @param {string} query - Search query
     */
    filterData(type, query = null) {
        if (!query) {
            const searchInput = document.getElementById(`${type.slice(0, -1)}-search`);
            query = searchInput ? searchInput.value : '';
        }
        
        switch (type) {
            case 'artists':
                this.loadArtistsList(query);
                break;
            case 'venues':
                this.loadVenuesList(query);
                break;
            case 'concerts':
                this.loadConcertsList(query);
                break;
        }
    }

    // ==================== ARTIST MANAGEMENT ====================

    /**
     * Handle artist form submission
     * @param {Event} e - Form submit event
     */
    handleArtistSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Get logos from the multi-logo interface
        const logos = this.getLogosFromForm();
        
        const artistData = {
            id: formData.get('id').trim(),
            name: formData.get('name').trim(),
            country: formData.get('country').trim(),
            logo: logos.length > 0 ? logos : null
        };
        
        // Validate form data
        const validation = this.validateFormData(artistData, 'artist');
        if (!validation.isValid) {
            this.showErrorMessage('Validation errors: ' + validation.errors.join(', '));
            return;
        }
        
        if (this.currentEditingItem && this.currentEditingType === 'artist') {
            // Update existing artist
            this.updateArtist(artistData);
        } else {
            // Add new artist
            this.addArtist(artistData);
        }
    }

    /**
     * Add new artist
     * @param {Object} artistData - Artist data to add
     */
    addArtist(artistData) {
        this.artists.push(artistData);
        this.showSuccessMessage(`Artist "${artistData.name}" added successfully!`);
        this.clearForm('artist-form');
        this.loadArtistsList();
    }

    /**
     * Update existing artist
     * @param {Object} artistData - Updated artist data
     */
    updateArtist(artistData) {
        const index = this.artists.findIndex(a => a.id === this.currentEditingItem.id);
        if (index !== -1) {
            this.artists[index] = artistData;
            this.showSuccessMessage(`Artist "${artistData.name}" updated successfully!`);
            this.clearForm('artist-form');
            this.loadArtistsList();
            this.closeModal();
        }
    }

    /**
     * Edit artist
     * @param {string} artistId - ID of artist to edit
     */
    editArtist(artistId) {
        const artist = this.artists.find(a => a.id === artistId);
        if (!artist) {
            this.showErrorMessage('Artist not found');
            return;
        }
        
        this.currentEditingItem = artist;
        this.currentEditingType = 'artist';
        
        // Populate form
        document.getElementById('artist-id').value = artist.id;
        document.getElementById('artist-name').value = artist.name;
        document.getElementById('artist-country').value = artist.country;
        
        // Populate logos
        this.populateLogosForm(artist);
        
        // Update submit button
        const submitBtn = document.querySelector('#artist-form button[type="submit"]');
        submitBtn.textContent = 'Update Artist';
        
        // Scroll to form
        document.getElementById('artist-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Delete artist with confirmation
     * @param {string} artistId - ID of artist to delete
     */
    deleteArtist(artistId) {
        const artist = this.artists.find(a => a.id === artistId);
        if (!artist) {
            this.showErrorMessage('Artist not found');
            return;
        }
        
        // Check if artist is used in concerts
        const concertsWithArtist = this.concerts.filter(c => c.artistIds.includes(artistId));
        let confirmMessage = `Are you sure you want to delete "${artist.name}"?`;
        
        if (concertsWithArtist.length > 0) {
            confirmMessage += `\n\nWarning: This artist appears in ${concertsWithArtist.length} concert(s). Deleting will remove them from those concerts.`;
        }
        
        this.showConfirmModal(confirmMessage, () => {
            // Remove artist from artists array
            this.artists = this.artists.filter(a => a.id !== artistId);
            
            // Remove artist from concerts
            this.concerts.forEach(concert => {
                concert.artistIds = concert.artistIds.filter(id => id !== artistId);
            });
            
            this.showSuccessMessage(`Artist "${artist.name}" deleted successfully!`);
            this.loadArtistsList();
            this.closeConfirmModal();
        });
    }

    /**
     * Load and display artists list
     * @param {string} searchQuery - Optional search query to filter artists
     */
    loadArtistsList(searchQuery = '') {
        const container = document.getElementById('artists-list');
        if (!container) return;
        
        let filteredArtists = this.artists;
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredArtists = this.artists.filter(artist =>
                artist.name.toLowerCase().includes(query) ||
                artist.country.toLowerCase().includes(query) ||
                artist.id.toLowerCase().includes(query)
            );
        }
        
        // Sort artists alphabetically by name
        filteredArtists.sort((a, b) => a.name.localeCompare(b.name));
        
        if (filteredArtists.length === 0) {
            container.innerHTML = '<p class="no-data">No artists found.</p>';
            return;
        }
        
        const html = filteredArtists.map(artist => {
            let logoDisplay = '';
            if (artist.logo) {
                if (typeof artist.logo === 'string') {
                    logoDisplay = `<p><strong>Logo:</strong> ${this.escapeHtml(artist.logo)}</p>`;
                } else if (Array.isArray(artist.logo)) {
                    const logoCount = artist.logo.length;
                    // Get the most recent logo (current logo) - not the original one
                    const sortedLogos = artist.logo
                        .filter(logo => logo.from !== null)
                        .sort((a, b) => new Date(b.from) - new Date(a.from));
                    
                    let currentLogo;
                    if (sortedLogos.length > 0) {
                        // Use the most recent logo with a date
                        currentLogo = sortedLogos[0].filename;
                    } else {
                        // Fallback to original logo if no dated logos exist
                        const originalLogo = artist.logo.find(logo => logo.from === null);
                        currentLogo = originalLogo ? originalLogo.filename : artist.logo[0].filename;
                    }
                    
                    logoDisplay = `<p><strong>Logos:</strong> ${logoCount} logo${logoCount > 1 ? 's' : ''} (current: ${this.escapeHtml(currentLogo)})</p>`;
                }
            }
            
            return `
                <div class="data-item">
                    <div class="data-info">
                        <h4>${this.escapeHtml(artist.name)}</h4>
                        <p><strong>ID:</strong> ${this.escapeHtml(artist.id)}</p>
                        <p><strong>Country:</strong> ${this.escapeHtml(artist.country)}</p>
                        ${logoDisplay}
                    </div>
                    <div class="data-actions">
                        <button onclick="adminManager.editArtist('${artist.id}')" class="btn-edit">Edit</button>
                        <button onclick="adminManager.deleteArtist('${artist.id}')" class="btn-delete">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    // ==================== VENUE MANAGEMENT ====================

    /**
     * Handle venue form submission
     * @param {Event} e - Form submit event
     */
    handleVenueSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Get coordinates from the single coordinates field and parse them
        const coordinatesStr = formData.get('coordinates');
        const parsedCoords = this.parseCoordinates(coordinatesStr);
        
        const venueData = {
            id: formData.get('id').trim(),
            name: formData.get('name').trim(),
            city: formData.get('city').trim(),
            country: formData.get('country').trim(),
            latitude: parsedCoords ? parsedCoords.latitude : null,
            longitude: parsedCoords ? parsedCoords.longitude : null,
            capacity: formData.get('capacity') ? parseInt(formData.get('capacity')) : null
        };
        
        // Validate form data
        const validation = this.validateFormData(venueData, 'venue');
        if (!validation.isValid) {
            this.showErrorMessage('Validation errors: ' + validation.errors.join(', '));
            return;
        }
        
        if (this.currentEditingItem && this.currentEditingType === 'venue') {
            // Update existing venue
            this.updateVenue(venueData);
        } else {
            // Add new venue
            this.addVenue(venueData);
        }
    }

    /**
     * Add new venue
     * @param {Object} venueData - Venue data to add
     */
    addVenue(venueData) {
        this.venues.push(venueData);
        this.showSuccessMessage(`Venue "${venueData.name}" added successfully!`);
        this.clearForm('venue-form');
        this.loadVenuesList();
    }

    /**
     * Update existing venue
     * @param {Object} venueData - Updated venue data
     */
    updateVenue(venueData) {
        const index = this.venues.findIndex(v => v.id === this.currentEditingItem.id);
        if (index !== -1) {
            this.venues[index] = venueData;
            this.showSuccessMessage(`Venue "${venueData.name}" updated successfully!`);
            this.clearForm('venue-form');
            this.loadVenuesList();
            this.closeModal();
        }
    }

    /**
     * Edit venue
     * @param {string} venueId - ID of venue to edit
     */
    editVenue(venueId) {
        const venue = this.venues.find(v => v.id === venueId);
        if (!venue) {
            this.showErrorMessage('Venue not found');
            return;
        }
        
        this.currentEditingItem = venue;
        this.currentEditingType = 'venue';
        
        // Populate form
        document.getElementById('venue-id').value = venue.id;
        document.getElementById('venue-name').value = venue.name;
        document.getElementById('venue-city').value = venue.city;
        document.getElementById('venue-country').value = venue.country;
        
        // Combine latitude and longitude into coordinates field
        const coordinatesField = document.getElementById('venue-coordinates');
        if (coordinatesField) {
            if (venue.latitude !== null && venue.longitude !== null) {
                coordinatesField.value = `${venue.latitude}, ${venue.longitude}`;
            } else {
                coordinatesField.value = '';
            }
        }
        
        document.getElementById('venue-capacity').value = venue.capacity || '';
        
        // Update submit button
        const submitBtn = document.querySelector('#venue-form button[type="submit"]');
        submitBtn.textContent = 'Update Venue';
        
        // Scroll to form
        document.getElementById('venue-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Delete venue with confirmation
     * @param {string} venueId - ID of venue to delete
     */
    deleteVenue(venueId) {
        const venue = this.venues.find(v => v.id === venueId);
        if (!venue) {
            this.showErrorMessage('Venue not found');
            return;
        }
        
        // Check if venue is used in concerts
        const concertsWithVenue = this.concerts.filter(c => c.venueId === venueId);
        let confirmMessage = `Are you sure you want to delete "${venue.name}"?`;
        
        if (concertsWithVenue.length > 0) {
            confirmMessage += `\n\nWarning: This venue is used in ${concertsWithVenue.length} concert(s). Deleting will affect those concerts.`;
        }
        
        this.showConfirmModal(confirmMessage, () => {
            // Remove venue from venues array
            this.venues = this.venues.filter(v => v.id !== venueId);
            
            // Note: We don't automatically remove venue references from concerts
            // as this could break concert data integrity. Admin should handle this manually.
            
            this.showSuccessMessage(`Venue "${venue.name}" deleted successfully!`);
            this.loadVenuesList();
            this.closeConfirmModal();
        });
    }

    /**
     * Load and display venues list
     * @param {string} searchQuery - Optional search query to filter venues
     */
    loadVenuesList(searchQuery = '') {
        const container = document.getElementById('venues-list');
        if (!container) return;
        
        let filteredVenues = this.venues;
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredVenues = this.venues.filter(venue =>
                venue.name.toLowerCase().includes(query) ||
                venue.city.toLowerCase().includes(query) ||
                venue.country.toLowerCase().includes(query) ||
                venue.id.toLowerCase().includes(query)
            );
        }
        
        // Sort venues alphabetically by name
        filteredVenues.sort((a, b) => a.name.localeCompare(b.name));
        
        if (filteredVenues.length === 0) {
            container.innerHTML = '<p class="no-data">No venues found.</p>';
            return;
        }
        
        const html = filteredVenues.map(venue => `
            <div class="data-item">
                <div class="data-info">
                    <h4>${this.escapeHtml(venue.name)}</h4>
                    <p><strong>ID:</strong> ${this.escapeHtml(venue.id)}</p>
                    <p><strong>Location:</strong> ${this.escapeHtml(venue.city)}, ${this.escapeHtml(venue.country)}</p>
                    <p><strong>Coordinates:</strong> ${venue.latitude}, ${venue.longitude}</p>
                    ${venue.capacity ? `<p><strong>Capacity:</strong> ${venue.capacity.toLocaleString()}</p>` : '<p><strong>Capacity:</strong> Not specified</p>'}
                </div>
                <div class="data-actions">
                    <button onclick="adminManager.editVenue('${venue.id}')" class="btn-edit">Edit</button>
                    <button onclick="adminManager.deleteVenue('${venue.id}')" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    // ==================== CONCERT MANAGEMENT ====================

    /**
     * Handle concert form submission
     * @param {Event} e - Form submit event
     */
    handleConcertSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Get selected artists from the enhanced select or fallback to multi-select
        const artistSelect = document.getElementById('concert-artists');
        let selectedArtists = [];
        
        if (artistSelect._selectedArtists !== undefined) {
            // New system: use the ordered selected artists array
            selectedArtists = [...artistSelect._selectedArtists];
        } else {
            // Fallback: old multi-select system
            selectedArtists = Array.from(artistSelect.selectedOptions).map(option => option.value);
        }
        
        const concertData = {
            id: formData.get('id').trim(),
            name: formData.get('name').trim(),
            date: formData.get('date'),
            endDate: formData.get('endDate') || null,
            type: formData.get('type'),
            artistIds: selectedArtists,
            venueId: formData.get('venueId'),
            price: formData.get('price') ? parseFloat(formData.get('price')) : null,
            logo: formData.get('logo').trim() || null,
            notes: formData.get('notes').trim() || null
        };
        
        // Validate form data
        const validation = this.validateFormData(concertData, 'concert');
        if (!validation.isValid) {
            this.showErrorMessage('Validation errors: ' + validation.errors.join(', '));
            return;
        }
        
        if (this.currentEditingItem && this.currentEditingType === 'concert') {
            // Update existing concert
            this.updateConcert(concertData);
        } else {
            // Add new concert
            this.addConcert(concertData);
        }
    }

    /**
     * Add new concert
     * @param {Object} concertData - Concert data to add
     */
    addConcert(concertData) {
        this.concerts.push(concertData);
        this.showSuccessMessage(`Concert "${concertData.name}" added successfully!`);
        this.clearForm('concert-form');
        this.loadConcertsList();
        // this.updateDatabaseStats(); // Remove this call for now since method doesn't exist
    }

    /**
     * Update existing concert
     * @param {Object} concertData - Updated concert data
     */
    updateConcert(concertData) {
        const index = this.concerts.findIndex(c => c.id === this.currentEditingItem.id);
        if (index !== -1) {
            this.concerts[index] = concertData;
            this.showSuccessMessage(`Concert "${concertData.name}" updated successfully!`);
            this.clearForm('concert-form');
            this.loadConcertsList();
            this.closeModal();
            // this.updateDatabaseStats(); // Remove this call for now since method doesn't exist
        }
    }

    /**
     * Edit concert
     * @param {string} concertId - ID of concert to edit
     */
    editConcert(concertId) {
        const concert = this.concerts.find(c => c.id === concertId);
        if (!concert) {
            this.showErrorMessage('Concert not found');
            return;
        }
        
        this.currentEditingItem = concert;
        this.currentEditingType = 'concert';
        
        // Populate form
        document.getElementById('concert-id').value = concert.id;
        document.getElementById('concert-name').value = concert.name;
        document.getElementById('concert-logo').value = concert.logo || '';
        document.getElementById('concert-date').value = concert.date;
        document.getElementById('concert-end-date').value = concert.endDate || '';
        document.getElementById('concert-type').value = concert.type;
        document.getElementById('concert-venue').value = concert.venueId;
        document.getElementById('concert-price').value = concert.price || '';
        document.getElementById('concert-notes').value = concert.notes || '';
        
        // Handle artist selection with new system
        const artistSelect = document.getElementById('concert-artists');
        if (artistSelect._selectedArtists !== undefined) {
            // New system: set the selected artists array
            artistSelect._selectedArtists = [...concert.artistIds];
            this.updateOriginalSelect(artistSelect);
            if (artistSelect._searchableElements) {
                this.updateSelectedArtistsDisplay(artistSelect._searchableElements.selectedDisplay, artistSelect);
            }
        } else {
            // Fallback: old multi-select system
            Array.from(artistSelect.options).forEach(option => {
                option.selected = concert.artistIds.includes(option.value);
            });
        }
        
        // Update venue selection
        const venueSelect = document.getElementById('concert-venue');
        if (venueSelect._searchableElements) {
            this.selectVenue(concert.venueId, venueSelect);
        }
        
        // Update submit button
        const submitBtn = document.querySelector('#concert-form button[type="submit"]');
        submitBtn.textContent = 'Update Concert';
        
        // Scroll to form
        document.getElementById('concert-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Delete concert with confirmation
     * @param {string} concertId - ID of concert to delete
     */
    deleteConcert(concertId) {
        const concert = this.concerts.find(c => c.id === concertId);
        if (!concert) {
            this.showErrorMessage('Concert not found');
            return;
        }
        
        const confirmMessage = `Are you sure you want to delete "${concert.name}"?`;
        
        this.showConfirmModal(confirmMessage, () => {
            // Remove concert from concerts array
            this.concerts = this.concerts.filter(c => c.id !== concertId);
            
            this.showSuccessMessage(`Concert "${concert.name}" deleted successfully!`);
            this.loadConcertsList();
            // this.updateDatabaseStats(); // Remove this call for now since method doesn't exist
            this.closeConfirmModal();
        });
    }

    /**
     * Load and display concerts list
     * @param {string} searchQuery - Optional search query to filter concerts
     */
    loadConcertsList(searchQuery = '') {
        const container = document.getElementById('concerts-list');
        if (!container) return;
        
        let filteredConcerts = this.concerts;
        
        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredConcerts = this.concerts.filter(concert => {
                // Search in concert name
                if (concert.name.toLowerCase().includes(query)) return true;
                
                // Search in artist names
                const artistNames = concert.artistIds.map(id => {
                    const artist = this.artists.find(a => a.id === id);
                    return artist ? artist.name.toLowerCase() : '';
                }).join(' ');
                if (artistNames.includes(query)) return true;
                
                // Search in venue name
                const venue = this.venues.find(v => v.id === concert.venueId);
                if (venue && venue.name.toLowerCase().includes(query)) return true;
                
                // Search in venue city
                if (venue && venue.city.toLowerCase().includes(query)) return true;
                
                // Search in concert type
                if (concert.type.toLowerCase().includes(query)) return true;
                
                // Search in date
                if (concert.date.includes(query)) return true;
                
                return false;
            });
        }
        
        // Apply type filter
        const typeFilter = document.getElementById('concert-filter-type');
        if (typeFilter && typeFilter.value) {
            filteredConcerts = filteredConcerts.filter(concert => concert.type === typeFilter.value);
        }
        
        // Sort concerts by date (newest first)
        filteredConcerts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filteredConcerts.length === 0) {
            container.innerHTML = '<p class="no-data">No concerts found.</p>';
            return;
        }
        
        const html = filteredConcerts.map(concert => {
            // Resolve artist names
            const artistNames = concert.artistIds.map(id => {
                const artist = this.artists.find(a => a.id === id);
                return artist ? artist.name : `Unknown (${id})`;
            }).join(', ');
            
            // Resolve venue name
            const venue = this.venues.find(v => v.id === concert.venueId);
            const venueName = venue ? `${venue.name}, ${venue.city}` : `Unknown (${concert.venueId})`;
            
            // Format date
            const startDate = new Date(concert.date).toLocaleDateString();
            const dateDisplay = concert.endDate && concert.endDate !== concert.date
                ? `${startDate} - ${new Date(concert.endDate).toLocaleDateString()}`
                : startDate;
            
            return `
                <div class="data-item">
                    <div class="data-info">
                        <h4>${this.escapeHtml(concert.name)}</h4>
                        <p><strong>ID:</strong> ${this.escapeHtml(concert.id)}</p>
                        <p><strong>Date:</strong> ${dateDisplay}</p>
                        <p><strong>Type:</strong> ${this.escapeHtml(concert.type)}</p>
                        <p><strong>Artists:</strong> ${this.escapeHtml(artistNames)}</p>
                        <p><strong>Venue:</strong> ${this.escapeHtml(venueName)}</p>
                        ${concert.logo ? `<p><strong>Logo:</strong> ${this.escapeHtml(concert.logo)}</p>` : ''}
                        ${concert.price ? `<p><strong>Price:</strong> €${concert.price.toFixed(2)}</p>` : ''}
                        ${concert.notes ? `<p><strong>Notes:</strong> ${this.escapeHtml(concert.notes)}</p>` : ''}
                    </div>
                    <div class="data-actions">
                        <button onclick="adminManager.editConcert('${concert.id}')" class="btn-edit">Edit</button>
                        <button onclick="adminManager.deleteConcert('${concert.id}')" class="btn-delete">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    /**
     * Populate concert form select elements with searchable functionality
     */
    populateConcertFormSelects() {
        this.populateArtistSelect();
        this.populateVenueSelect();
        
        // Initialize searchable functionality after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeSearchableDropdowns();
        }, 100);
    }

    /**
     * Populate artist select with all available artists
     */
    populateArtistSelect() {
        const select = document.getElementById('concert-artists');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '';
        
        // Sort artists alphabetically
        const sortedArtists = [...this.artists].sort((a, b) => a.name.localeCompare(b.name));
        
        // Add options
        sortedArtists.forEach(artist => {
            const option = document.createElement('option');
            option.value = artist.id;
            option.textContent = `${artist.name} (${artist.country})`;
            select.appendChild(option);
        });
    }

    /**
     * Populate venue select with all available venues
     */
    populateVenueSelect() {
        const select = document.getElementById('concert-venue');
        if (!select) return;
        
        // Clear existing options except the first one
        select.innerHTML = '<option value="">Select Venue</option>';
        
        // Sort venues alphabetically
        const sortedVenues = [...this.venues].sort((a, b) => a.name.localeCompare(b.name));
        
        // Add options
        sortedVenues.forEach(venue => {
            const option = document.createElement('option');
            option.value = venue.id;
            option.textContent = `${venue.name} - ${venue.city}, ${venue.country}`;
            select.appendChild(option);
        });
    }

    // ==================== MODAL MANAGEMENT ====================

    /**
     * Show confirmation modal
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback function for confirmation
     */
    showConfirmModal(message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        const messageEl = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-yes');
        
        messageEl.textContent = message;
        modal.style.display = 'block';
        
        // Remove existing event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Add new event listener
        newConfirmBtn.addEventListener('click', onConfirm);
    }

    /**
     * Close confirmation modal
     */
    closeConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        modal.style.display = 'none';
    }

    /**
     * Close edit modal
     */
    closeModal() {
        const modal = document.getElementById('edit-modal');
        modal.style.display = 'none';
        this.currentEditingItem = null;
        this.currentEditingType = null;
    }

    // ==================== DATA PERSISTENCE ====================

    /**
     * Save artists data to JavaScript file
     */
    async saveArtistsData() {
        try {
            const validation = this.validateDataIntegrity('artists');
            if (!validation.isValid) {
                this.showErrorMessage('Data validation failed: ' + validation.errors.join(', '));
                return;
            }

            const jsContent = this.generateArtistsJS();
            await this.saveDataFile('artists.js', jsContent);
            this.showSuccessMessage('Artists data saved successfully!');
        } catch (error) {
            this.showErrorMessage('Failed to save artists data: ' + error.message);
        }
    }

    /**
     * Save venues data to JavaScript file
     */
    async saveVenuesData() {
        try {
            const validation = this.validateDataIntegrity('venues');
            if (!validation.isValid) {
                this.showErrorMessage('Data validation failed: ' + validation.errors.join(', '));
                return;
            }

            const jsContent = this.generateVenuesJS();
            await this.saveDataFile('venues.js', jsContent);
            this.showSuccessMessage('Venues data saved successfully!');
        } catch (error) {
            this.showErrorMessage('Failed to save venues data: ' + error.message);
        }
    }

    /**
     * Save concerts data to JavaScript file
     */
    async saveConcertsData() {
        try {
            const validation = this.validateDataIntegrity('concerts');
            if (!validation.isValid) {
                this.showErrorMessage('Data validation failed: ' + validation.errors.join(', '));
                return;
            }

            const jsContent = this.generateConcertsJS();
            await this.saveDataFile('concerts.js', jsContent);
            this.showSuccessMessage('Concerts data saved successfully!');
        } catch (error) {
            this.showErrorMessage('Failed to save concerts data: ' + error.message);
        }
    }

    /**
     * Generate JavaScript file content for artists data
     * @returns {string} JavaScript file content
     */
    generateArtistsJS() {
        const header = `// Concert artist data - converted from original band list\nconst artistsData = `;
        const footer = `;\n\n// Export for use in other modules\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = artistsData;\n}`;
        
        // Sort artists alphabetically by name for consistency
        const sortedArtists = [...this.artists].sort((a, b) => a.name.localeCompare(b.name));
        
        const dataString = JSON.stringify(sortedArtists, null, 4);
        return header + dataString + footer;
    }

    /**
     * Generate JavaScript file content for venues data
     * @returns {string} JavaScript file content
     */
    generateVenuesJS() {
        const header = `// Concert venue data - converted from original venue list\nconst venuesData = `;
        const footer = `;\n\n// Export for use in other modules\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = venuesData;\n}`;
        
        // Sort venues alphabetically by name for consistency
        const sortedVenues = [...this.venues].sort((a, b) => a.name.localeCompare(b.name));
        
        const dataString = JSON.stringify(sortedVenues, null, 4);
        return header + dataString + footer;
    }

    /**
     * Generate JavaScript file content for concerts data
     * @returns {string} JavaScript file content
     */
    generateConcertsJS() {
        const header = `// Concert data - converted from original event list\nconst concertsData = `;
        const footer = `;\n\n// Export for use in other modules\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = concertsData;\n}`;
        
        // Sort concerts by date (newest first) for consistency
        const sortedConcerts = [...this.concerts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const dataString = JSON.stringify(sortedConcerts, null, 4);
        return header + dataString + footer;
    }

    /**
     * Save data file content (simulated - in real implementation would use server endpoint)
     * @param {string} filename - Name of the file to save
     * @param {string} content - Content to save
     */
    async saveDataFile(filename, content) {
        // In a real implementation, this would make an API call to save the file
        // For now, we'll download the file so the user can manually replace it
        const blob = new Blob([content], { type: 'text/javascript' });
        this.downloadBlob(blob, filename);
        
        // Show instructions to user
        this.showMessage(
            `File "${filename}" has been downloaded. Please replace the existing file in the js/data/ folder to apply changes.`,
            'info'
        );
    }

    /**
     * Validate data integrity before saving
     * @param {string} dataType - Type of data to validate
     * @returns {Object} Validation result
     */
    validateDataIntegrity(dataType) {
        const errors = [];
        
        switch (dataType) {
            case 'artists':
                // Check for duplicate IDs
                const artistIds = this.artists.map(a => a.id);
                const duplicateArtistIds = artistIds.filter((id, index) => artistIds.indexOf(id) !== index);
                if (duplicateArtistIds.length > 0) {
                    errors.push(`Duplicate artist IDs found: ${duplicateArtistIds.join(', ')}`);
                }
                
                // Check for required fields
                this.artists.forEach((artist, index) => {
                    if (!artist.id) errors.push(`Artist at index ${index} missing ID`);
                    if (!artist.name) errors.push(`Artist at index ${index} missing name`);
                    if (!artist.country) errors.push(`Artist at index ${index} missing country`);
                });
                break;
                
            case 'venues':
                // Check for duplicate IDs
                const venueIds = this.venues.map(v => v.id);
                const duplicateVenueIds = venueIds.filter((id, index) => venueIds.indexOf(id) !== index);
                if (duplicateVenueIds.length > 0) {
                    errors.push(`Duplicate venue IDs found: ${duplicateVenueIds.join(', ')}`);
                }
                
                // Check for required fields and valid coordinates
                this.venues.forEach((venue, index) => {
                    if (!venue.id) errors.push(`Venue at index ${index} missing ID`);
                    if (!venue.name) errors.push(`Venue at index ${index} missing name`);
                    if (!venue.city) errors.push(`Venue at index ${index} missing city`);
                    if (!venue.country) errors.push(`Venue at index ${index} missing country`);
                    
                    if (venue.latitude !== null && (venue.latitude < -90 || venue.latitude > 90)) {
                        errors.push(`Venue "${venue.name}" has invalid latitude: ${venue.latitude}`);
                    }
                    if (venue.longitude !== null && (venue.longitude < -180 || venue.longitude > 180)) {
                        errors.push(`Venue "${venue.name}" has invalid longitude: ${venue.longitude}`);
                    }
                });
                break;
                
            case 'concerts':
                // Check for duplicate IDs
                const concertIds = this.concerts.map(c => c.id);
                const duplicateConcertIds = concertIds.filter((id, index) => concertIds.indexOf(id) !== index);
                if (duplicateConcertIds.length > 0) {
                    errors.push(`Duplicate concert IDs found: ${duplicateConcertIds.join(', ')}`);
                }
                
                // Check for required fields and valid references
                this.concerts.forEach((concert, index) => {
                    if (!concert.id) errors.push(`Concert at index ${index} missing ID`);
                    if (!concert.name) errors.push(`Concert at index ${index} missing name`);
                    if (!concert.date) errors.push(`Concert at index ${index} missing date`);
                    if (!concert.type) errors.push(`Concert at index ${index} missing type`);
                    
                    // Validate artist references
                    if (!concert.artistIds || concert.artistIds.length === 0) {
                        errors.push(`Concert "${concert.name}" has no artists`);
                    } else {
                        const invalidArtists = concert.artistIds.filter(id => !this.artists.find(a => a.id === id));
                        if (invalidArtists.length > 0) {
                            errors.push(`Concert "${concert.name}" references invalid artists: ${invalidArtists.join(', ')}`);
                        }
                    }
                    
                    // Validate venue reference
                    if (!concert.venueId) {
                        errors.push(`Concert "${concert.name}" missing venue`);
                    } else if (!this.venues.find(v => v.id === concert.venueId)) {
                        errors.push(`Concert "${concert.name}" references invalid venue: ${concert.venueId}`);
                    }
                    
                    // Validate date format
                    if (concert.date && isNaN(new Date(concert.date).getTime())) {
                        errors.push(`Concert "${concert.name}" has invalid date: ${concert.date}`);
                    }
                    if (concert.endDate && isNaN(new Date(concert.endDate).getTime())) {
                        errors.push(`Concert "${concert.name}" has invalid end date: ${concert.endDate}`);
                    }
                });
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Download blob as file
     * @param {Blob} blob - Blob to download
     * @param {string} filename - Filename for download
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Get current date as string for filenames
     * @returns {string} Date string in YYYY-MM-DD format
     */
    getCurrentDateString() {
        return new Date().toISOString().split('T')[0];
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // ==================== SEARCHABLE DROPDOWN FUNCTIONALITY ====================

    /**
     * Initialize searchable dropdowns for concert form
     */
    initializeSearchableDropdowns() {
        const artistSelect = document.getElementById('concert-artists');
        const venueSelect = document.getElementById('concert-venue');
        
        if (artistSelect && !artistSelect._searchableInitialized) {
            this.enhanceArtistSelect(artistSelect);
            artistSelect._searchableInitialized = true;
        }
        
        if (venueSelect && !venueSelect._searchableInitialized) {
            this.enhanceVenueSelect(venueSelect);
            venueSelect._searchableInitialized = true;
        }
    }

    /**
     * Enhance artist select with searchable multi-select functionality that allows duplicates and ordering
     * @param {HTMLSelectElement} select - The artist select element
     */
    enhanceArtistSelect(select) {
        const container = select.parentNode;
        
        // Create wrapper for the enhanced select
        const wrapper = document.createElement('div');
        wrapper.className = 'searchable-select-wrapper artist-select';
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'searchable-input';
        searchInput.placeholder = 'Search and add artists...';
        
        // Create selected items display with ordering
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-artists-list';
        selectedDisplay.innerHTML = '<div class="list-header">Selected Artists (drag to reorder):</div>';
        
        // Create dropdown list
        const dropdownList = document.createElement('div');
        dropdownList.className = 'searchable-dropdown';
        dropdownList.style.display = 'none';
        
        // Insert wrapper and move select into it
        container.insertBefore(wrapper, select);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(selectedDisplay);
        wrapper.appendChild(dropdownList);
        wrapper.appendChild(select);
        
        // Hide original select
        select.style.display = 'none';
        
        // Initialize selected artists array
        select._selectedArtists = [];
        
        // Populate from existing selection
        Array.from(select.selectedOptions).forEach(option => {
            select._selectedArtists.push(option.value);
        });
        
        // Populate dropdown initially
        this.updateArtistDropdown(dropdownList, '', select);
        this.updateSelectedArtistsDisplay(selectedDisplay, select);
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.updateArtistDropdown(dropdownList, e.target.value, select);
            dropdownList.style.display = 'block';
        });
        
        // Show dropdown on focus
        searchInput.addEventListener('focus', () => {
            this.updateArtistDropdown(dropdownList, searchInput.value, select);
            dropdownList.style.display = 'block';
        });
        
        // Clear search on selection
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchInput.value = '';
            }, 200);
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdownList.style.display = 'none';
            }
        });
        
        // Store references
        select._searchableElements = {
            wrapper,
            searchInput,
            selectedDisplay,
            dropdownList
        };
    }

    /**
     * Update artist dropdown list (now allows adding duplicates)
     * @param {HTMLElement} dropdownList - The dropdown list element
     * @param {string} searchTerm - The search term
     * @param {HTMLSelectElement} select - The original select element
     */
    updateArtistDropdown(dropdownList, searchTerm, select) {
        const filteredArtists = this.artists.filter(artist =>
            artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artist.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        dropdownList.innerHTML = '';
        
        filteredArtists.forEach(artist => {
            const item = document.createElement('div');
            item.className = 'dropdown-item artist-add-item';
            item.innerHTML = `
                <div class="artist-info">
                    <span class="artist-name">${this.escapeHtml(artist.name)}</span>
                    <span class="artist-country">(${this.escapeHtml(artist.country)})</span>
                </div>
                <button type="button" class="add-artist-btn">Add</button>
            `;
            
            const addBtn = item.querySelector('.add-artist-btn');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addArtistToSelection(artist.id, select);
                dropdownList.style.display = 'none';
            });
            
            // Also allow clicking the whole item to add
            item.addEventListener('click', () => {
                this.addArtistToSelection(artist.id, select);
                dropdownList.style.display = 'none';
            });
            
            dropdownList.appendChild(item);
        });
    }

    /**
     * Add artist to selection (allows duplicates)
     * @param {string} artistId - The artist ID
     * @param {HTMLSelectElement} select - The original select element
     */
    addArtistToSelection(artistId, select) {
        if (!select._selectedArtists) {
            select._selectedArtists = [];
        }
        
        // Add to selected artists array (allows duplicates)
        select._selectedArtists.push(artistId);
        
        // Update the original select element
        this.updateOriginalSelect(select);
        
        // Update display
        if (select._searchableElements) {
            this.updateSelectedArtistsDisplay(select._searchableElements.selectedDisplay, select);
        }
    }

    /**
     * Remove artist from selection at specific index
     * @param {number} index - The index to remove
     * @param {HTMLSelectElement} select - The original select element
     */
    removeArtistFromSelection(index, select) {
        if (!select._selectedArtists) return;
        
        select._selectedArtists.splice(index, 1);
        
        // Update the original select element
        this.updateOriginalSelect(select);
        
        // Update display
        if (select._searchableElements) {
            this.updateSelectedArtistsDisplay(select._searchableElements.selectedDisplay, select);
        }
    }

    /**
     * Move artist in selection order
     * @param {number} fromIndex - Source index
     * @param {number} toIndex - Target index
     * @param {HTMLSelectElement} select - The original select element
     */
    moveArtistInSelection(fromIndex, toIndex, select) {
        if (!select._selectedArtists) return;
        
        const artist = select._selectedArtists.splice(fromIndex, 1)[0];
        select._selectedArtists.splice(toIndex, 0, artist);
        
        // Update the original select element
        this.updateOriginalSelect(select);
        
        // Update display
        if (select._searchableElements) {
            this.updateSelectedArtistsDisplay(select._searchableElements.selectedDisplay, select);
        }
    }

    /**
     * Update the original select element to match selected artists
     * @param {HTMLSelectElement} select - The original select element
     */
    updateOriginalSelect(select) {
        // Clear all selections first
        Array.from(select.options).forEach(option => option.selected = false);
        
        // Create new options for each selected artist (including duplicates)
        select.innerHTML = '';
        
        if (select._selectedArtists) {
            select._selectedArtists.forEach(artistId => {
                const artist = this.artists.find(a => a.id === artistId);
                if (artist) {
                    const option = document.createElement('option');
                    option.value = artistId;
                    option.textContent = `${artist.name} (${artist.country})`;
                    option.selected = true;
                    select.appendChild(option);
                }
            });
        }
    }

    /**
     * Update selected artists display with drag-and-drop ordering
     * @param {HTMLElement} selectedDisplay - The selected items display element
     * @param {HTMLSelectElement} select - The original select element
     */
    updateSelectedArtistsDisplay(selectedDisplay, select) {
        // Keep the header
        const header = selectedDisplay.querySelector('.list-header');
        selectedDisplay.innerHTML = '';
        if (header) {
            selectedDisplay.appendChild(header);
        } else {
            const newHeader = document.createElement('div');
            newHeader.className = 'list-header';
            newHeader.textContent = 'Selected Artists (drag to reorder):';
            selectedDisplay.appendChild(newHeader);
        }
        
        if (!select._selectedArtists || select._selectedArtists.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            placeholder.textContent = 'No artists selected';
            selectedDisplay.appendChild(placeholder);
            return;
        }
        
        const listContainer = document.createElement('div');
        listContainer.className = 'artists-list-container';
        
        select._selectedArtists.forEach((artistId, index) => {
            const artist = this.artists.find(a => a.id === artistId);
            if (artist) {
                const item = document.createElement('div');
                item.className = 'selected-artist-item';
                item.draggable = true;
                item.dataset.index = index;
                
                item.innerHTML = `
                    <div class="drag-handle">⋮⋮</div>
                    <div class="artist-info">
                        <span class="artist-name">${this.escapeHtml(artist.name)}</span>
                        <span class="artist-country">(${this.escapeHtml(artist.country)})</span>
                    </div>
                    <div class="item-controls">
                        <button type="button" class="move-up-btn" ${index === 0 ? 'disabled' : ''}>↑</button>
                        <button type="button" class="move-down-btn" ${index === select._selectedArtists.length - 1 ? 'disabled' : ''}>↓</button>
                        <button type="button" class="remove-artist-btn">×</button>
                    </div>
                `;
                
                // Add event listeners
                const removeBtn = item.querySelector('.remove-artist-btn');
                removeBtn.addEventListener('click', () => {
                    this.removeArtistFromSelection(index, select);
                });
                
                const moveUpBtn = item.querySelector('.move-up-btn');
                moveUpBtn.addEventListener('click', () => {
                    if (index > 0) {
                        this.moveArtistInSelection(index, index - 1, select);
                    }
                });
                
                const moveDownBtn = item.querySelector('.move-down-btn');
                moveDownBtn.addEventListener('click', () => {
                    if (index < select._selectedArtists.length - 1) {
                        this.moveArtistInSelection(index, index + 1, select);
                    }
                });
                
                // Drag and drop functionality
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', index);
                    item.classList.add('dragging');
                });
                
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });
                
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });
                
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    const toIndex = parseInt(item.dataset.index);
                    if (fromIndex !== toIndex) {
                        this.moveArtistInSelection(fromIndex, toIndex, select);
                    }
                });
                
                listContainer.appendChild(item);
            }
        });
        
        selectedDisplay.appendChild(listContainer);
    }

    /**
     * Enhance venue select with searchable functionality
     * @param {HTMLSelectElement} select - The venue select element
     */
    enhanceVenueSelect(select) {
        const container = select.parentNode;
        
        // Create wrapper for the enhanced select
        const wrapper = document.createElement('div');
        wrapper.className = 'searchable-select-wrapper venue-select';
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'searchable-input';
        searchInput.placeholder = 'Search venues...';
        searchInput.value = select.selectedOptions[0]?.textContent || '';
        
        // Create dropdown list
        const dropdownList = document.createElement('div');
        dropdownList.className = 'searchable-dropdown';
        dropdownList.style.display = 'none';
        
        // Insert wrapper and move select into it
        container.insertBefore(wrapper, select);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(dropdownList);
        wrapper.appendChild(select);
        
        // Hide original select
        select.style.display = 'none';
        
        // Populate dropdown initially
        this.updateVenueDropdown(dropdownList, '', select);
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.updateVenueDropdown(dropdownList, e.target.value, select);
            dropdownList.style.display = 'block';
        });
        
        // Show dropdown on focus
        searchInput.addEventListener('focus', () => {
            searchInput.select();
            this.updateVenueDropdown(dropdownList, '', select);
            dropdownList.style.display = 'block';
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdownList.style.display = 'none';
            }
        });
        
        // Store references
        select._searchableElements = {
            wrapper,
            searchInput,
            dropdownList
        };
    }

    /**
     * Update venue dropdown list
     * @param {HTMLElement} dropdownList - The dropdown list element
     * @param {string} searchTerm - The search term
     * @param {HTMLSelectElement} select - The original select element
     */
    updateVenueDropdown(dropdownList, searchTerm, select) {
        const filteredVenues = this.venues.filter(venue =>
            venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venue.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        dropdownList.innerHTML = '';
        
        // Add "Select Venue" option
        const emptyItem = document.createElement('div');
        emptyItem.className = 'dropdown-item';
        emptyItem.textContent = 'Select Venue';
        emptyItem.addEventListener('click', () => {
            this.selectVenue('', select);
        });
        dropdownList.appendChild(emptyItem);
        
        filteredVenues.forEach(venue => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.textContent = `${venue.name} - ${venue.city}, ${venue.country}`;
            
            item.addEventListener('click', () => {
                this.selectVenue(venue.id, select);
            });
            
            dropdownList.appendChild(item);
        });
    }

    /**
     * Select a venue
     * @param {string} venueId - The venue ID
     * @param {HTMLSelectElement} select - The original select element
     */
    selectVenue(venueId, select) {
        select.value = venueId;
        
        if (select._searchableElements) {
            const selectedOption = select.selectedOptions[0];
            select._searchableElements.searchInput.value = selectedOption ? selectedOption.textContent : '';
            select._searchableElements.dropdownList.style.display = 'none';
        }
    }

    // ==================== MULTI-LOGO MANAGEMENT ====================

    /**
     * Initialize multi-logo interface
     */
    initializeMultiLogoInterface() {
        this.clearLogosForm();
        this.addLogoRow(); // Add one empty row by default
    }

    /**
     * Add a new logo row to the table
     * @param {Object} logoData - Optional logo data to populate
     */
    addLogoRow(logoData = null) {
        const tableBody = document.getElementById('logos-table-body');
        const rowIndex = tableBody.children.length;
        
        const row = document.createElement('tr');
        row.className = 'logo-row';
        row.dataset.index = rowIndex;
        
        row.innerHTML = `
            <td>
                <input type="text" class="logo-filename" placeholder="logo-filename.png"
                       value="${logoData ? logoData.filename : ''}" />
            </td>
            <td>
                <input type="date" class="logo-from-date"
                       value="${logoData && logoData.from ? logoData.from : ''}" />
            </td>
            <td>
                <button type="button" class="btn-remove-logo" onclick="adminManager.removeLogoRow(${rowIndex})">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
        this.updateLogoRowIndices();
    }

    /**
     * Remove a logo row from the table
     * @param {number} index - Index of row to remove
     */
    removeLogoRow(index) {
        const tableBody = document.getElementById('logos-table-body');
        const rows = tableBody.querySelectorAll('.logo-row');
        
        if (rows.length <= 1) {
            this.showErrorMessage('At least one logo entry is required');
            return;
        }
        
        const rowToRemove = tableBody.querySelector(`[data-index="${index}"]`);
        if (rowToRemove) {
            rowToRemove.remove();
            this.updateLogoRowIndices();
        }
    }

    /**
     * Update indices of logo rows after add/remove operations
     */
    updateLogoRowIndices() {
        const tableBody = document.getElementById('logos-table-body');
        const rows = tableBody.querySelectorAll('.logo-row');
        
        rows.forEach((row, index) => {
            row.dataset.index = index;
            const removeBtn = row.querySelector('.btn-remove-logo');
            if (removeBtn) {
                removeBtn.setAttribute('onclick', `adminManager.removeLogoRow(${index})`);
            }
        });
    }

    /**
     * Get logos data from the form
     * @returns {Array} Array of logo objects
     */
    getLogosFromForm() {
        const tableBody = document.getElementById('logos-table-body');
        const rows = tableBody.querySelectorAll('.logo-row');
        const logos = [];
        
        rows.forEach(row => {
            const filename = row.querySelector('.logo-filename').value.trim();
            const fromDate = row.querySelector('.logo-from-date').value.trim();
            
            if (filename) {
                logos.push({
                    filename: filename,
                    from: fromDate || null
                });
            }
        });
        
        return logos;
    }

    /**
     * Populate logos form with existing artist data
     * @param {Object} artist - Artist object
     */
    populateLogosForm(artist) {
        this.clearLogosForm();
        
        if (!artist.logo) {
            // No logos, add one empty row
            this.addLogoRow();
            return;
        }
        
        if (typeof artist.logo === 'string') {
            // Backward compatibility: single logo string
            this.addLogoRow({
                filename: artist.logo,
                from: null
            });
        } else if (Array.isArray(artist.logo)) {
            // Multi-logo format
            if (artist.logo.length === 0) {
                this.addLogoRow();
            } else {
                artist.logo.forEach(logo => {
                    this.addLogoRow(logo);
                });
            }
        } else {
            // Fallback: add empty row
            this.addLogoRow();
        }
    }

    /**
     * Clear all logo rows from the table
     */
    clearLogosForm() {
        const tableBody = document.getElementById('logos-table-body');
        tableBody.innerHTML = '';
    }

    /**
     * Validate logos data
     * @param {Array} logos - Array of logo objects
     * @returns {Object} Validation result
     */
    validateLogos(logos) {
        const errors = [];
        
        if (!logos || logos.length === 0) {
            return { isValid: true, errors: [] }; // No logos is valid
        }
        
        // Check that exactly one logo has no "from" date (original logo)
        const originalLogos = logos.filter(logo => logo.from === null || logo.from === '');
        if (originalLogos.length === 0) {
            errors.push('Exactly one logo must have no "from" date (the original logo)');
        } else if (originalLogos.length > 1) {
            errors.push('Only one logo can have no "from" date (the original logo)');
        }
        
        // Validate filenames
        logos.forEach((logo, index) => {
            if (!logo.filename || logo.filename.trim() === '') {
                errors.push(`Logo ${index + 1}: Filename is required`);
            }
        });
        
        // Validate date formats
        logos.forEach((logo, index) => {
            if (logo.from && logo.from.trim() !== '') {
                const date = new Date(logo.from);
                if (isNaN(date.getTime())) {
                    errors.push(`Logo ${index + 1}: Invalid date format`);
                }
            }
        });
        
        // Check for duplicate filenames with same from date
        const seen = new Set();
        logos.forEach((logo, index) => {
            const key = `${logo.filename}|${logo.from || 'null'}`;
            if (seen.has(key)) {
                errors.push(`Logo ${index + 1}: Duplicate filename and date combination`);
            }
            seen.add(key);
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// ==================== GLOBAL FUNCTIONS ====================

// Global functions that are called from HTML onclick attributes
let adminManager;

/**
 * Initialize admin manager when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
});

/**
 * Show section (called from HTML)
 * @param {string} sectionName - Name of section to show
 */
function showSection(sectionName) {
    if (adminManager) {
        adminManager.showSection(sectionName);
    }
}

/**
 * Clear form (called from HTML)
 * @param {string} formId - ID of form to clear
 */
function clearForm(formId) {
    if (adminManager) {
        adminManager.clearForm(formId);
    }
}

/**
 * Filter data (called from HTML)
 * @param {string} type - Type of data to filter
 */
function filterData(type) {
    if (adminManager) {
        adminManager.filterData(type);
    }
}


/**
 * Save artists data (called from HTML)
 */
function saveArtistsData() {
    if (adminManager) {
        adminManager.saveArtistsData();
    }
}

/**
 * Save venues data (called from HTML)
 */
function saveVenuesData() {
    if (adminManager) {
        adminManager.saveVenuesData();
    }
}

/**
 * Save concerts data (called from HTML)
 */
function saveConcertsData() {
    if (adminManager) {
        adminManager.saveConcertsData();
    }
}


/**
 * Close modal (called from HTML)
 */
function closeModal() {
    if (adminManager) {
        adminManager.closeModal();
    }
}

/**
 * Close confirm modal (called from HTML)
 */
function closeConfirmModal() {
    if (adminManager) {
        adminManager.closeConfirmModal();
    }
}