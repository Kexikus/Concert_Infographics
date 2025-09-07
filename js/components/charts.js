// Charts Component - Handles all Chart.js visualizations
class ChartsManager {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            white: '#ffffff',
            black: '#000000',
            darkGrey: '#2a2a2a',
            lightGrey: '#cccccc',
            red: '#dc3545',
            darkRed: '#a71e2a'
        };
        this.chartColors = [
            '#dc3545', '#a71e2a', '#ffffff', '#cccccc',
            '#000000', '#2a2a2a'
        ];
    }

    // Helper function to calculate dynamic chart container height
    calculateChartHeight(dataCount, barHeight = 40, padding = 80) {
        return (dataCount * barHeight) + padding;
    }

    // Helper function to set chart container height
    setChartContainerHeight(containerId, height) {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.height = height + 'px';
        }
    }

    // Initialize all charts (removed Events per Year chart from main dashboard)
    initializeCharts() {
        // Note: createEventsPerYearChart() removed from main dashboard initialization
        // The Events per Year chart is now only available in the #events section
        this.createBandsPerYearChart();
        this.createBandFrequencyChart();
        this.renderOtherArtists();
    }

    // Create Events Per Year Stacked Bar Chart with Shows Behind
    createEventsPerYearChart() {
        const ctx = document.getElementById('events-per-year-chart');
        if (!ctx) return;

        const eventsData = dataManager.getEventsPerYearByType();
        const showsData = dataManager.getShowsPerYearStats();
        const years = Object.keys(eventsData).sort();

        // Prepare data arrays
        const concertData = years.map(year => eventsData[year]?.concert || 0);
        const festivalData = years.map(year => eventsData[year]?.festival || 0);
        const showsDataArray = years.map(year => -showsData[year] || 0);

        // Destroy existing chart if it exists
        if (this.charts.eventsPerYear) {
            this.charts.eventsPerYear.destroy();
        }

        this.charts.eventsPerYear = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    // Shows dataset (behind, wider bars, offset)
                    {
                        label: 'Shows',
                        data: showsDataArray,
                        backgroundColor: this.defaultColors.black,
                        borderColor: this.defaultColors.darkGrey,
                        borderWidth: 1,
                        borderSkipped: false,
                        stack: 'events',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        order: 2
                    },
                    // Concerts dataset (stacked, narrower bars, in front)
                    {
                        label: 'Concerts',
                        data: concertData,
                        backgroundColor: this.defaultColors.darkRed,
                        borderColor: this.defaultColors.darkRed,
                        borderWidth: 1,
                        borderSkipped: false,
                        stack: 'events',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        order: 0
                    },
                    // Festivals dataset (stacked on top of concerts, narrower bars, in front)
                    {
                        label: 'Festivals',
                        data: festivalData,
                        backgroundColor: this.defaultColors.red,
                        borderColor: this.defaultColors.red,
                        borderWidth: 1,
                        borderSkipped: false,
                        stack: 'events',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        order: 1
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                                return `Year ${context[0].label}`;
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = Math.abs(context.parsed.y);
                                return `${datasetLabel}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            },
                            callback: function(value) {
                                return Math.abs(value);
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
                }
            }
        });
    }

    // Create Bands Per Year Chart with dual bars (total and first-time)
    createBandsPerYearChart() {
        const ctx = document.getElementById('bands-per-year-chart');
        if (!ctx) return;

        const bandsData = dataManager.getBandsPerYearStats();
        const firstTimeBandsData = dataManager.getFirstTimeBandsPerYearStats();
        const years = Object.keys(bandsData).sort();

        // Prepare data arrays
        const totalBandsData = years.map(year => bandsData[year] || 0);
        const firstTimeBandsDataArray = years.map(year => firstTimeBandsData[year] || 0);
        // Calculate repeat bands (total - first-time) for stacking
        const repeatBandsData = years.map(year => (bandsData[year] || 0) - (firstTimeBandsData[year] || 0));

        // Destroy existing chart if it exists
        if (this.charts.bandsPerYear) {
            this.charts.bandsPerYear.destroy();
        }

        this.charts.bandsPerYear = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    // Repeat bands dataset (black bars, bottom of stack)
                    {
                        label: 'Total Bands',
                        data: repeatBandsData,
                        backgroundColor: this.defaultColors.black,
                        borderColor: this.defaultColors.darkGrey,
                        borderWidth: 1,
                        borderSkipped: false,
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        stack: 'bands',
                        order: 2
                    },
                    // First-time bands dataset (red bars, top of stack)
                    {
                        label: 'First-time Bands',
                        data: firstTimeBandsDataArray,
                        backgroundColor: this.defaultColors.red,
                        borderColor: this.defaultColors.darkRed,
                        borderWidth: 1,
                        borderSkipped: false,
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        stack: 'bands',
                        order: 1
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
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
                }
            }
        });
    }

    // Create Band Frequency Horizontal Bar Chart
    createBandFrequencyChart() {
        const ctx = document.getElementById('band-frequency-chart');
        if (!ctx) return;

        const frequentArtists = dataManager.getFrequentArtists(2); // Artists seen at least twice
        const labels = frequentArtists.map(artist => artist.name);
        const data = frequentArtists.map(artist => artist.count);
        const logos = frequentArtists.map(artist => artist.logo);

        // Calculate and set dynamic container height
        const chartHeight = this.calculateChartHeight(data.length);
        this.setChartContainerHeight('band-frequency-chart', chartHeight);

        // Destroy existing chart if it exists
        if (this.charts.bandFrequency) {
            this.charts.bandFrequency.destroy();
        }

        this.charts.bandFrequency = new Chart(ctx, {
            type: 'bar',
            plugins: [{
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const meta = chart.getDatasetMeta(0);
                    
                    // Draw values in front of each bar (on top of the bar)
                    meta.data.forEach((bar, index) => {
                        const value = data[index];
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(value, bar.x - 10, bar.y);
                    });
                    
                    // Draw logos and artist names (moved from animation callback to prevent disappearing)
                    meta.data.forEach((bar, index) => {
                        const artistData = frequentArtists[index];
                        if (artistData && artistData.logo) {
                            const img = new Image();
                            img.onload = function() {
                                // Calculate original image dimensions
                                const originalWidth = img.naturalWidth;
                                const originalHeight = img.naturalHeight;
                                
                                // Define constraints
                                const maxHeight = 28; // Slightly smaller than bar height for padding
                                const maxWidth = 150; // Reasonable width limit for logos
                                
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
                                
                                // Position the logo (centered vertically)
                                const x = 10;
                                const y = bar.y - scaledHeight / 2;
                                
                                // Draw the image with calculated dimensions
                                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                            };
                            img.onerror = function() {
                                // Fallback to text if image fails to load
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '16px Arial';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                const label = artistData.name.length > 20 ? artistData.name.substring(0, 20) + '...' : artistData.name;
                                ctx.fillText(label, 10, bar.y);
                            };
                            img.src = artistData.logo;
                        } else if (artistData) {
                            // Draw text for artists without logos
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '16px Arial';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            const label = artistData.name.length > 20 ? artistData.name.substring(0, 20) + '...' : artistData.name;
                            ctx.fillText(label, 10, bar.y);
                        }
                    });
                }
            }],
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Concerts',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
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
                                const artistData = frequentArtists[index];
                                if (artistData && artistData.logo) {
                                    // Return empty string for logo artists, we'll draw images separately
                                    return '';
                                } else {
                                    // Return text for artists without logos
                                    const label = this.getLabelForValue(value);
                                    return label.length > 20 ? label.substring(0, 20) + '...' : label;
                                }
                            }
                        },
                        grid: {
                            display: false
                        },
                        afterFit: function(scale) {
                            scale.width = 200; // Increase width for logos/text
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

    // Create Top Venues Horizontal Bar Chart
    createTopVenuesChart() {
        const ctx = document.getElementById('top-venues-chart');
        if (!ctx) return;

        const locationStats = dataManager.getLocationStatistics();
        const topVenues = locationStats.topVenues;
        const labels = topVenues.map(venue => venue.name);
        const data = topVenues.map(venue => venue.count);

        // Calculate and set dynamic container height
        const chartHeight = this.calculateChartHeight(data.length);
        this.setChartContainerHeight('top-venues-chart', chartHeight);

        // Destroy existing chart if it exists
        if (this.charts.topVenues) {
            this.charts.topVenues.destroy();
        }

        this.charts.topVenues = new Chart(ctx, {
            type: 'bar',
            plugins: [{
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const meta = chart.getDatasetMeta(0);
                    
                    // Draw values in front of each bar (on top of the bar)
                    meta.data.forEach((bar, index) => {
                        const value = data[index];
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(value, bar.x - 10, bar.y);
                    });
                    
                    // Draw venue names on the left
                    meta.data.forEach((bar, index) => {
                        const venueName = labels[index];
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '16px Arial';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        const label = venueName.length > 20 ? venueName.substring(0, 20) + '...' : venueName;
                        ctx.fillText(label, 10, bar.y);
                    });
                }
            }],
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Events',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
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
                                // Return empty string, we'll draw venue names separately
                                return '';
                            }
                        },
                        grid: {
                            display: false
                        },
                        afterFit: function(scale) {
                            scale.width = 200; // Increase width for venue names
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

    // Create Top Cities Horizontal Bar Chart
    createTopCitiesChart() {
        const ctx = document.getElementById('top-cities-chart');
        if (!ctx) return;

        const locationStats = dataManager.getLocationStatistics();
        const topCities = locationStats.topCities;
        const labels = topCities.map(city => city.name);
        const data = topCities.map(city => city.count);

        // Calculate and set dynamic container height
        const chartHeight = this.calculateChartHeight(data.length);
        this.setChartContainerHeight('top-cities-chart', chartHeight);

        // Destroy existing chart if it exists
        if (this.charts.topCities) {
            this.charts.topCities.destroy();
        }

        this.charts.topCities = new Chart(ctx, {
            type: 'bar',
            plugins: [{
                afterDraw: function(chart) {
                    const ctx = chart.ctx;
                    const meta = chart.getDatasetMeta(0);
                    
                    // Draw values in front of each bar (on top of the bar)
                    meta.data.forEach((bar, index) => {
                        const value = data[index];
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 20px Arial';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(value, bar.x - 10, bar.y);
                    });
                    
                    // Draw city names on the left
                    meta.data.forEach((bar, index) => {
                        const cityName = labels[index];
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '16px Arial';
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        const label = cityName.length > 20 ? cityName.substring(0, 20) + '...' : cityName;
                        ctx.fillText(label, 10, bar.y);
                    });
                }
            }],
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Events',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
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
                                // Return empty string, we'll draw city names separately
                                return '';
                            }
                        },
                        grid: {
                            display: false
                        },
                        afterFit: function(scale) {
                            scale.width = 200; // Increase width for city names
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

    // Create Average Venue Size per Year Line Chart
    createVenueSizeChart() {
        const ctx = document.getElementById('venue-size-chart');
        if (!ctx) return;

        const venueSizeData = dataManager.getAverageVenueSizePerYear();
        const years = Object.keys(venueSizeData).sort();

        // Prepare data arrays
        const overallData = years.map(year => venueSizeData[year]?.overall || null);
        const concertData = years.map(year => venueSizeData[year]?.concert || null);
        const festivalData = years.map(year => venueSizeData[year]?.festival || null);

        // Destroy existing chart if it exists
        if (this.charts.venueSize) {
            this.charts.venueSize.destroy();
        }

        this.charts.venueSize = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    // Overall (black line)
                    {
                        label: 'Overall',
                        data: overallData,
                        borderColor: this.defaultColors.black,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.black,
                        pointBorderColor: this.defaultColors.black,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Festival (bright red line)
                    {
                        label: 'Festival',
                        data: festivalData,
                        borderColor: this.defaultColors.red,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.red,
                        pointBorderColor: this.defaultColors.red,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Concert (dark red line)
                    {
                        label: 'Concert',
                        data: concertData,
                        borderColor: this.defaultColors.darkRed,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.darkRed,
                        pointBorderColor: this.defaultColors.darkRed,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                                return context[0].label;
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return value !== null ? `${datasetLabel}: ${value.toLocaleString()}` : `${datasetLabel}: No data`;
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
                            callback: function(value) {
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
                }
            }
        });
    }

    // Create Cost Per Year Vertical Bar Chart
    createCostPerYearChart() {
        const ctx = document.getElementById('cost-per-year-chart');
        if (!ctx) return;

        const costData = dataManager.getCostPerYearStats();
        const years = Object.keys(costData).sort();
        const data = years.map(year => costData[year] || 0);

        // Destroy existing chart if it exists
        if (this.charts.costPerYear) {
            this.charts.costPerYear.destroy();
        }

        this.charts.costPerYear = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Total Cost',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
                    borderWidth: 1,
                    borderSkipped: false,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9
                }]
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
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return `Year ${context[0].label}`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Total Cost: ${value}€`;
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
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            },
                            callback: function(value) {
                                return value + '€';
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
                }
            }
        });
    }

    // Create Cost Trend Line Chart (Average Cost per Show by Year)
    createCostTrendChart() {
        const ctx = document.getElementById('cost-trend-chart');
        if (!ctx) return;

        const costTrendData = dataManager.getAverageCostPerShowByYear();
        const years = Object.keys(costTrendData).sort();

        // Prepare data arrays
        const overallData = years.map(year => costTrendData[year]?.overall || null);
        const festivalData = years.map(year => costTrendData[year]?.festival || null);
        const concertData = years.map(year => costTrendData[year]?.concert || null);

        // Destroy existing chart if it exists
        if (this.charts.costTrend) {
            this.charts.costTrend.destroy();
        }

        this.charts.costTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    // Overall (black line)
                    {
                        label: 'All Events',
                        data: overallData,
                        borderColor: this.defaultColors.black,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.black,
                        pointBorderColor: this.defaultColors.black,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Festival (light red line)
                    {
                        label: 'Festivals',
                        data: festivalData,
                        borderColor: this.defaultColors.red,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.red,
                        pointBorderColor: this.defaultColors.red,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Concert (dark red line)
                    {
                        label: 'Concerts',
                        data: concertData,
                        borderColor: this.defaultColors.darkRed,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.darkRed,
                        pointBorderColor: this.defaultColors.darkRed,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                                return `Year ${context[0].label}`;
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return value !== null ? `${datasetLabel}: ${value}€` : `${datasetLabel}: No data`;
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
                            callback: function(value) {
                                return value + '€';
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
                }
            }
        });
    }

    // Update all charts with new data (removed Events per Year chart from main dashboard)
    updateCharts() {
        // Note: createEventsPerYearChart() removed from main dashboard updates
        // The Events per Year chart is now only available in the #events section
        this.createBandsPerYearChart();
        this.createBandFrequencyChart();
        this.renderOtherArtists();
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
            const artistItem = document.createElement('div');
            artistItem.className = 'artist-item';

            // Create logo/name element
            if (artist.logo) {
                const logoImg = document.createElement('img');
                logoImg.className = 'artist-logo';
                logoImg.src = artist.logo;
                logoImg.alt = artist.name;
                
                // Add error handling for missing logos
                logoImg.onerror = function() {
                    // Replace with text if logo fails to load
                    const textElement = document.createElement('div');
                    textElement.className = 'artist-name';
                    textElement.textContent = artist.name;
                    artistItem.innerHTML = '';
                    artistItem.appendChild(textElement);
                };

                // Only add the logo - no name when logo exists and loads successfully
                artistItem.appendChild(logoImg);
            } else {
                // No logo, just show name
                const nameElement = document.createElement('div');
                nameElement.className = 'artist-name';
                nameElement.textContent = artist.name;
                artistItem.appendChild(nameElement);
            }

            otherArtistsGrid.appendChild(artistItem);
        });
    }

    // Create Events Per Year Chart (Events only, no Shows bars)
    createEventsPerYearChartEvents() {
        const ctx = document.getElementById('events-per-year-chart-detailed');
        if (!ctx) return;

        const eventsData = dataManager.getEventsPerYearByType();
        const years = Object.keys(eventsData).sort();

        // Prepare data arrays
        const concertData = years.map(year => eventsData[year]?.concert || 0);
        const festivalData = years.map(year => eventsData[year]?.festival || 0);
        const totalData = years.map(year => (eventsData[year]?.concert || 0) + (eventsData[year]?.festival || 0));

        // Destroy existing chart if it exists
        if (this.charts.eventsPerYearEvents) {
            this.charts.eventsPerYearEvents.destroy();
        }

        this.charts.eventsPerYearEvents = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [
                    // Festivals dataset (top of stack) - LEGEND ORDER: First
                    {
                        label: 'Festivals',
                        data: festivalData,
                        backgroundColor: this.defaultColors.red,
                        borderColor: this.defaultColors.red,
                        borderWidth: 1,
                        borderSkipped: false,
                        stack: 'events',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        order: 1
                    },
                    // Concerts dataset (bottom of stack) - LEGEND ORDER: Second
                    {
                        label: 'Concerts',
                        data: concertData,
                        backgroundColor: this.defaultColors.darkRed,
                        borderColor: this.defaultColors.darkRed,
                        borderWidth: 1,
                        borderSkipped: false,
                        stack: 'events',
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
                        order: 0
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
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
                }
            }
        });
    }

    // Create Shows Per Year Vertical Bar Chart
    createShowsPerYearChart() {
        const ctx = document.getElementById('shows-per-year-chart');
        if (!ctx) return;

        const showsData = dataManager.getShowsPerYearStats();
        const years = Object.keys(showsData).sort();
        const data = years.map(year => showsData[year] || 0);

        // Destroy existing chart if it exists
        if (this.charts.showsPerYear) {
            this.charts.showsPerYear.destroy();
        }

        this.charts.showsPerYear = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Shows',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
                    borderWidth: 1,
                    borderSkipped: false,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9
                }]
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
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return `Year ${context[0].label}`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Shows: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
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
        const ctx = document.getElementById('artist-venue-size-chart');
        if (!ctx) return;

        const venueSizeData = dataManager.getArtistVenueSizePerYear(artistId);
        const years = Object.keys(venueSizeData).sort();

        // Prepare data arrays
        const allShowsData = years.map(year => venueSizeData[year]?.allShows || null);
        const concertsOnlyData = years.map(year => venueSizeData[year]?.concertsOnly || null);
        const headlineShowsData = years.map(year => venueSizeData[year]?.headlineShows || null);

        // Destroy existing chart if it exists
        if (this.charts.artistVenueSize) {
            this.charts.artistVenueSize.destroy();
        }

        this.charts.artistVenueSize = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    // All Shows (black line)
                    {
                        label: 'All Shows',
                        data: allShowsData,
                        borderColor: this.defaultColors.black,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.black,
                        pointBorderColor: this.defaultColors.black,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Concerts Only (dark red line)
                    {
                        label: 'Concerts Only',
                        data: concertsOnlyData,
                        borderColor: this.defaultColors.darkRed,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.darkRed,
                        pointBorderColor: this.defaultColors.darkRed,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    },
                    // Headline Shows (bright red line)
                    {
                        label: 'Headline Shows',
                        data: headlineShowsData,
                        borderColor: this.defaultColors.red,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.defaultColors.red,
                        pointBorderColor: this.defaultColors.red,
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0, // Straight lines
                        spanGaps: false
                    }
                ]
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
                        display: true,
                        position: 'top',
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
                                return context[0].label;
                            },
                            label: function(context) {
                                const datasetLabel = context.dataset.label;
                                const value = context.parsed.y;
                                return value !== null ? `${datasetLabel}: ${value.toLocaleString()}` : `${datasetLabel}: No data`;
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
                            callback: function(value) {
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
                }
            }
        });
    }

    // Create artist-specific shows per year chart (moved from router.js)
    createArtistShowsPerYearChart(artistId) {
        const ctx = document.getElementById('artist-shows-per-year-chart');
        if (!ctx) return;

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

        // Destroy existing chart if it exists
        if (this.charts.artistShowsPerYear) {
            this.charts.artistShowsPerYear.destroy();
        }

        // Create chart using the same styling as the main shows per year chart
        this.charts.artistShowsPerYear = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Shows',
                    data: data,
                    backgroundColor: this.defaultColors.black,
                    borderColor: this.defaultColors.darkGrey,
                    borderWidth: 1,
                    borderSkipped: false,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9
                }]
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
                        display: false
                    },
                    tooltip: {
                        backgroundColor: this.defaultColors.black,
                        titleColor: this.defaultColors.white,
                        bodyColor: this.defaultColors.white,
                        borderColor: this.defaultColors.lightGrey,
                        borderWidth: 1,
                        callbacks: {
                            title: function(context) {
                                return `Year ${context[0].label}`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Shows: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        offset: true,
                        ticks: {
                            color: this.defaultColors.white,
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            stepSize: 1,
                            color: this.defaultColors.white,
                            font: {
                                size: 14
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
                }
            }
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