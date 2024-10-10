<template>
  <div
    ref="mapContainer"
    style="position: relative; width: 100%; height: 700px"
  >
    <GoogleMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 700px"
      api-key="AIzaSyDFpgJgnOCbehN1-KZNtYcWVc4_0uYiH8k"
      ref="googleMap"
      @map-loaded="onMapLoaded"
      @click="addVertex"
    >
      <Polygon
        v-for="(polygon, index) in polygonsCallao"
        :key="'callao-' + index"
        :options="{
          paths: polygon.paths,
          strokeColor: '#eb4034',
          strokeOpacity: 0.7,
          strokeWeight: 1,
          fillColor: '#eb4034',
          fillOpacity: 0.3,
        }"
      />
      <!-- Mostrar polígono solo cuando se haya cerrado -->
      <Polygon
        v-if="isPolygonComplete && polygonCoords.length > 2"
        :paths="polygonCoords"
        :options="polygonOptions"
      />
      <!-- <HeatmapLayer :options="{ data: heatmapData }" /> -->
      <CustomControl position="BOTTOM_CENTER">
        <button class="custom-btn" @click="sayHi">👋</button>
      </CustomControl>
    </GoogleMap>
    <!-- Usar un canvas para dibujar el polígono provisional -->
    <canvas
      ref="polygonCanvas"
      style="position: absolute; top: 0; left: 0"
    ></canvas>
  </div>
</template>

<script>
/* global google */
import { defineComponent } from "vue";
import { GoogleMap, CustomControl, Polygon } from "vue3-google-map";
import { mi_peru } from "../coordenadas/callao/mi_peru";
import { ventanilla } from "../coordenadas/callao/ventanilla";
import { la_perla } from "../coordenadas/callao/la_perla";
import { carmen_legua } from "../coordenadas/callao/carmen_legua";
import { callao } from "../coordenadas/callao/callao";
import { bellavista } from "../coordenadas/callao/bellavista";
import { la_punta } from "../coordenadas/callao/la_punta";

export default defineComponent({
  components: { GoogleMap, CustomControl, Polygon },
  data() {
    return {
      center: { lat: -12.0464, lng: -77.0428 }, // Ubicación inicial
      zoom: 12,
      drawingManager: null,
      heatmapData: [
        { location: { lat: 37.782, lng: -122.447 }, weight: 0.5 },
        { lat: 37.782, lng: -122.445 },
        { location: { lat: 37.782, lng: -122.443 }, weight: 2 },
        { location: { lat: 37.782, lng: -122.441 }, weight: 3 },
        { location: { lat: 37.782, lng: -122.439 }, weight: 2 },
        { lat: 37.782, lng: -122.437 },
        { location: { lat: 37.782, lng: -122.435 }, weight: 0.5 },

        { location: { lat: 37.785, lng: -122.447 }, weight: 3 },
        { location: { lat: 37.785, lng: -122.445 }, weight: 2 },
        { lat: 37.785, lng: -122.443 },
        { location: { lat: 37.785, lng: -122.441 }, weight: 0.5 },
        { lat: 37.785, lng: -122.439 },
        { location: { lat: 37.785, lng: -122.437 }, weight: 2 },
        { location: { lat: 37.785, lng: -122.435 }, weight: 3 },
      ],
      polygonsCallao: [
        { paths: mi_peru },
        { paths: ventanilla },
        { paths: la_perla },
        { paths: carmen_legua },
        { paths: callao },
        { paths: bellavista },
        { paths: la_punta },
      ],
      bermudaTriangle: {
        paths: [], // Inicializamos con un array vacío para evitar el error
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
      polygonCoords: [], // Aquí almacenamos los vértices para el polígono de Google Maps
      tempCoords: [], // Aquí se almacenan los puntos mientras el usuario va haciendo clic
      isPolygonComplete: false, // Indica si el polígono está completo
      polygonOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
      map: null,
      mapObject: null,
    };
  },
  methods: {
    resizeCanvas() {
      const canvas = this.$refs.polygonCanvas;
      const mapContainer = this.$refs.mapContainer;
      if (canvas && mapContainer) {
        canvas.width = mapContainer.clientWidth;
        canvas.height = mapContainer.clientHeight;
      }
    },
    onMapLoaded(map) {
      this.mapObject = map; // Guardar el objeto del mapa
      this.$nextTick(() => {
        // Asegurarse de que la proyección esté disponible después de que el mapa se haya cargado
        if (this.mapObject) {
          console.log("Mapa cargado y listo:", this.mapObject);
        } else {
          console.error("Error al cargar el mapa.");
        }
      });
    },
    addVertex(event) {
      if (this.isPolygonComplete) return;

      const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

      if (this.tempCoords.length > 0) {
        const firstVertex = this.tempCoords[0];
        const distance = this.getDistance(firstVertex, latLng);

        // Comprobar si se ha cerrado el polígono
        if (distance < 10) {
          this.isPolygonComplete = true;
          this.polygonCoords = [...this.tempCoords];
          this.clearCanvas();
          return;
        }
      }

      this.tempCoords.push(latLng);
      this.drawTemporaryPolygon();
    },

    drawTemporaryPolygon() {
      const canvas = this.$refs.polygonCanvas;
      const context = canvas.getContext("2d");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const points = this.tempCoords.map((coord) => this.latLngToPoint(coord));

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      points.forEach((point) => {
        context.lineTo(point.x, point.y);
      });

      context.strokeStyle = "#FF0000";
      context.lineWidth = 2;
      context.stroke();
    },

    latLngToPoint(latLng) {
      // Asegúrate de que el objeto del mapa esté disponible antes de continuar
      if (!this.mapObject) {
        console.error("El objeto del mapa no está disponible.");
        return { x: 0, y: 0 }; // Devuelve coordenadas por defecto
      }

      const projection = this.mapObject.getProjection();
      const worldCoordinate = projection.fromLatLngToPoint(
        new google.maps.LatLng(latLng.lat, latLng.lng)
      );

      // Cálculo de las coordenadas de pixel
      const scale = Math.pow(2, this.zoom);
      const pixelCoordinate = {
        x: worldCoordinate.x * scale - this.mapObject.getDiv().offsetWidth / 2,
        y: worldCoordinate.y * scale - this.mapObject.getDiv().offsetHeight / 2,
      };

      return pixelCoordinate;
    },

    getDistance(coord1, coord2) {
      // Calcula la distancia entre dos coordenadas
      const R = 6371e3; // Radio de la tierra en metros
      const φ1 = (coord1.lat * Math.PI) / 180; // φ, λ en radianes
      const φ2 = (coord2.lat * Math.PI) / 180;
      const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
      const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // Distancia en metros
      return distance; // Devuelve la distancia en metros
    },

    clearCanvas() {
      const canvas = this.$refs.polygonCanvas;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    sayHi() {
      console.log("me estoy ejecutando");
    },
    /* onMapLoaded(mapInstance) {
      console.log("Mapa cargado", mapInstance); // Agrega este log para verificar que el mapa se carga
      this.initDrawingManager(mapInstance); // Inicializa el Drawing Manager cuando el mapa está listo
    }, */
    initDrawingManager(mapInstance) {
      if (window.google && window.google.maps) {
        this.drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.RECTANGLE,
              google.maps.drawing.OverlayType.CIRCLE,
              google.maps.drawing.OverlayType.POLYGON,
            ],
          },
          rectangleOptions: {
            fillColor: "#ff0000",
            fillOpacity: 0.35,
            strokeWeight: 2,
            clickable: false,
            editable: true,
            zIndex: 1,
          },
        });

        this.drawingManager.setMap(mapInstance); // Asocia el DrawingManager al mapa

        // Agregar el listener para overlaycomplete
        google.maps.event.addListener(
          this.drawingManager,
          "overlaycomplete",
          (event) => {
            console.log("Área dibujada:", event.overlay);
            // Aquí puedes hacer algo con el área dibujada
          },
          { passive: true }
        ); // Aquí se agrega la opción pasiva
      } else {
        console.error("La API de Google Maps no está disponible.");
      }
    },
    googleApiKey() {
      return "AIzaSyDFpgJgnOCbehN1-KZNtYcWVc4_0uYiH8k";
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  mounted() {
    this.bermudaTriangle.paths = this.polygonsCallao;
    // Redibujar el canvas cuando se cambie el tamaño de la ventana
    /* window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas(); */
  },
});
</script>
<style scoped>
.custom-btn {
  box-sizing: border-box;
  background: white;
  height: 40px;
  width: 40px;
  border-radius: 2px;
  border: 0px;
  margin: 10px;
  padding: 0px;
  font-size: 1.25rem;
  text-transform: none;
  appearance: none;
  cursor: pointer;
  user-select: none;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  overflow: hidden;
}
</style>