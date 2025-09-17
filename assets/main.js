// Init map on France
const map = L.map('map').setView([46.8, 2.5], 7);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch trips
async function loadTrips() {
    const response = await fetch('trips.json');
    const trips = await response.json();

    for (const trip of trips) {
        const segmentPromises = [];
        const gpxs = []
        let segCount = 0;

        for (const segment of trip.Segments) {
            segCount++
            const gpx = new L.GPX(segment.Gpx, segmentOptions(trip));

            const p = new Promise((resolve, reject) => {
                (segCount => { // Capture segCount current value
                    gpx.on('loaded', function (e) {
                        const dist = (e.target.get_distance() / 1000);
                        gpx.getLayers().forEach(layer => addLayerTooltip(layer, segment, trip, dist, segCount));
                        resolve(dist);
                    });
                })(segCount)
                gpx.on('error', e => reject(e));
            });

            gpx.addTo(map);
            segmentPromises.push(p);
            gpxs.push(gpx)
        }
        const dist = (await Promise.all(segmentPromises)).reduce((a, b) => a + b, 0);
        addPanelEntry(trip, dist, gpxs)
    }
}

loadTrips()