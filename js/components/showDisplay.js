// Show Display Component - Handles show display and formatting
class ShowDisplayManager {
    constructor() {
        // Initialize any needed properties
    }

    // Create reusable show display component (refactored to use helper methods)
    createShowDisplay(eventId, highlightArtistId, options = {}) {
        const event = dataManager.getConcertById(eventId);
        if (!event) return '';

        const { compact = false } = options;

        // Use helper method for description
        const description = this.getEventDescription(eventId, { compact });

        // Use helper method for artists HTML
        const artistsHtml = this.getEventArtistsHtml(eventId, highlightArtistId, { compact });

        // Create event name/logo HTML using existing logic
        const eventLogoPath = this.getEventLogoPath(eventId);
        let eventNameHtml;
        if (eventLogoPath) {
            // Use logo with text fallback
            eventNameHtml = `
                <div class="show-event-name">
                    <img src="${eventLogoPath}" alt="${event.name}" class="show-event-logo"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                    <span class="show-event-text" style="display: none;">${event.name}</span>
                </div>
            `;
        } else {
            // Use text only
            eventNameHtml = `<div class="show-event-name">${event.name}</div>`;
        }

        return `<div class="show-display ${compact ? 'compact' : ''}">
                    <a href="#event/${eventId}" class="show-display-link">${eventNameHtml}</a>
                    <div class="show-date-venue">${description}</div>
                    ${artistsHtml}
                </div>`;
    }

    // Find first show for an artist (moved from router.js)
    findFirstShow(artistId) {
        const artistConcerts = dataManager.getConcertsByArtist(artistId);
        if (artistConcerts.length === 0) return null;

        // Sort by date to find chronologically first
        const sortedConcerts = artistConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));
        return sortedConcerts[0];
    }

    // Find first headline show for an artist (concerts only, not festivals) (moved from router.js)
    findFirstHeadlineShow(artistId) {
        const artistConcerts = dataManager.getConcertsByArtist(artistId);
        
        // Filter to only concerts (not festivals) where artist is headliner
        const headlineConcerts = artistConcerts.filter(concert =>
            concert.type === 'concert' &&
            concert.artistIds.length > 0 &&
            concert.artistIds[0] === artistId
        );

        if (headlineConcerts.length === 0) return null;

        // Sort by date to find chronologically first
        const sortedConcerts = headlineConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));
        return sortedConcerts[0];
    }

    // Initialize show sections (First Show and First Headline Show) (moved from router.js)
    initializeShowSections(artistId) {
        // Find first show
        const firstShow = this.findFirstShow(artistId);
        const firstShowContainer = document.getElementById('artist-first-show');
        if (firstShowContainer && firstShow) {
            firstShowContainer.innerHTML = this.createShowDisplay(firstShow.id, artistId);
        } else if (firstShowContainer) {
            firstShowContainer.innerHTML = '<div class="no-show">No shows found</div>';
        }

        // Find first headline show
        const firstHeadlineShow = this.findFirstHeadlineShow(artistId);
        const firstHeadlineShowContainer = document.getElementById('artist-first-headline-show');
        if (firstHeadlineShowContainer && firstHeadlineShow) {
            firstHeadlineShowContainer.innerHTML = this.createShowDisplay(firstHeadlineShow.id, artistId);
        } else if (firstHeadlineShowContainer) {
            firstHeadlineShowContainer.innerHTML = '<div class="no-show">No headline shows found</div>';
        }

        // Initialize All Shows section
        this.initializeAllShowsSection(artistId);
    }

    // Initialize All Shows section with grid layout (moved from router.js)
    initializeAllShowsSection(artistId) {
        const allShowsContainer = document.getElementById('artist-all-shows');
        if (!allShowsContainer) return;

        // Get all concerts for this artist, sorted chronologically (oldest first)
        const artistConcerts = dataManager.getConcertsByArtist(artistId);
        const sortedConcerts = artistConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sortedConcerts.length === 0) {
            allShowsContainer.innerHTML = '<div class="no-shows-grid">No shows found</div>';
            return;
        }

        // Create compact show displays for all concerts
        const showsHtml = sortedConcerts.map(concert =>
            this.createShowDisplay(concert.id, artistId, { compact: true })
        ).join('');

        allShowsContainer.innerHTML = `
            <div class="all-shows-grid">
                ${showsHtml}
            </div>
        `;
    }

    // Initialize artist show displays
    initializeArtistShowDisplays(artistId) {
        this.initializeShowSections(artistId);
    }

    // Initialize year show displays - shows all events for a specific year
    initializeYearShowDisplays(year) {
        const allEventsContainer = document.getElementById('year-all-events');
        if (!allEventsContainer) return;

        // Get all concerts for this year, sorted chronologically (oldest first)
        const yearConcerts = dataManager.getConcertsByYear(year);
        const sortedConcerts = yearConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sortedConcerts.length === 0) {
            allEventsContainer.innerHTML = '<div class="no-shows-grid">No events found for this year</div>';
            return;
        }

        // Create compact show displays for all concerts (no highlighted artist)
        const showsHtml = sortedConcerts.map(concert =>
            this.createShowDisplay(concert.id, null, { compact: true })
        ).join('');

        allEventsContainer.innerHTML = `
            <div class="all-shows-grid">
                ${showsHtml}
            </div>
        `;
    }

    // Initialize city show displays - shows all events for a specific city
    initializeCityShowDisplays(cityName) {
        const allEventsContainer = document.getElementById('city-all-events');
        if (!allEventsContainer) return;

        // Get all venues and filter by city name
        const allVenues = dataManager.getVenues();
        const cityVenues = allVenues.filter(venue =>
            normalizeStringForId(venue.city) === normalizeStringForId(cityName)
        );
        
        if (!cityVenues || cityVenues.length === 0) {
            allEventsContainer.innerHTML = '<div class="no-shows-grid">No venues found for this city</div>';
            return;
        }

        // Get venue IDs for this city
        const cityVenueIds = cityVenues.map(venue => venue.id);
        
        // Get all concerts and filter by city venues
        const allConcerts = dataManager.getConcerts();
        const cityConcerts = allConcerts.filter(concert =>
            cityVenueIds.includes(concert.venueId)
        );

        // Sort concerts by date (chronologically - first event first)
        const sortedConcerts = cityConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Create compact show displays for all concerts (no highlighted artist)
        const showsHtml = sortedConcerts.map(concert =>
            this.createShowDisplay(concert.id, null, { compact: true })
        ).join('');

        allEventsContainer.innerHTML = `
            <div class="all-shows-grid">
                ${showsHtml}
            </div>
        `;
    }

    // Initialize all events display - shows all events chronologically
    initializeAllEventsDisplay() {
        const allEventsContainer = document.getElementById('all-events-container');
        if (!allEventsContainer) return;

        // Get all concerts, sorted chronologically (oldest first)
        const allConcerts = dataManager.getConcerts();
        const sortedConcerts = allConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sortedConcerts.length === 0) {
            allEventsContainer.innerHTML = '<div class="no-shows-grid">No events found</div>';
            return;
        }

        // Create compact show displays for all concerts (no highlighted artist)
        const showsHtml = sortedConcerts.map(concert =>
            this.createShowDisplay(concert.id, null, { compact: true })
        ).join('');

        allEventsContainer.innerHTML = `
            <div class="all-shows-grid">
                ${showsHtml}
            </div>
        `;
    }

    // Extract event description (date, venue, price, capacity) for event page
    getEventDescription(eventId, options = {}) {
        const event = dataManager.getConcertById(eventId);
        if (!event) return '';

        const venue = dataManager.getVenueById(event.venueId);
        if (!venue) return '';

        const { compact = false } = options;

        // Format date in German format
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Get year for the date link
        const year = eventDate.getFullYear();
        
        // Sanitize city name for the city link
        const sanitizedCity = normalizeStringForId(venue.city);

        // Format price if available (not shown in compact view)
        let priceText = '';
        if (!compact && event.price !== null && event.price !== undefined) {
            priceText = ` <span style="color: var(--red);">•</span> ${event.price.toFixed(2)}€`;
        }

        // Format capacity if available (only in standard view)
        let capacityText = '';
        if (!compact && venue.capacity !== null && venue.capacity !== undefined) {
            const formattedCapacity = venue.capacity.toLocaleString('de-DE');
            capacityText = ` <span style="color: var(--red);">•</span> ${formattedCapacity} attendants`;
        }

        return `<a href="#year/${year}" class="date-link">${formattedDate}</a> <span style="color: var(--red);">•</span> <a href="#city/${sanitizedCity}" class="venue-link">${venue.name}, ${venue.city}</a>${priceText}${capacityText}`;
    }

    // Extract artists HTML for event page
    getEventArtistsHtml(eventId, highlightArtistId = null, options = {}) {
        const event = dataManager.getConcertById(eventId);
        if (!event) return '';

        const { compact = false } = options;

        // Create artist lineup HTML
        const artistsHtml = event.artistIds.map(artistId => {
            const artist = dataManager.getArtistById(artistId);
            if (!artist) return '';

            const isHighlighted = artistId === highlightArtistId;
            const logoPath = dataManager.getArtistLogo(artistId, event.date);
            
            if (logoPath) {
                // Use logo with text fallback
                return `
                    <a href="#artist/${artistId}" class="artist-link">
                        <div class="show-artist ${isHighlighted ? 'highlighted' : ''} ${compact ? 'compact' : ''}">
                            <img src="${logoPath}" alt="${artist.name}" class="show-artist-logo"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                            <span class="show-artist-text" style="display: none;">${artist.name}</span>
                        </div>
                    </a>
                `;
            } else {
                // Use text only
                return `
                    <a href="#artist/${artistId}" class="artist-link">
                        <div class="show-artist ${isHighlighted ? 'highlighted' : ''} ${compact ? 'compact' : ''}">
                            <span class="show-artist-text">${artist.name}</span>
                        </div>
                    </a>
                `;
            }
        }).join('');

        // Determine if we need two-column layout (more than 5 artists in non-compact view)
        const useTwoColumns = !compact && event.artistIds.length > 5;
        const artistsClass = compact ? 'show-artists compact' : `show-artists${useTwoColumns ? ' two-column' : ''}`;
        return `<div class="${artistsClass}">${artistsHtml}</div>`;
    }

    // Check if event has a logo
    hasEventLogo(eventId) {
        const eventLogoPath = dataManager.getConcertLogo(eventId);
        return eventLogoPath !== null && eventLogoPath !== undefined;
    }

    // Get event logo path
    getEventLogoPath(eventId) {
        return dataManager.getConcertLogo(eventId);
    }
}

// Create global instance
const showDisplayManager = new ShowDisplayManager();