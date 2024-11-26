// Inicializar el mapa centrado en Colombia
const map = L.map('map').setView([4.5709, -74.2973], 6);

// Agregar capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Almacén de marcadores por tipo
const markers = {
  finca: [],
  puerto: [],
  aeropuerto: [],
};

// Cargar datos desde CSV
Papa.parse("puntos.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(result) {
    const data = result.data;

    // Agregar los marcadores al mapa según los datos
    data.forEach(row => {
      const { Nombre, Lugar, Latitud, Longitud, Tipo } = row;

      if (!Latitud || !Longitud || !Tipo) return; // Validar datos
      const lat = parseFloat(Latitud);
      const lng = parseFloat(Longitud);

      if (isNaN(lat) || isNaN(lng)) return; // Validar coordenadas

      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        color: getMarkerColor(Tipo),
        fillOpacity: 0.8,
      }).bindPopup(`<b>${Nombre}</b><br>${Lugar}<br><i>Tipo:</i> ${Tipo}`);

      markers[Tipo.toLowerCase()].push(marker); // Almacenar marcadores por tipo
    });

    updateMarkers(); // Mostrar los marcadores iniciales

    // Configurar eventos para los checkboxes
    document.querySelectorAll('#filters input').forEach(input => {
      input.addEventListener('change', updateMarkers);
    });
  },
  error: function(err) {
    console.error("Error al cargar el CSV:", err.message);
  },
});

// Obtener color según el tipo de marcador
function getMarkerColor(tipo) {
  switch (tipo.toLowerCase()) {
    case "finca": return "green";
    case "puerto": return "blue";
    case "aeropuerto": return "red";
    default: return "gray";
  }
}

// Mostrar u ocultar los marcadores según los filtros
function updateMarkers() {
  // Limpiar todos los marcadores del mapa
  Object.values(markers).flat().forEach(marker => marker.remove());

  // Mostrar solo los marcadores seleccionados
  if (document.getElementById('finca').checked) {
    markers.finca.forEach(marker => marker.addTo(map));
  }
  if (document.getElementById('puerto').checked) {
    markers.puerto.forEach(marker => marker.addTo(map));
  }
  if (document.getElementById('aeropuerto').checked) {
    markers.aeropuerto.forEach(marker => marker.addTo(map));
  }
}
