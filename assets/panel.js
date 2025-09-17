const panel = document.getElementById('panel');
const trips = document.querySelector('#panel .trips');

const toggle = document.querySelector('#panel p');
toggle.addEventListener('click', () => {
    if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        return
    }
    panel.classList.add('collapsed');
});

function addPanelEntry(trip, dist, gpxs) {
    trips.insertAdjacentHTML('beforeend', `
        <div class="trip">
        <label>
            <input type="checkbox" checked="checked">
            <strong>
                <span style="background-color: ${trip.Color}"></span>
                ${trip.Name}
            </strong><br />
            ${formatDate(trip.Segments[0].Date)} - ${dist.toFixed(1)} km
        </label>
        </div>
    `);

    const checkbox = trips.lastElementChild.querySelector('input');
    checkbox.addEventListener('change', () => {
        gpxs.forEach(gpx => {
            if (checkbox.checked) {
                map.addLayer(gpx);
            } else {
                map.removeLayer(gpx);
            }
        })
    });

    const label = trips.lastElementChild.querySelector('label');
    label.addEventListener('mouseenter', () => {
        gpxs.forEach(gpx => {
            gpx.setStyle(segmentHoverStyle(trip));
        });
    });
    label.addEventListener('mouseleave', () => {
        gpxs.forEach(gpx => {
            gpx.setStyle(segmentStyle(trip));
        });
    });
}