<template>
  <div>
    <GoogleMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 700px"
      api-key="AIzaSyDFpgJgnOCbehN1-KZNtYcWVc4_0uYiH8k"
      @map-loaded="onMapLoaded"
    >
      <CustomControl position="BOTTOM_CENTER">
        <button class="custom-btn" @click="sayHi">👋</button>
      </CustomControl>
    </GoogleMap>
  </div>
</template>

<script>
/* global google */
import { defineComponent } from "vue";
import { GoogleMap, CustomControl } from "vue3-google-map";
export default defineComponent({
  components: { GoogleMap, CustomControl },
  data() {
    return {
      center: { lat: -12.0464, lng: -77.0428 }, // Ubicación inicial
      zoom: 12,
      drawingManager: null,
    };
  },
  methods: {
    sayHi() {
      console.log("me estoy ejecutando");
    },
    onMapLoaded(mapInstance) {
      console.log("Mapa cargado", mapInstance); // Agrega este log para verificar que el mapa se carga
      this.initDrawingManager(mapInstance); // Inicializa el Drawing Manager cuando el mapa está listo
    },
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
  mounted() {},
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