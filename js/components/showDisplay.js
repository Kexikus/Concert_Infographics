// Show Display Component - Handles show display and formatting
class ShowDisplayManager {
    constructor() {
        // Initialize any needed properties
    }

    // Create reusable show display component (moved from router.js)
    createShowDisplay(eventId, highlightArtistId, options = {}) {
        const event = dataManager.getConcertById(eventId);
        if (!event) return '';

        const venue = dataManager.getVenueById(event.venueId);
        if (!venue) return '';

        const { compact = false, showPrice = true } = options;

        // Format date in German format
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Format price if available and requested
        let priceText = '';
        if (showPrice && event.price !== null && event.price !== undefined) {
            priceText = ` <span class="red-dot">•</span> €${event.price.toFixed(2)}`;
        }

        // Create artist lineup HTML
        const artistsHtml = event.artistIds.map(artistId => {
            const artist = dataManager.getArtistById(artistId);
            if (!artist) return '';

            const isHighlighted = artistId === highlightArtistId;
            const logoPath = dataManager.getArtistLogo(artistId, event.date);
            
            if (logoPath) {
                // Use logo with text fallback
                return `
                    <div class="show-artist ${isHighlighted ? 'highlighted' : ''} ${compact ? 'compact' : ''}">
                        <img src="${logoPath}" alt="${artist.name}" class="show-artist-logo"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                        <span class="show-artist-text" style="display: none;">${artist.name}</span>
                    </div>
                `;
            } else {
                // Use text only
                return `
                    <div class="show-artist ${isHighlighted ? 'highlighted' : ''} ${compact ? 'compact' : ''}">
                        <span class="show-artist-text">${artist.name}</span>
                    </div>
                `;
            }
        }).join('');

        // For compact mode, arrange artists horizontally
        const artistsClass = compact ? 'show-artists compact' : 'show-artists';

        return `
            <div class="show-display ${compact ? 'compact' : ''}">
                <div class="show-event-name">${event.name}</div>
                <div class="show-date-venue">${formattedDate} <span class="red-dot">•</span> ${venue.name}, ${venue.city}${priceText}</div>
                <div class="${artistsClass}">${artistsHtml}</div>
            </div>
        `;
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
            this.createShowDisplay(concert.id, artistId, { compact: true, showPrice: true })
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
}

// Create global instance
const showDisplayManager = new ShowDisplayManager();