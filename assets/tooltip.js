function addLayerTooltip(layer, segment, trip, dist, segCount) {
    if (layer instanceof L.Polyline) {

        const tooltipText = `
            <strong>${trip.Name} (${segCount}/${trip.Segments.length})</strong><br />
            ${formatDate(segment.Date)} - ${dist.toFixed(1)} km
        `

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
}