// Tu clave API de Google Maps
const API_KEY = "AIzaSyAqA0cdt7Q93a6Tj6z5EKCm3CG5z_7Uihg";

// Variables globales
let map;
let markers = {
  finca: [],
  puerto: [],
  aeropuerto: [],
};

// Inicializar el mapa
function initMap() {
  // Crear el mapa centrado en Colombia
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.5709, lng: -74.2973 },
    zoom: 6,
  });

  // Cargar datos del archivo CSV
  Papa.parse("puntos.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (result) {
      const data = result.data;

      if (!data || data.length === 0) {
        console.error("Error: El archivo CSV está vacío o no contiene datos válidos.");
        return;
      }

      // Agregar marcadores al mapa
      data.forEach(({ Nombre, Lugar, Latitud, Longitud, Tipo }) => {
        if (Latitud && Longitud) {
          const lat = parseFloat(Latitud);
          const lng = parseFloat(Longitud);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Advertencia: Coordenadas inválidas para "${Nombre}".`);
            return;
          }

          // Seleccionar color del marcador según tipo
          let iconColor;
          switch (Tipo.toLowerCase()) {
            case "finca":
              iconColor = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
              break;
            case "puerto":
              iconColor = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
              break;
            case "aeropuerto":
              iconColor = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
              break;
            default:
              iconColor = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
          }

          // Crear el marcador
          const marker = new google.maps.Marker({
            map,
            position: { lat, lng },
            title: Nombre,
            icon: iconColor,
          });

          // Crear una InfoWindow para mostrar detalles
          const infoWindow = new google.maps.InfoWindow({
            content: `<div>
                        <h4>${Nombre}</h4>
                        <p><strong>Lugar:</strong> ${Lugar}</p>
                        <p><strong>Tipo:</strong> ${Tipo}</p>
                      </div>`,
          });

          // Añadir evento de clic para mostrar InfoWindow
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });

          // Guardar el marcador en su categoría
          markers[Tipo.toLowerCase()].push(marker);
        }
      });

      // Función para filtrar marcadores
      function filterMarkers() {
        const isFincaVisible = document.getElementById("finca").checked;
        const isPuertoVisible = document.getElementById("puerto").checked;
        const isAeropuertoVisible = document.getElementById("aeropuerto").checked;

        // Mostrar/ocultar marcadores según los filtros
        Object.entries(markers).forEach(([tipo, markersArray]) => {
          const isVisible =
            (tipo === "finca" && isFincaVisible) ||
            (tipo === "puerto" && isPuertoVisible) ||
            (tipo === "aeropuerto" && isAeropuertoVisible);

          markersArray.forEach((marker) => {
            marker.setMap(isVisible ? map : null); // Mostrar u ocultar el marcador
          });
        });
      }

      // Añadir eventos a los checkboxes
      document.getElementById("finca").addEventListener("change", filterMarkers);
      document.getElementById("puerto").addEventListener("change", filterMarkers);
      document.getElementById("aeropuerto").addEventListener("change", filterMarkers);

      // Aplicar los filtros al cargar
      filterMarkers();
    },
    error: function (err) {
      console.error("Error al cargar el archivo CSV:", err);
    },
  });
}
