import L from 'leaflet';

export const displayMap = (locations) => {
    // Initialize the map
    const map = L.map('map', {
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false,
        zoomControl: false,
    });

    // Set up the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const bounds = [];

    locations.forEach((loc) => {
        // Add marker
        const marker = L.marker([loc.coordinates[1], loc.coordinates[0]]).addTo(
            map
        );
        // Add popup
        marker
            .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .openPopup();
        // Extend bounds
        bounds.push([loc.coordinates[1], loc.coordinates[0]]);
    });

    if (bounds.length) {
        // Fit bounds with extra padding to ensure all markers are well within the center
        map.fitBounds(bounds, {
            padding: [map.getSize().y / 2, map.getSize().x / 2],
            maxZoom: 12,
        });
    } else {
        map.setView([0, 0], 2); // fallback view
    }
};
