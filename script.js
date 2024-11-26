// Configurar el mapa
const map = L.map('map').setView([4.5709, -74.2973], 6); // Centro de Colombia

// Agregar el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Almacén de marcadores por tipo
let markers = {
  finca: [],
  puerto: [],
  aeropuerto: []
};

// Almacén de rutas
let routes = [];

// Cargar y procesar el archivo CSV
Papa.parse("puntos.csv", {
  download: true,
  header: true,   
  skipEmptyLines: true, 
  complete: function(result) {
    const data = result.data;
    console.log("Datos CSV cargados:", data);

    if (data.length === 0) {
      console.error("Error: El archivo CSV está vacío o no contiene datos válidos.");
      return;
    }

    // Limpiar las capas existentes antes de agregar nuevos marcadores
    clearAllLayers(); // Limpiar todo antes de cargar nuevos marcadores

    // Iterar sobre cada fila del CSV y agregar un marcador al mapa
    data.forEach((row) => {
      const { Nombre, Lugar, Latitud, Longitud, Tipo } = row;

      if (Latitud && Longitud) {
        const lat = parseFloat(Latitud);
        const lng = parseFloat(Longitud);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Advertencia: Las coordenadas de "${Nombre}" son inválidas.`);
          return;
        }

        let iconColor;
        switch (Tipo) {
          case "Finca":
            iconColor = "green";
            break;
          case "Puerto":
            iconColor = "blue";
            break;
          case "Aeropuerto":
            iconColor = "red";
            break;
          default:
            iconColor = "gray";
        }

        // Crear un marcador
        const marker = L.circleMarker([lat, lng], {
          color: iconColor,
          radius: 8,
          fillOpacity: 0.8,
        });

        marker.addTo(map).bindPopup(`<b>${Nombre}</b><br>${Lugar}<br><i>Tipo:</i> ${Tipo}`);
        
        // Guardar los marcadores por tipo
        markers[Tipo.toLowerCase()].push(marker);
      }
    });

    // Función para filtrar marcadores por tipo
    function filterMarkers() {
      const isFincaVisible = document.getElementById("finca").checked;
      const isPuertoVisible = document.getElementById("puerto").checked;
      const isAeropuertoVisible = document.getElementById("aeropuerto").checked;

      // Mostrar u ocultar los marcadores según el filtro
      markers.finca.forEach(marker => marker.setStyle({ opacity: isFincaVisible ? 1 : 0 }));
      markers.puerto.forEach(marker => marker.setStyle({ opacity: isPuertoVisible ? 1 : 0 }));
      markers.aeropuerto.forEach(marker => marker.setStyle({ opacity: isAeropuertoVisible ? 1 : 0 }));
    }

    // Añadir eventos de cambio de filtros
    document.getElementById("finca").addEventListener("change", filterMarkers);
    document.getElementById("puerto").addEventListener("change", filterMarkers);
    document.getElementById("aeropuerto").addEventListener("change", filterMarkers);

    // Filtrar marcadores al cargar
    filterMarkers();

  },
  error: function(err) {
    console.error("Error al cargar el CSV:", err.message);
  },
});

// Función para limpiar todas las capas (marcadores y rutas) del mapa
function clearAllLayers() {
  // Eliminar los marcadores
  markers.finca.forEach(marker => marker.remove());
  markers.puerto.forEach(marker => marker.remove());
  markers.aeropuerto.forEach(marker => marker.remove());
  markers = { finca: [], puerto: [], aeropuerto: [] }; // Limpiar los arrays de marcadores
  
  // Eliminar las rutas
  routes.forEach(route => route.remove());
  routes = []; // Limpiar las rutas
}
