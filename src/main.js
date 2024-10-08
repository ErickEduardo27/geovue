
import { createApp } from 'vue';
import App from './App.vue';
import { GoogleMap } from 'vue3-google-map';
/* function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined') {
            resolve(google);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`;
        script.async = true;
        script.onload = () => {
            resolve(google);
        };
        script.onerror = (error) => {
            reject(error);
        };
        document.head.appendChild(script);
    });
}

// Llamar a esta función en tu aplicación
loadGoogleMaps('AIzaSyDFpgJgnOCbehN1-KZNtYcWVc4_0uYiH8k').then(() => {
    console.log('Google Maps cargado con éxito');
}).catch((error) => {
    console.error('Error al cargar Google Maps', error);
}); */
const app = createApp(App);

app.component('GoogleMap', GoogleMap);

app.mount('#app');

/* import { createApp } from 'vue';
import App from './App.vue';

function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            // Si google ya está disponible, resolvemos la promesa de inmediato
            resolve(window.google);
            return;
        }

        // Verificar si ya se ha agregado el script previamente
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
            // Si ya existe, esperar a que se cargue
            existingScript.addEventListener('load', () => {
                resolve(window.google);
            });
            existingScript.addEventListener('error', (error) => {
                reject(error);
            });
            return;
        }

        // Si no está disponible ni cargado, lo agregamos
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`;
        script.async = true;
        script.onload = () => {
            if (window.google && window.google.maps) {
                resolve(window.google);
            } else {
                reject(new Error('Google Maps API failed to load.'));
            }
        };
        script.onerror = (error) => {
            reject(error);
        };
        document.head.appendChild(script);
    });
}

const app = createApp(App);

// Añadir Google Maps a la aplicación Vue y pasar el API Key
app.config.globalProperties.$loadGoogleMaps = () => loadGoogleMaps('AIzaSyDFpgJgnOCbehN1-KZNtYcWVc4_0uYiH8k');
app.mount('#app'); */