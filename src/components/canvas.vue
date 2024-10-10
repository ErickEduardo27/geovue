<template>
  <div>
    <canvas
      id="polygonCanvas"
      ref="polygonCanvas"
      @click="addVertex"
      width="800"
      height="600"
      style="border: 1px solid black"
    ></canvas>
  </div>
</template>
  
  <script>
export default {
  name: "PolygonCanvas",
  data() {
    return {
      vertices: [],
    };
  },
  methods: {
    addVertex(event) {
      const canvas = this.$refs.polygonCanvas;
      const ctx = canvas.getContext("2d");

      // Obtener las coordenadas del clic
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Añadir el nuevo vértice
      this.vertices.push({ x, y });

      // Redibujar el polígono
      this.drawPolygon(ctx);
    },
    drawPolygon(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Limpiar el canvas

      if (this.vertices.length < 3) return; // Asegúrate de tener al menos 3 vértices

      ctx.beginPath();
      ctx.moveTo(this.vertices[0].x, this.vertices[0].y); // Moverse al primer vértice

      for (let i = 1; i < this.vertices.length; i++) {
        ctx.lineTo(this.vertices[i].x, this.vertices[i].y); // Dibujar líneas a los demás vértices
      }

      ctx.closePath(); // Cerrar el polígono
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Color de relleno
      ctx.fill();
      ctx.strokeStyle = "blue"; // Color del borde
      ctx.stroke();
    },
  },
};
</script>
  
  <style>
/* Estilos adicionales si son necesarios */
</style>