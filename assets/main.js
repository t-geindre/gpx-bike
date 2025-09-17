// Init map on France
const map = L.map('map').setView([46.8, 2.5], 7);

// Trips panel
const panel = document.getElementById('panel');

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


function segmentOptions(trip) {
    return {
        async: true,
        polyline_options: segmentStyle(trip),
        marker_options: {
            startIconUrl: null,
            endIconUrl: null,
            shadowUrl: null
        }
    }
}

function segmentStyle(trip) {
    return {
        color: trip.Color,
        opacity: 0.75,
        weight: 5,
        lineCap: 'round'
    }
}

function segmentHoverStyle(trip) {
    return {
        color: trip.Color,
        opacity: 1,
        weight: 7,
        lineCap: 'round'
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}

// Fetch trips
async function loadTrips() {
    const response = await fetch('trips.json');
    const trips = await response.json();

    for (const trip of trips) {
        const segmentPromises = [];

        for (const segment of trip.Segments) {
            const gpx = new L.GPX(segment.Gpx, segmentOptions(trip));

            const p = new Promise((resolve, reject) => {
                gpx.on('loaded', function (e) {
                    let dist = 0;
                    // Tooltip
                    gpx.getLayers().forEach(layer => {
                        if (layer instanceof L.Polyline) {
                            dist += (e.target.get_distance() / 1000);

                            const tooltipText = trip.Name + ' ' + formatDate(segment.Date) + "<br>" + dist.toFixed(1) + " km";

                            layer.bindTooltip(tooltipText, {sticky: true});

                            layer.on('mouseover', () => {
                                map.getContainer().style.cursor = 'pointer';
                                layer.setStyle(segmentHoverStyle(trip));
                            });

                            layer.on('mouseout', () => {
                                map.getContainer().style.cursor = '';
                                layer.setStyle(segmentStyle(trip));
                            });
                        }
                    });

                    resolve(dist);
                });
                gpx.on('error', function (e) {
                    reject(e);
                });
            });

            gpx.addTo(map);
            segmentPromises.push(p);
        }

        const distances = await Promise.all(segmentPromises);
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        panel.innerHTML += `
            <div class="trip">
                <strong>
                    <span style="background-color: ${trip.Color}"></span>
                    ${trip.Name}
                </strong><br />
                ${formatDate(trip.Segments[0].Date)} - ${totalDistance.toFixed(1)} km
            </div>
        `;
    }
}

loadTrips()