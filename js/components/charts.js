// Charts Component - Handles all Chart.js visualizations
class ChartsManager {
    constructor() {
        this.charts = {};
        this.defaultColors = COLORS;
        this._lastScreenWasSmall = window.innerWidth <= 550;
    }

    // Helper function to get responsive y-axis width for horizontal bar charts
    getResponsiveYAxisWidth(defaultWidth = 200) {
        // Check if screen width is 550px or smaller
        if (window.innerWidth <= 550) {
            return 100;
        }
        return defaultWidth;
    }

    // Helper function to get responsive point radius for line charts
    getResponsivePointScaling() {
        // Check if screen width is 550px or smaller
        if (window.innerWidth <= 550) {
            return 1 / 1.5;
        }
        return 1;
    }

    // Helper function to break text into multiple lines based on available width
    breakTextIntoLines(text, maxWidth, ctx, font = '16px Arial') {
        ctx.font = font;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [text];
    }

    // Helper function to calculate dynamic chart container height for horizontal bar charts
    calculateHorizontalBarChartHeight(dataCount, barHeight = 40, padding = 80) {
        return (dataCount * barHeight) + padding;
    }

    // Helper function to set chart container height
    setChartContainerHeight(containerId, height) {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.height = height + 'px';
        }
    }

    // Base method for creating vertical bar charts with common configuration
    createVerticalBarChart(config) {
        const {
            canvasId,
            chartKey,
            datasets,
            labels,
            showLegend = true,
            legendPosition = 'top',
            stacked = false,
            clickHandler = null,
            tooltipCallbacks = {},
            yAxisCallback = null,
            customOptions = {},
            stackName = 'default'
        } = config;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts[chartKey]) {
            this.charts[chartKey].destroy();
        }

        // Apply common defaults to all datasets
        const processedDatasets = datasets.map(dataset => ({
            borderWidth: 1,
            borderSkipped: false,
            barPercentage: 0.8,
            categoryPercentage: 0.9,
            stack: stackName,
            ...dataset // User-provided properties override defaults
        }));

        // Base chart configuration
        const chartConfig = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: processedDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: showLegend,
                        position: legendPosition,
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: this.defaultColors.white,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return tooltipCallbacks.title ?
                                    tooltipCallbacks.title(context) :
                                    context[0].label;
                            },
                            beforeBody: tooltipCallbacks.beforeBody,
                            label: function(context) {
                                return tooltipCallbacks.label ?
                                    tooltipCallbacks.label(context) :
                                    `${context.dataset.label}: ${context.parsed.y}`;
                            },
                            filter: tooltipCallbacks.filter
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: stacked,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            color: this.defaultColors.white
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: stacked,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            },
                            callback: yAxisCallback || function(value) {
                                return value;
                            }
                        },
                        grid: {
                            color: this.defaultColors.lightGrey + '40'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                onClick: clickHandler || null,
                onHover: (event, elements) => {
                    // Only show pointer cursor when hovering over actual bar elements (not axis labels)
                    const isOverBar = elements.length > 0 && elements[0].element && elements[0].element.constructor.name === 'BarElement';
                    event.native.target.style.cursor = (isOverBar && clickHandler) ? 'pointer' : 'default';
                }
            }
        };

        // Merge custom options
        if (customOptions.plugins) {
            Object.assign(chartConfig.options.plugins, customOptions.plugins);
        }
        if (customOptions.scales) {
            Object.assign(chartConfig.options.scales, customOptions.scales);
        }
        if (customOptions.options) {
            Object.assign(chartConfig.options, customOptions.options);
        }

        // Create the chart
        this.charts[chartKey] = new Chart(ctx, chartConfig);
    }

    // Create Events Per Year Stacked Bar Chart with Shows Behind
    createEventsPerYearChart() {
        const eventsData = dataManager.getEventsPerYearByType();
        const showsData = dataManager.getShowsPerYearStats();
        const years = Object.keys(eventsData).sort();

        // Prepare data arrays
        const concertData = years.map(year => eventsData[year]?.concert || 0);
        const festivalData = years.map(year => eventsData[year]?.festival || 0);
        const showsDataArray = years.map(year => -showsData[year] || 0);

        const datasets = [
            // Shows dataset (behind, wider bars, offset)
            {
                label: 'Shows',
                data: showsDataArray,
                backgroundColor: this.defaultColors.black,
                borderColor: this.defaultColors.darkGrey,
                order: 2
            },
            // Concerts dataset (stacked, narrower bars, in front)
            {
                label: 'Concerts',
                data: concertData,
                backgroundColor: this.defaultColors.darkRed,
                borderColor: this.defaultColors.darkRed,
                order: 0
            },
            // Festivals dataset (stacked on top of concerts, narrower bars, in front)
            {
                label: 'Festivals',
                data: festivalData,
                backgroundColor: this.defaultColors.red,
                borderColor: this.defaultColors.red,
                order: 1
            }
        ];

        this.createVerticalBarChart({
            canvasId: 'events-per-year-chart',
            chartKey: 'eventsPerYear',
            datasets: datasets,
            labels: years,
            stacked: true,
            stackName: 'events',
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Events per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = Math.abs(context.parsed.y);
                    return `${datasetLabel}: ${value}`;
                }
            },
            yAxisCallback: function(value) {
                return Math.abs(value);
            }
        });
    }

    // Create Bands Per Year Chart with dual bars (total and first-time)
    createBandsPerYearChart() {
        const bandsData = dataManager.getBandsPerYearStats();
        const firstTimeBandsData = dataManager.getFirstTimeBandsPerYearStats();
        const years = Object.keys(bandsData).sort();

        // Prepare data arrays
        const totalBandsData = years.map(year => bandsData[year] || 0);
        const firstTimeBandsDataArray = years.map(year => firstTimeBandsData[year] || 0);
        // Calculate repeat bands (total - first-time) for stacking
        const repeatBandsData = years.map(year => (bandsData[year] || 0) - (firstTimeBandsData[year] || 0));

        const datasets = [
            // Repeat bands dataset (black bars, bottom of stack)
            {
                label: 'Total Bands',
                data: repeatBandsData,
                backgroundColor: this.defaultColors.black,
                borderColor: this.defaultColors.darkGrey,
                order: 2
            },
            // First-time bands dataset (red bars, top of stack)
            {
                label: 'First-time Bands',
                data: firstTimeBandsDataArray,
                backgroundColor: this.defaultColors.red,
                borderColor: this.defaultColors.darkRed,
                order: 1
            }
        ];

        this.createVerticalBarChart({
            canvasId: 'bands-per-year-chart',
            chartKey: 'bandsPerYear',
            datasets: datasets,
            labels: years,
            stacked: true,
            stackName: 'bands',
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Bands per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const yearIndex = context.dataIndex;
                    
                    if (datasetLabel === 'Total Bands') {
                        // Show total bands for the black portion
                        const totalBands = totalBandsData[yearIndex];
                        return `Total Bands: ${totalBands}`;
                    } else {
                        // Show first-time bands for the red portion
                        const value = context.parsed.y;
                        return `${datasetLabel}: ${value}`;
                    }
                }
            }
        });
    }

    // Base function for creating horizontal bar charts with common configuration
    createHorizontalBarChart(config) {
        const {
            canvasId,
            chartKey,
            labels,
            data,
            datasetLabel = 'Count',
            clickHandler = null,
            valueFormatter = (value) => value.toString(),
            yAxisWidth = this.getResponsiveYAxisWidth(200),
            customEventHandlers = null,
            customDrawFunction = null,
            clickData = null // Array of data objects for click handling
        } = config;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists first
        if (this.charts[chartKey]) {
            this.charts[chartKey].destroy();
        }

        // Calculate and set dynamic container height with consistent 40px bar height
        const chartHeight = this.calculateHorizontalBarChartHeight(data.length, 40, 80);
        this.setChartContainerHeight(canvasId, chartHeight);

        // Base afterDraw function that always handles value positioning
        const baseAfterDraw = (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            // Always draw values with smart positioning - inside bar if it fits, otherwise to the right
            meta.data.forEach((bar, index) => {
                const value = data[index];
                const displayValue = valueFormatter(value);
                
                ctx.fillStyle = this.defaultColors.white;
                ctx.font = 'bold 20px Arial';
                ctx.textBaseline = 'middle';
                
                // Measure text width to determine if it fits in the bar
                const textWidth = ctx.measureText(displayValue).width;
                const barWidth = bar.x - chart.chartArea.left;
                
                if (textWidth + 20 <= barWidth) {
                    // Text fits inside the bar
                    ctx.textAlign = 'right';
                    ctx.fillText(displayValue, bar.x - 10, bar.y);
                } else {
                    // Text doesn't fit, place it to the right of the bar
                    ctx.textAlign = 'left';
                    ctx.fillText(displayValue, bar.x + 10, bar.y);
                }
            });
            
            // If custom draw function is provided, call it for additional drawing
            if (customDrawFunction) {
                customDrawFunction(chart);
            } else {
                // Default: draw labels on the left with line-breaking
                meta.data.forEach((bar, index) => {
                    const label = labels[index];
                    ctx.fillStyle = this.defaultColors.white;
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    
                    // Calculate available width for text (leave some padding)
                    const availableWidth = yAxisWidth * 0.9;
                    
                    // Break text into lines if needed
                    const lines = this.breakTextIntoLines(label, availableWidth, ctx, '16px Arial');
                    
                    // Calculate starting Y position for multi-line text (center vertically)
                    const lineHeight = 18;
                    const totalHeight = lines.length * lineHeight;
                    const startY = bar.y - (totalHeight / 2) + (lineHeight / 2);
                    
                    // Draw each line
                    lines.forEach((line, lineIndex) => {
                        const y = startY + (lineIndex * lineHeight);
                        ctx.fillText(line, yAxisWidth * 0.95, y);
                    });
                });
            }
        };

        this.charts[chartKey] = new Chart(ctx, {
            type: 'bar',
            plugins: [{
                afterDraw: baseAfterDraw
            }],
            data: {
                labels: labels,
                datasets: [{
                    label: datasetLabel,
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderWidth: 1,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // This makes it horizontal
                interaction: {
                    intersect: false,
                    mode: 'none' // Disable all hover interactions
                },
                hover: {
                    mode: null // Disable hover mode
                },
                onHover: null, // Completely disable hover
                layout: {
                    padding: {
                        left: 10 // Add small padding for value labels in front of bars
                    }
                },
                elements: {
                    bar: {
                        barPercentage: 0.8,
                        categoryPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false // Disable tooltips
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        display: false, // Hide x-axis ticks
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 16
                            },
                            callback: function(value, index, values) {
                                // Return empty string, we'll draw labels separately
                                return '';
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            color: this.defaultColors.white
                        },
                        afterFit: function(scale) {
                            scale.width = yAxisWidth; // Configurable width for labels
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });

        // Handle unified click handling system
        if (clickHandler && clickData) {
            // Store event handlers for cleanup
            if (!ctx._chartEventHandlers) {
                ctx._chartEventHandlers = {};
            }

            // Remove existing event handlers for this chart key
            if (ctx._chartEventHandlers[chartKey]) {
                ctx._chartEventHandlers[chartKey].forEach(({ type, handler }) => {
                    ctx.removeEventListener(type, handler);
                });
                delete ctx._chartEventHandlers[chartKey];
            }

            // Unified click handler
            const clickHandlerFn = (event) => {
                const rect = ctx.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // Get chart area bounds
                const chart = this.charts[chartKey];
                if (!chart) return; // Chart might be destroyed
                
                const meta = chart.getDatasetMeta(0);
                
                // Check if click is within any bar area (including label area on the left)
                meta.data.forEach((bar, index) => {
                    const barTop = bar.y - 20; // Bar height/2
                    const barBottom = bar.y + 20; // Bar height/2
                    const barLeft = 10; // Start from label area (left padding)
                    const barRight = bar.x;
                    
                    if (x >= barLeft && x <= barRight && y >= barTop && y <= barBottom) {
                        const dataItem = clickData[index];
                        if (dataItem) {
                            clickHandler(dataItem, index);
                        }
                    }
                });
            };

            // Unified mousemove handler for pointer cursor
            const mouseMoveHandlerFn = (event) => {
                const rect = ctx.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                // Get chart area bounds
                const chart = this.charts[chartKey];
                if (!chart) return; // Chart might be destroyed
                
                const meta = chart.getDatasetMeta(0);
                
                let isOverClickableArea = false;
                
                // Check if mouse is over any bar area (including label area on the left)
                meta.data.forEach((bar, index) => {
                    const barTop = bar.y - 20; // Bar height/2
                    const barBottom = bar.y + 20; // Bar height/2
                    const barLeft = 10; // Start from label area (left padding)
                    const barRight = bar.x;
                    
                    if (x >= barLeft && x <= barRight && y >= barTop && y <= barBottom) {
                        const dataItem = clickData[index];
                        if (dataItem) {
                            isOverClickableArea = true;
                        }
                    }
                });
                
                // Set cursor style
                ctx.style.cursor = isOverClickableArea ? 'pointer' : 'default';
            };

            // Add event listeners
            ctx.addEventListener('click', clickHandlerFn);
            ctx.addEventListener('mousemove', mouseMoveHandlerFn);

            // Store handlers for cleanup
            ctx._chartEventHandlers[chartKey] = [
                { type: 'click', handler: clickHandlerFn },
                { type: 'mousemove', handler: mouseMoveHandlerFn }
            ];
        }

        // Handle custom event handlers (click, mousemove, etc.) - for backward compatibility
        if (customEventHandlers) {
            // Store event handlers for cleanup
            if (!ctx._chartEventHandlers) {
                ctx._chartEventHandlers = {};
            }

            // Remove existing event handlers for this chart key (if not already handled above)
            if (!clickHandler && ctx._chartEventHandlers[chartKey]) {
                ctx._chartEventHandlers[chartKey].forEach(({ type, handler }) => {
                    ctx.removeEventListener(type, handler);
                });
                delete ctx._chartEventHandlers[chartKey];
            }

            // Add new event handlers
            const handlers = ctx._chartEventHandlers[chartKey] || [];
            customEventHandlers.forEach(({ type, handler }) => {
                ctx.addEventListener(type, handler);
                handlers.push({ type, handler });
            });

            // Store handlers for cleanup
            ctx._chartEventHandlers[chartKey] = handlers;
        }
    }

    // Generic function to create horizontal bar charts with artist logos/names
    createHorizontalArtistBarChart(config) {
        const {
            canvasId,
            chartKey,
            artistData,
            label = 'Count',
            clickHandler = null,
            showHeadlinerColors = true
        } = config;

        const labels = artistData.map(artist => artist.name);
        const data = artistData.map(artist => artist.count);

        // Get the y-axis width for right alignment (responsive based on screen size)
        const yAxisWidth = this.getResponsiveYAxisWidth(200);

        // Custom draw function for artist logos and names (values are handled by base function)
        const artistDrawFunction = (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            
            const rightAlignX = yAxisWidth * 0.95; // Right edge minus padding
            
            // Draw logos and artist names
            meta.data.forEach((bar, index) => {
                const artist = artistData[index];
                if (artist && artist.logo) {
                    const img = new Image();
                    img.onload = function() {
                        // Calculate original image dimensions
                        const originalWidth = img.naturalWidth;
                        const originalHeight = img.naturalHeight;
                        
                        // Define constraints
                        const maxHeight = 28; // Slightly smaller than bar height for padding
                        const maxWidth = Math.max(yAxisWidth * 0.75, 75); // Responsive width limit for logos, minimum 75px
                        
                        // Calculate aspect ratio
                        const aspectRatio = originalWidth / originalHeight;
                        
                        // Calculate scaled dimensions preserving aspect ratio
                        let scaledWidth, scaledHeight;
                        
                        if (originalHeight > maxHeight) {
                            // Height is the limiting factor
                            scaledHeight = maxHeight;
                            scaledWidth = scaledHeight * aspectRatio;
                        } else {
                            // Use original height if it fits
                            scaledHeight = originalHeight;
                            scaledWidth = originalWidth;
                        }
                        
                        // Check if width exceeds maximum and adjust if needed
                        if (scaledWidth > maxWidth) {
                            scaledWidth = maxWidth;
                            scaledHeight = scaledWidth / aspectRatio;
                        }
                        
                        // Position the logo (right-aligned and centered vertically)
                        const x = rightAlignX - scaledWidth;
                        const y = bar.y - scaledHeight / 2;
                        
                        // Check if this artist is a headliner and apply red tint if so
                        if (showHeadlinerColors && dataManager.isHeadliner(artist.id)) {
                            // Create an off-screen canvas to process the image
                            const tempCanvas = document.createElement('canvas');
                            const tempCtx = tempCanvas.getContext('2d');
                            tempCanvas.width = scaledWidth;
                            tempCanvas.height = scaledHeight;
                            
                            // Draw the original image to the temp canvas
                            tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
                            
                            // Get the image data
                            const imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);
                            const data = imageData.data;
                            
                            // Process each pixel to convert white to red
                            for (let i = 0; i < data.length; i += 4) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                const a = data[i + 3];
                                
                                // If pixel is white or light (assuming logo is white)
                                if (r > 200 && g > 200 && b > 200 && a > 0) {
                                    // Convert to red using centralized color
                                    const redRgb = COLOR_UTILS.hexToRgb(COLORS.red);
                                    data[i] = redRgb.r;     // Red component
                                    data[i + 1] = redRgb.g;  // Green component
                                    data[i + 2] = redRgb.b;  // Blue component
                                    // Keep original alpha
                                }
                            }
                            
                            // Put the modified image data back
                            tempCtx.putImageData(imageData, 0, 0);
                            
                            // Draw the processed image to the main canvas
                            ctx.drawImage(tempCanvas, x, y);
                        } else {
                            // Draw the image normally for non-headliners
                            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                        }
                    };
                    img.onerror = function() {
                        // Fallback to text if image fails to load
                        // Color text red if artist is a headliner, white otherwise
                        ctx.fillStyle = (showHeadlinerColors && dataManager.isHeadliner(artist.id)) ? COLORS.red : COLORS.white;
                        ctx.font = '16px Arial';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';
                        
                        // Calculate available width for text (leave some padding)
                        const availableWidth = yAxisWidth * 0.9;
                        
                        // Break text into lines if needed
                        const lines = chartsManager.breakTextIntoLines(artist.name, availableWidth, ctx, '16px Arial');
                        
                        // Calculate starting Y position for multi-line text (center vertically)
                        const lineHeight = 18;
                        const totalHeight = lines.length * lineHeight;
                        const startY = bar.y - (totalHeight / 2) + (lineHeight / 2);
                        
                        // Draw each line
                        lines.forEach((line, lineIndex) => {
                            const y = startY + (lineIndex * lineHeight);
                            ctx.fillText(line, rightAlignX, y);
                        });
                    };
                    img.src = artist.logo;
                } else if (artist) {
                    // Draw text for artists without logos
                    // Color text red if artist is a headliner, white otherwise
                    ctx.fillStyle = (showHeadlinerColors && dataManager.isHeadliner(artist.id)) ? COLORS.red : COLORS.white;
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                    
                    // Calculate available width for text (leave some padding)
                    const availableWidth = yAxisWidth * 0.9;
                    
                    // Break text into lines if needed
                    const lines = chartsManager.breakTextIntoLines(artist.name, availableWidth, ctx, '16px Arial');
                    
                    // Calculate starting Y position for multi-line text (center vertically)
                    const lineHeight = 18;
                    const totalHeight = lines.length * lineHeight;
                    const startY = bar.y - (totalHeight / 2) + (lineHeight / 2);
                    
                    // Draw each line
                    lines.forEach((line, lineIndex) => {
                        const y = startY + (lineIndex * lineHeight);
                        ctx.fillText(line, rightAlignX, y);
                    });
                }
            });
        };

        // Use the base horizontal bar chart function with unified click handling
        this.createHorizontalBarChart({
            canvasId,
            chartKey,
            labels,
            data,
            yAxisWidth: yAxisWidth,
            datasetLabel: label,
            customDrawFunction: artistDrawFunction,
            clickHandler: clickHandler ? (artist, index) => {
                if (artist && artist.id) {
                    clickHandler(artist);
                }
            } : null,
            clickData: artistData
        });
    }

    // Create Band Frequency Horizontal Bar Chart
    createBandFrequencyChart() {
        const frequentArtists = dataManager.getFrequentArtists(2); // Artists seen at least twice
        
        this.createHorizontalArtistBarChart({
            canvasId: 'band-frequency-chart',
            chartKey: 'bandFrequency',
            artistData: frequentArtists,
            label: 'Number of Concerts',
            clickHandler: (artist) => {
                console.log('Custom click handler - navigating to:', `artist/${artist.id}`);
                router.navigateTo(`artist/${artist.id}`);
            },
            showHeadlinerColors: true
        });
    }

    // Create Top Venues Horizontal Bar Chart
    createTopVenuesChart() {
        const locationStats = dataManager.getLocationStatistics();
        const topVenues = locationStats.topVenues;
        const labels = topVenues.map(venue => venue.name);
        const data = topVenues.map(venue => venue.count);

        // Use the base horizontal bar chart function with unified click handling
        this.createHorizontalBarChart({
            canvasId: 'top-venues-chart',
            chartKey: 'topVenues',
            labels,
            data,
            datasetLabel: 'Number of Events',
            clickHandler: (venue, index) => {
                if (venue && venue.name) {
                    // Find the city for this venue
                    const venueData = dataManager.getVenues().find(v => v.name === venue.name);
                    if (venueData && venueData.city) {
                        console.log('Top venues chart clicked - navigating to city:', venueData.city);
                        router.navigateTo(`city/${normalizeStringForId(venueData.city)}`);
                    }
                }
            },
            clickData: topVenues
        });
    }

    // Create Top Cities Horizontal Bar Chart
    createTopCitiesChart() {
        const locationStats = dataManager.getLocationStatistics();
        const topCities = locationStats.topCities;
        const labels = topCities.map(city => city.name);
        const data = topCities.map(city => city.count);

        // Use the base horizontal bar chart function with unified click handling
        this.createHorizontalBarChart({
            canvasId: 'top-cities-chart',
            chartKey: 'topCities',
            labels,
            data,
            datasetLabel: 'Number of Events',
            clickHandler: (city, index) => {
                if (city && city.name) {
                    console.log('Top cities chart clicked - navigating to city:', city.name);
                    router.navigateTo(`city/${normalizeStringForId(city.name)}`);
                }
            },
            clickData: topCities
        });
    }

    // Base method for creating line charts with common configuration
    createLineChart(config) {
        const {
            canvasId,
            chartKey,
            datasets,
            labels,
            showLegend = true,
            legendPosition = 'top',
            clickHandler = null,
            tooltipCallbacks = {},
            yAxisCallback = null,
            customOptions = {}
        } = config;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts[chartKey]) {
            this.charts[chartKey].destroy();
        }

        // Apply common defaults to all datasets with responsive point sizes
        const processedDatasets = datasets.map(dataset => ({
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointBorderWidth: 3 * this.getResponsivePointScaling(),
            pointRadius: 6 * this.getResponsivePointScaling(),
            pointHoverRadius: 8 * this.getResponsivePointScaling(),
            tension: 0.5, // Straight lines
            spanGaps: true,
            ...dataset // User-provided properties override defaults
        }));

        // Base chart configuration
        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: processedDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: showLegend,
                        position: legendPosition,
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: this.defaultColors.white,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return tooltipCallbacks.title ?
                                    tooltipCallbacks.title(context) :
                                    context[0].label;
                            },
                            label: function(context) {
                                return tooltipCallbacks.label ?
                                    tooltipCallbacks.label(context) :
                                    `${context.dataset.label}: ${context.parsed.y !== null ? context.parsed.y.toLocaleString() : 'No data'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: this.defaultColors.lightGrey + '20'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            },
                            callback: yAxisCallback || function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: this.defaultColors.lightGrey + '40'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                onClick: clickHandler || null,
                onHover: (event, elements) => {
                    // Show pointer cursor when hovering over data points
                    const isOverDataPoint = elements.length > 0;
                    event.native.target.style.cursor = (isOverDataPoint && clickHandler) ? 'pointer' : 'default';
                }
            }
        };

        // Merge custom options
        if (customOptions.plugins) {
            Object.assign(chartConfig.options.plugins, customOptions.plugins);
        }
        if (customOptions.scales) {
            Object.assign(chartConfig.options.scales, customOptions.scales);
        }
        if (customOptions.options) {
            Object.assign(chartConfig.options, customOptions.options);
        }

        // Create the chart
        this.charts[chartKey] = new Chart(ctx, chartConfig);
    }

    // Create Average Venue Size per Year Line Chart
    createVenueSizeChart() {
        const venueSizeData = dataManager.getAverageVenueSizePerYear();
        // Get all available years from the entire concert history to show complete timeline
        const years = dataManager.getAvailableYears().sort();

        // Prepare data arrays
        const overallData = years.map(year => venueSizeData[year]?.overall || null);
        const concertData = years.map(year => venueSizeData[year]?.concert || null);
        const festivalData = years.map(year => venueSizeData[year]?.festival || null);

        const datasets = [
            // Overall (black line)
            {
                label: 'Overall',
                data: overallData,
                borderColor: this.defaultColors.black,
                pointBackgroundColor: this.defaultColors.black,
                pointBorderColor: this.defaultColors.black
            },
            // Festival (bright red line)
            {
                label: 'Festival',
                data: festivalData,
                borderColor: this.defaultColors.red,
                pointBackgroundColor: this.defaultColors.red,
                pointBorderColor: this.defaultColors.red
            },
            // Concert (dark red line)
            {
                label: 'Concert',
                data: concertData,
                borderColor: this.defaultColors.darkRed,
                pointBackgroundColor: this.defaultColors.darkRed,
                pointBorderColor: this.defaultColors.darkRed
            }
        ];

        this.createLineChart({
            canvasId: 'venue-size-chart',
            chartKey: 'venueSize',
            datasets: datasets,
            labels: years,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Venue size chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return value !== null ? `${datasetLabel}: ${value.toLocaleString()}` : `${datasetLabel}: No data`;
                }
            }
        });
    }

    // Create Cost Per Year Vertical Bar Chart
    createCostPerYearChart() {
        const costData = dataManager.getCostPerYearStats();
        const years = Object.keys(costData).sort();
        const data = years.map(year => costData[year] || 0);

        const datasets = [{
            label: 'Total Cost',
            data: data,
            backgroundColor: this.defaultColors.black,
            borderColor: this.defaultColors.darkGrey
        }];

        this.createVerticalBarChart({
            canvasId: 'cost-per-year-chart',
            chartKey: 'costPerYear',
            datasets: datasets,
            labels: years,
            showLegend: false,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Cost per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const value = context.parsed.y;
                    return `Total Cost: ${value}€`;
                }
            },
            yAxisCallback: function(value) {
                return value + '€';
            }
        });
    }

    // Create Cost Trend Line Chart (Average Cost per Show by Year)
    createCostTrendChart() {
        const costTrendData = dataManager.getAverageCostPerShowByYear();
        const years = Object.keys(costTrendData).sort();

        // Prepare data arrays
        const overallData = years.map(year => costTrendData[year]?.overall || null);
        const festivalData = years.map(year => costTrendData[year]?.festival || null);
        const concertData = years.map(year => costTrendData[year]?.concert || null);

        const datasets = [
            // Concert (dark red line)
            {
                label: 'Concerts',
                data: concertData,
                borderColor: this.defaultColors.darkRed,
                pointBackgroundColor: this.defaultColors.darkRed,
                pointBorderColor: this.defaultColors.darkRed
            },
            // Festival (light red line)
            {
                label: 'Festivals',
                data: festivalData,
                borderColor: this.defaultColors.red,
                pointBackgroundColor: this.defaultColors.red,
                pointBorderColor: this.defaultColors.red
            },
            // Overall (black line)
            {
                label: 'All Events',
                data: overallData,
                borderColor: this.defaultColors.black,
                pointBackgroundColor: this.defaultColors.black,
                pointBorderColor: this.defaultColors.black
            }
        ];

        this.createLineChart({
            canvasId: 'cost-trend-chart',
            chartKey: 'costTrend',
            datasets: datasets,
            labels: years,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Cost trend chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return value !== null ? `${datasetLabel}: ${value}€` : `${datasetLabel}: No data`;
                }
            },
            yAxisCallback: function(value) {
                return value + '€';
            }
        });
    }

    // Destroy all charts
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // Resize all charts
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    // Get chart instance by name
    getChart(name) {
        return this.charts[name];
    }

    // Check if charts are initialized
    areChartsInitialized() {
        return Object.keys(this.charts).length > 0;
    }

    // Render Other Artists section
    renderOtherArtists() {
        const otherArtistsGrid = document.getElementById('otherArtistsGrid');
        if (!otherArtistsGrid) return;

        const otherArtists = dataManager.getOtherArtists();
        
        if (otherArtists.length === 0) {
            otherArtistsGrid.innerHTML = '<p style="color: var(--light-grey); text-align: center; grid-column: 1 / -1;">No other artists found</p>';
            return;
        }

        otherArtistsGrid.innerHTML = '';

        otherArtists.forEach(artist => {
            // Create link element that wraps the artist item
            const artistLink = document.createElement('a');
            artistLink.href = artist.id ? `#artist/${artist.id}` : '#';
            artistLink.className = 'artist-item';

            // Create logo/name element
            if (artist.logo) {
                const logoImg = document.createElement('img');
                logoImg.className = 'artist-logo';
                logoImg.src = artist.logo;
                logoImg.alt = artist.name;
                
                // Apply red filter to headliner logos
                if (dataManager.isHeadliner(artist.id)) {
                    artistLink.classList.add('highlighted');
                }
                
                // Add error handling for missing logos
                logoImg.onerror = function() {
                    // Replace with text if logo fails to load
                    const textElement = document.createElement('div');
                    textElement.className = 'artist-name';
                    textElement.textContent = artist.name;
                    // Color text red if artist is a headliner
                    if (dataManager.isHeadliner(artist.id)) {
                        textElement.style.color = COLORS.red;
                    }
                    artistLink.innerHTML = '';
                    artistLink.appendChild(textElement);
                };

                // Only add the logo - no name when logo exists and loads successfully
                artistLink.appendChild(logoImg);
            } else {
                // No logo, just show name
                const nameElement = document.createElement('div');
                nameElement.className = 'artist-name';
                nameElement.textContent = artist.name;
                // Color text red if artist is a headliner
                if (dataManager.isHeadliner(artist.id)) {
                    nameElement.style.color = COLORS.red;
                }
                artistLink.appendChild(nameElement);
            }

            otherArtistsGrid.appendChild(artistLink);
        });
    }

    // Create Events Per Year Chart (Events only, no Shows bars)
    createEventsPerYearChartEvents() {
        const eventsData = dataManager.getEventsPerYearByType();
        const years = Object.keys(eventsData).sort();

        // Prepare data arrays
        const concertData = years.map(year => eventsData[year]?.concert || 0);
        const festivalData = years.map(year => eventsData[year]?.festival || 0);
        const totalData = years.map(year => (eventsData[year]?.concert || 0) + (eventsData[year]?.festival || 0));

        const datasets = [
            // Festivals dataset (top of stack) - LEGEND ORDER: First
            {
                label: 'Festivals',
                data: festivalData,
                backgroundColor: this.defaultColors.red,
                borderColor: this.defaultColors.red,
                order: 1
            },
            // Concerts dataset (bottom of stack) - LEGEND ORDER: Second
            {
                label: 'Concerts',
                data: concertData,
                backgroundColor: this.defaultColors.darkRed,
                borderColor: this.defaultColors.darkRed,
                order: 0
            }
        ];

        this.createVerticalBarChart({
            canvasId: 'events-per-year-chart-detailed',
            chartKey: 'eventsPerYearEvents',
            datasets: datasets,
            labels: years,
            stacked: true,
            stackName: 'events',
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Events per year (events view) chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                beforeBody: function(context) {
                    const yearIndex = context[0].dataIndex;
                    const totalEvents = totalData[yearIndex];
                    return `Total Events: ${totalEvents}`;
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return `${datasetLabel}: ${value}`;
                }
            }
        });
    }

    // Create Shows Per Year Vertical Bar Chart
    createShowsPerYearChart() {
        const showsData = dataManager.getShowsPerYearStats();
        const years = Object.keys(showsData).sort();
        const data = years.map(year => showsData[year] || 0);

        const datasets = [{
            label: 'Shows',
            data: data,
            backgroundColor: this.defaultColors.black,
            borderColor: this.defaultColors.darkGrey
        }];

        this.createVerticalBarChart({
            canvasId: 'shows-per-year-chart',
            chartKey: 'showsPerYear',
            datasets: datasets,
            labels: years,
            showLegend: false,
            stacked: true,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Shows per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const value = context.parsed.y;
                    return `Shows: ${value}`;
                }
            }
        });
    }

    // Create Event Type Pie Chart
    createEventTypePieChart() {
        const ctx = document.getElementById('event-types-pie-chart');
        if (!ctx) return;

        const pieData = dataManager.getEventTypePieData();
        const labels = pieData.map(item => item.label);
        const data = pieData.map(item => item.value);
        const colors = pieData.map(item => item.color);

        // Destroy existing chart if it exists
        if (this.charts.eventTypePie) {
            this.charts.eventTypePie.destroy();
        }

        this.charts.eventTypePie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: this.defaultColors.white,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                rotation: 90,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1).replace('.', '.');
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Create Artist Average Venue Size per Year Line Chart
    createArtistVenueSizeChart(artistId) {
        const venueSizeData = dataManager.getArtistVenueSizePerYear(artistId);
        // Get all available years from the entire concert history to show complete timeline
        const years = dataManager.getAvailableYears().sort();

        // Prepare data arrays
        const allShowsData = years.map(year => venueSizeData[year]?.allShows || null);
        const concertsOnlyData = years.map(year => venueSizeData[year]?.concertsOnly || null);
        const headlineShowsData = years.map(year => venueSizeData[year]?.headlineShows || null);

        const datasets = [
            // All Shows (black line)
            {
                label: 'All Shows',
                data: allShowsData,
                borderColor: this.defaultColors.black,
                pointBackgroundColor: this.defaultColors.black,
                pointBorderColor: this.defaultColors.black,
                order: 2
            },
            // Concerts Only (dark red line)
            {
                label: 'Concerts Only',
                data: concertsOnlyData,
                borderColor: this.defaultColors.darkRed,
                pointBackgroundColor: this.defaultColors.darkRed,
                pointBorderColor: this.defaultColors.darkRed,
                order: 1
            },
            // Headline Shows (bright red line)
            {
                label: 'Headline Shows',
                data: headlineShowsData,
                borderColor: this.defaultColors.red,
                pointBackgroundColor: this.defaultColors.red,
                pointBorderColor: this.defaultColors.red,
                order: 0
            }
        ];

        this.createLineChart({
            canvasId: 'artist-venue-size-chart',
            chartKey: 'artistVenueSize',
            datasets: datasets,
            labels: years,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Artist venue size chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return value !== null ? `${datasetLabel}: ${value.toLocaleString()}` : `${datasetLabel}: No data`;
                }
            }
        });
    }

    // Create artist-specific shows per year chart (moved from router.js)
    createArtistShowsPerYearChart(artistId) {
        // Get all available years from the entire concert history
        const allYears = dataManager.getAvailableYears();
        
        // Get concerts for this specific artist
        const artistConcerts = dataManager.getConcertsByArtist(artistId);
        
        // Group concerts by year and count shows (artist appearances)
        const showsPerYear = {};
        
        // Initialize all years with 0
        allYears.forEach(year => {
            showsPerYear[year] = 0;
        });
        
        // Count actual shows for this artist
        artistConcerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            // Count how many times this artist appears in this concert (should be 1, but being safe)
            const artistAppearances = concert.artistIds.filter(id => id === artistId).length;
            showsPerYear[year] = (showsPerYear[year] || 0) + artistAppearances;
        });

        const years = allYears.sort();
        const data = years.map(year => showsPerYear[year] || 0);

        const datasets = [{
            label: 'Shows',
            data: data,
            backgroundColor: this.defaultColors.black,
            borderColor: this.defaultColors.darkGrey
        }];

        this.createVerticalBarChart({
            canvasId: 'artist-shows-per-year-chart',
            chartKey: 'artistShowsPerYear',
            datasets: datasets,
            labels: years,
            showLegend: false,
            stacked: true,
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = years[dataIndex];
                    console.log('Artist shows per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                label: function(context) {
                    const value = context.parsed.y;
                    return `Shows: ${value}`;
                }
            }
        });
    }

    // Helper function to convert month number to month name
    getMonthName(monthNumber) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[monthNumber - 1] || '';
    }

    // Create Events Per Month Chart for a specific year (modified from createEventsPerYearChartEvents)
    createEventsPerMonthChart(year) {
        // Filter concerts for the specific year
        const yearConcerts = dataManager.getConcertsByYear(year);
        
        // Group events by month and type
        const monthlyData = {};
        for (let month = 1; month <= 12; month++) {
            monthlyData[month] = { concert: 0, festival: 0 };
        }

        yearConcerts.forEach(concert => {
            const month = new Date(concert.date).getMonth() + 1; // getMonth() returns 0-11
            monthlyData[month][concert.type] = (monthlyData[month][concert.type] || 0) + 1;
        });

        // Prepare data arrays
        const months = Array.from({length: 12}, (_, i) => i + 1);
        const monthLabels = months.map(month => this.getMonthName(month));
        const concertData = months.map(month => monthlyData[month]?.concert || 0);
        const festivalData = months.map(month => monthlyData[month]?.festival || 0);
        const totalData = months.map(month => (monthlyData[month]?.concert || 0) + (monthlyData[month]?.festival || 0));

        const datasets = [
            // Festivals dataset (top of stack) - LEGEND ORDER: First
            {
                label: 'Festivals',
                data: festivalData,
                backgroundColor: this.defaultColors.red,
                borderColor: this.defaultColors.red,
                order: 1
            },
            // Concerts dataset (bottom of stack) - LEGEND ORDER: Second
            {
                label: 'Concerts',
                data: concertData,
                backgroundColor: this.defaultColors.darkRed,
                borderColor: this.defaultColors.darkRed,
                order: 0
            }
        ];

        this.createVerticalBarChart({
            canvasId: 'year-events-per-month-chart',
            chartKey: 'eventsPerMonth',
            datasets: datasets,
            labels: monthLabels,
            stacked: true,
            stackName: 'events',
            tooltipCallbacks: {
                title: function(context) {
                    return `${context[0].label} ${year}`;
                },
                beforeBody: function(context) {
                    const monthIndex = context[0].dataIndex;
                    const totalEvents = totalData[monthIndex];
                    return `Total Events: ${totalEvents}`;
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return `${datasetLabel}: ${value}`;
                }
            }
        });
    }

    // Create Shows Per Month Chart for a specific year (modified from createShowsPerYearChart)
    createShowsPerMonthChart(year) {
        // Filter concerts for the specific year
        const yearConcerts = dataManager.getConcertsByYear(year);
        
        // Group shows by month
        const monthlyShows = {};
        for (let month = 1; month <= 12; month++) {
            monthlyShows[month] = 0;
        }

        yearConcerts.forEach(concert => {
            const month = new Date(concert.date).getMonth() + 1; // getMonth() returns 0-11
            const showCount = concert.artistIds.length;
            monthlyShows[month] = (monthlyShows[month] || 0) + showCount;
        });

        // Prepare data arrays
        const months = Array.from({length: 12}, (_, i) => i + 1);
        const monthLabels = months.map(month => this.getMonthName(month));
        const data = months.map(month => monthlyShows[month] || 0);

        const datasets = [{
            label: 'Shows',
            data: data,
            backgroundColor: this.defaultColors.black,
            borderColor: this.defaultColors.darkGrey
        }];

        this.createVerticalBarChart({
            canvasId: 'year-shows-per-month-chart',
            chartKey: 'showsPerMonth',
            datasets: datasets,
            labels: monthLabels,
            showLegend: false,
            stacked: true,
            tooltipCallbacks: {
                title: function(context) {
                    return `${context[0].label} ${year}`;
                },
                label: function(context) {
                    const value = context.parsed.y;
                    return `Shows: ${value}`;
                }
            }
        });
    }

    // Helper function to get top bands data for a specific year
    getYearTopBandsData(year) {
        // Filter concerts for the specific year
        const yearConcerts = dataManager.getConcertsByYear(year);
        
        // Count how many times each band was seen in that year
        const bandFrequency = {};
        yearConcerts.forEach(concert => {
            concert.artistIds.forEach(artistId => {
                const artist = dataManager.getArtistById(artistId);
                if (artist) {
                    bandFrequency[artist.name] = (bandFrequency[artist.name] || 0) + 1;
                }
            });
        });

        // Convert to array and sort by frequency, then limit to top 10
        return Object.entries(bandFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => {
                // Find the artist object to get additional info like ID and logo
                const artist = dataManager.getArtists().find(a => a.name === name);
                return {
                    name,
                    count,
                    id: artist ? artist.id : null,
                    logo: artist ? dataManager.getArtistLogo(artist.id) : null
                };
            });
    }

    // Create Year Top Bands Horizontal Bar Chart
    createYearTopBandsChart(year) {
        const topBands = this.getYearTopBandsData(year);
        
        this.createHorizontalArtistBarChart({
            canvasId: 'year-top-bands-chart',
            chartKey: 'yearTopBands',
            artistData: topBands,
            label: 'Number of Shows',
            clickHandler: (artist) => {
                console.log('Custom click handler - navigating to:', `artist/${artist.id}`);
                router.navigateTo(`artist/${artist.id}`);
            },
            showHeadlinerColors: false // Year view doesn't show headliner colors
        });
    }

    // Create City Events Per Year Chart with venue stacking and color coding
    createCityEventsPerYearChart(cityName) {
        // Get all concerts for venues in this city
        const cityVenues = venuesData.filter(v =>
            normalizeStringForId(v.city) === normalizeStringForId(cityName)
        );
        
        if (cityVenues.length === 0) {
            console.warn(`No venues found for city: ${cityName}`);
            return;
        }

        const cityVenueIds = cityVenues.map(v => v.id);
        const cityConcerts = concertsData.filter(c => cityVenueIds.includes(c.venueId));

        // Get all years from the entire dataset for complete range
        const allYears = [...new Set(concertsData.map(c => new Date(c.date).getFullYear()))].sort();
        
        // Group concerts by year and venue
        const yearVenueData = {};
        allYears.forEach(year => {
            yearVenueData[year] = {};
            cityVenueIds.forEach(venueId => {
                yearVenueData[year][venueId] = 0;
            });
        });

        // Count events per year per venue
        cityConcerts.forEach(concert => {
            const year = new Date(concert.date).getFullYear();
            if (yearVenueData[year] && yearVenueData[year].hasOwnProperty(concert.venueId)) {
                yearVenueData[year][concert.venueId]++;
            }
        });

        // Find first visit date for each venue to determine ordering
        const venueFirstVisit = {};
        cityVenueIds.forEach(venueId => {
            const venueFirstConcert = cityConcerts
                .filter(c => c.venueId === venueId)
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
            
            if (venueFirstConcert) {
                venueFirstVisit[venueId] = new Date(venueFirstConcert.date);
            } else {
                venueFirstVisit[venueId] = new Date('9999-12-31'); // Never visited
            }
        });

        // Sort venues by first visit date
        const sortedVenueIds = cityVenueIds.sort((a, b) =>
            venueFirstVisit[a] - venueFirstVisit[b]
        ).filter(venueId => venueFirstVisit[venueId].getFullYear() !== 9999);

        // Generate colors based on venue order
        const generateVenueColor = (index, total) => {
            if (total <= 3) {
                // For 3 or fewer venues, use fixed colors
                if (index === 0) return this.defaultColors.black; // First venue: black
                if (index === 1) return this.defaultColors.darkRed; // Second venue: dark red
                if (index === 2) return this.defaultColors.red; // Third venue: red
                return this.defaultColors.red; // Fallback to red
            } else {
                // For 4+ venues: interpolate between black (first) and red (last)
                const ratio = index / (total - 1); // 0 to 1 across all venues
                const blackRgb = COLOR_UTILS.hexToRgb(this.defaultColors.black);
                const redRgb = COLOR_UTILS.hexToRgb(this.defaultColors.red);
                
                const r = Math.round(blackRgb.r + (redRgb.r - blackRgb.r) * ratio);
                const g = Math.round(blackRgb.g + (redRgb.g - blackRgb.g) * ratio);
                const b = Math.round(blackRgb.b + (redRgb.b - blackRgb.b) * ratio);
                
                return `rgb(${r}, ${g}, ${b})`;
            }
        };

        // Create datasets for each venue
        const datasets = sortedVenueIds.map((venueId, index) => {
            const venue = venuesData.find(v => v.id === venueId);
            const venueName = venue ? venue.name : venueId;
            const data = allYears.map(year => yearVenueData[year][venueId] || 0);
            
            return {
                label: venueName,
                data: data,
                backgroundColor: generateVenueColor(index, sortedVenueIds.length),
                borderColor: generateVenueColor(index, sortedVenueIds.length)
            };
        });

        this.createVerticalBarChart({
            canvasId: 'city-events-per-year-chart',
            chartKey: 'cityEventsPerYear',
            datasets: datasets,
            labels: allYears,
            stacked: true,
            stackName: 'venues',
            clickHandler: (event, elements) => {
                if (elements.length > 0) {
                    const dataIndex = elements[0].index;
                    const year = allYears[dataIndex];
                    console.log('City events per year chart clicked - navigating to year:', year);
                    router.navigateTo(`year/${year}`);
                }
            },
            tooltipCallbacks: {
                title: function(context) {
                    return `Year ${context[0].label}`;
                },
                beforeBody: function(context) {
                    const yearIndex = context[0].dataIndex;
                    const year = allYears[yearIndex];
                    const totalEvents = sortedVenueIds.reduce((sum, venueId) =>
                        sum + (yearVenueData[year][venueId] || 0), 0
                    );
                    return totalEvents > 0 ? `Total Events: ${totalEvents}` : '';
                },
                label: function(context) {
                    const datasetLabel = context.dataset.label;
                    const value = context.parsed.y;
                    return value > 0 ? `${datasetLabel}: ${value}` : null;
                },
                filter: function(tooltipItem) {
                    return tooltipItem.parsed.y > 0; // Only show non-zero values
                }
            }
        });
    }

    // Create City Visits Per Venue Horizontal Bar Chart
    createCityVisitsPerVenueChart(cityName) {
        // Get all concerts for venues in this city
        const cityVenues = venuesData.filter(v =>
            normalizeStringForId(v.city) === normalizeStringForId(cityName)
        );
        
        if (cityVenues.length === 0) {
            console.warn(`No venues found for city: ${cityName}`);
            return;
        }

        const cityVenueIds = cityVenues.map(v => v.id);
        const cityConcerts = concertsData.filter(c => cityVenueIds.includes(c.venueId));

        // Count visits (concerts) per venue
        const venueVisits = {};
        cityVenues.forEach(venue => {
            venueVisits[venue.name] = 0;
        });

        cityConcerts.forEach(concert => {
            const venue = venuesData.find(v => v.id === concert.venueId);
            if (venue) {
                venueVisits[venue.name] = (venueVisits[venue.name] || 0) + 1;
            }
        });

        // Convert to array and sort by visit count (descending)
        const sortedVenues = Object.entries(venueVisits)
            .sort(([,a], [,b]) => b - a)
            .map(([name, count]) => ({ name, count }));

        const labels = sortedVenues.map(venue => venue.name);
        const data = sortedVenues.map(venue => venue.count);

        // Use the base horizontal bar chart function
        this.createHorizontalBarChart({
            canvasId: 'city-visits-per-venue-chart',
            chartKey: 'cityVisitsPerVenue',
            labels,
            data,
            datasetLabel: 'Number of Visits'
        });
    }

    // Create City Capacity Per Venue Horizontal Bar Chart
    createCityCapacityPerVenueChart(cityName) {
        // Get all venues in this city
        const cityVenues = venuesData.filter(v =>
            normalizeStringForId(v.city) === normalizeStringForId(cityName)
        );
        
        if (cityVenues.length === 0) {
            console.warn(`No venues found for city: ${cityName}`);
            return;
        }

        // Process venue capacity data - skip venues with unknown capacity
        const venueCapacities = cityVenues
            .filter(venue => venue.capacity && venue.capacity > 0) // Skip venues with null/0/unknown capacity
            .map(venue => ({
                name: venue.name,
                capacity: venue.capacity
            }));

        // Sort venues by capacity (descending order - largest venues first)
        venueCapacities.sort((a, b) => b.capacity - a.capacity);

        const labels = venueCapacities.map(venue => venue.name);
        const data = venueCapacities.map(venue => venue.capacity);

        // Use the base horizontal bar chart function with smart positioning
        this.createHorizontalBarChart({
            canvasId: 'city-capacity-per-venue-chart',
            chartKey: 'cityCapacityPerVenue',
            labels,
            data,
            datasetLabel: 'Venue Capacity',
            valueFormatter: (value) => value.toLocaleString()
        });
    }
}

// Create global instance
const chartsManager = new ChartsManager();

// Handle window resize
window.addEventListener('resize', () => {
    if (chartsManager.areChartsInitialized()) {
        setTimeout(() => {
            chartsManager.resizeCharts();
        }, 100);
    }
});