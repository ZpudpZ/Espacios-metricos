// Inicialización del mapa
const map = L.map('map').setView([-15.8404, -70.0216], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Arreglo para almacenar los puntos y el marcador del usuario
const points = [];
let userMarker = null;
let lastUserLatLng = null;

// Función para agregar un punto aleatorio
function addRandomPoint() {
    const lat = -15.8404 + (Math.random() - 0.5) * 0.01;
    const lng = -70.0216 + (Math.random() - 0.5) * 0.01;
    const description = `Punto (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(description)
        .openPopup();
    points.push(marker);
}

// Función para eliminar todos los puntos
function removeAllPoints() {
    points.forEach(marker => map.removeLayer(marker));
    points.length = 0;
    document.getElementById('user-location').textContent = 'Ubicación Seleccionada: Ninguno';
    document.getElementById('nearest-neighbor').textContent = 'Vecino Más Cercano: Ninguno';
    document.getElementById('distance-info').textContent = 'Distancia Calculada: Ninguna';
    if (userMarker) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
}

// Función para medir distancias entre puntos
function calculateDistances() {
    if (!lastUserLatLng) {
        alert('Primero selecciona una ubicación.');
        return;
    }
    if (points.length < 1) {
        alert('No hay puntos en el mapa para calcular distancias.');
        return;
    }
    let minDistance = Infinity;
    let nearestPoint = null;
    points.forEach(marker => {
        const pointLatLng = marker.getLatLng();
        const distance = map.distance(lastUserLatLng, pointLatLng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = marker;
        }
    });
    if (nearestPoint) {
        const nearestLatLng = nearestPoint.getLatLng();
        document.getElementById('nearest-neighbor').textContent = `Vecino Más Cercano: (${nearestLatLng.lat.toFixed(4)}, ${nearestLatLng.lng.toFixed(4)})`;
        document.getElementById('distance-info').textContent = `Distancia Calculada: ${Math.round(minDistance)} metros`;
    }
}

// Función para actualizar la ubicación del usuario
function updateUserLocation(latlng) {
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    userMarker = L.marker(latlng, {
        icon: L.icon({
            iconUrl: 'https://img.icons8.com/ios-filled/50/000000/user-location.png',
            iconSize: [25, 25]
        })
    }).addTo(map)
      .bindPopup('Ubicación actual')
      .openPopup();
    lastUserLatLng = latlng;
    document.getElementById('user-location').textContent = `Ubicación Seleccionada: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    calculateDistances();
}

// Manejo del clic en el mapa para actualizar la ubicación del usuario
map.on('click', function(event) {
    updateUserLocation(event.latlng);
});

// Event listeners para botones
document.getElementById('add-random-point').addEventListener('click', addRandomPoint);
document.getElementById('remove-all-points').addEventListener('click', removeAllPoints);
document.getElementById('calculate-distances').addEventListener('click', calculateDistances);
