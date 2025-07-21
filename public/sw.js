// Service Worker for caching TMDB images and API responses
const CACHE_NAME = 'movies-frontend-cache-v1';
const IMAGE_CACHE_NAME = 'movies-images-cache-v1';
const API_CACHE_NAME = 'movies-api-cache-v1';

// URLs to cache on install
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/logo.svg',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache TMDB images
  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          
          return fetch(event.request).then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }
  
  // Cache TMDB API responses for 5 minutes
  if (url.hostname === 'api.themoviedb.org') {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            // Check if cached response is still fresh (5 minutes)
            const cachedTime = response.headers.get('cached-time');
            if (cachedTime && (Date.now() - parseInt(cachedTime)) < 300000) {
              return response;
            }
          }
          
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone();
              // Add timestamp to cached response
              const headers = new Headers(responseClone.headers);
              headers.set('cached-time', Date.now().toString());
              
              const modifiedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
              });
              
              cache.put(event.request, modifiedResponse);
            }
            return response;
          });
        });
      })
    );
    return;
  }
  
  // Default fetch behavior
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
