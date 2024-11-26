// Configurar el mapa
const map = L.map('map').setView([4.5709, -74.2973], 6); // Centro de Colombia

// Agregar el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



// Cargar y procesar el archivo CSV
Papa.parse("puntos.csv", {
  download: true, // Permite descargar el CSV directamente
  header: true,   // Usa los nombres de las columnas como claves
  skipEmptyLines: true, // Ignora líneas vacías
  complete: function(result) {
    const data = result.data;
    console.log("Datos CSV cargados:", data); // Ver los datos cargados en consola

    if (data.length === 0) {
      console.error("Error: El archivo CSV está vacío o no contiene datos válidos.");
      return;
    }

    // Iterar sobre cada fila del CSV y agregar un marcador al mapa
    data.forEach((row, index) => {
      const { Nombre, Lugar, Latitud, Longitud, Tipo } = row;

      // Depurar para ver los datos de la fila actual
      console.log(`Fila ${index}: ${Nombre}, ${Lugar}, Latitud: ${Latitud}, Longitud: ${Longitud}`);

      // Verificar que las coordenadas son válidas
      if (Latitud && Longitud) {
        const lat = parseFloat(Latitud);
        const lng = parseFloat(Longitud);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Advertencia: Las coordenadas de "${Nombre}" son inválidas.`);
          return;
        }

        // Asignar un color al marcador según el tipo
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
            console.warn(`Advertencia: Tipo desconocido "${Tipo}" para "${Nombre}".`);
            iconColor = "gray";
        }

        // Crear un marcador para cada punto con un círculo
        const marker = L.circleMarker([lat, lng], {
          color: iconColor,
          radius: 8,
          fillOpacity: 0.8,
        });

        // Agregar el marcador al mapa con una ventana emergente (popup)
        marker
          .addTo(map)
          .bindPopup(`<b>${Nombre}</b><br>${Lugar}<br><i>Tipo:</i> ${Tipo}`);
        
      } else {
        console.warn(`Advertencia: Las coordenadas de "${Nombre}" no están definidas.`);
      }
    });
  },
  error: function(err) {
    console.error("Error al cargar el CSV:", err.message);
  },
});

Papa.parse(puntos.csv, {
    complete: function(results) {
        console.log("Datos del CSV:", results.data);  // Verifica cómo se cargan los datos
        // Aquí puedes verificar que las coordenadas estén presentes en los resultados
    },
    header: true // Asegúrate de que esté activado para que se use la primera fila como encabezado
});