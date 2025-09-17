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
        color: adjustColor(trip.Color, -120),
        opacity: 1,
        weight: 7,
        lineCap: 'round'
    }
}
