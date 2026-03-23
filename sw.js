const CACHE_NAME = 'firma-app-v2'; // <--- Recuerda subir la versión aquí cuando cambies algo
const ASSETS = [
  './',
  './index.html',
  './estilos.css',
  './script.js',
  './manifest.json',
  './icono.svg'
];

// 1. Instalación: Solo guarda en caché. 
// NO pongas skipWaiting() aquí si quieres mostrar el banner.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activación: Limpieza de versiones viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) 
  );
});

// 3. El motor del botón "Actualizar"
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting(); // Ahora sí, el SW se activa solo cuando el usuario hace clic
  }
});

// 4. Estrategia: Cache First (Cache-Control manual)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
