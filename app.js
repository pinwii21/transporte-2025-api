const ORS_API_KEY = 'TU_CLAVE_AQUI'; // Reemplaza con tu clave de OpenRouteService

const map = L.map('map').setView([-0.22, -78.5], 12); // Quito, ajusta según tu área

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let origin = null;
let destination = null;
let routeLayer = null;

// Cargar puntos desde archivo GeoJSON (personal)
fetch('personal.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup("Seleccionar como:<br><button onclick='setOrigin([" +
          feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "])'>Origen</button> " +
          "<button onclick='setDestination([" +
          feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "])'>Destino</button>");
      },
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 5, color: 'blue' })
    }).addTo(map);
  });

function setOrigin(coords) {
  origin = coords;
  alert("Origen seleccionado");
  tryRoute();
}

function setDestination(coords) {
  destination = coords;
  alert("Destino seleccionado");
  tryRoute();
}

function tryRoute() {
  if (origin && destination) {
    if (routeLayer) map.removeLayer(routeLayer);
    fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/geo+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [[origin[1], origin[0]], [destination[1], destination[0]]]
      })
    })
      .then(res => res.json())
      .then(data => {
        routeLayer = L.geoJSON(data, { style: { color: 'red', weight: 4 } }).addTo(map);
        map.fitBounds(routeLayer.getBounds());
      });
  }
}
