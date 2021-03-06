const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/db.js',
  '/index.js',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => 
        
        
       { 
         console.log('opened')
        
        return cache.addAll(FILES_TO_CACHE)})
 
  );
});

// The activate handler takes care of cleaning up old caches.
// self.addEventListener("activate", event => {
//   const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
//   event.waitUntil(
//     caches
//       .keys()
//       .then(cacheNames => {
//         // return array of cache names that are old to delete
//         return cacheNames.filter(
//           cacheName => !currentCaches.includes(cacheName)
//         );
//       })
//       .then(cachesToDelete => {
//         return Promise.all(
//           cachesToDelete.map(cacheToDelete => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

self.addEventListener("fetch", event => {
  // non GET requests are not cached and requests to other origins are not cached
  // if (
  //   event.request.method !== "GET" ||
  //   !event.request.url.startsWith(self.location.origin)
  // ) {
  //   event.respondWith(fetch(event.request));
  //   return;
  // }

  // handle runtime GET requests for data from /api routes
  if (event.request.url.includes("/api/")) {
    // make network request and fallback to cache if network request fails (offline)
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache => {
        return fetch(event.request)
          .then(response => {
            if(response.status===200){
              cache.put(event.request.url, response.clone());
              
            }
            return response;
          }).catch((err) => cache.match(event.request));
      })
    )
    return;
  }
  // if (event.request.url.includes("/api/transaction/bulk")) {
  //   // make network request and fallback to cache if network request fails (offline)
  //   event.respondWith(
  //     caches.open(RUNTIME_CACHE).then(cache => {
  //       return fetch(event.request)
  //         .then(response => {
  //           cache.put(event.request, response.clone());
  //           return response;
  //         })
  //         .catch(() => caches.match(event.request));
  //     })
  //   );
  //   return;
  // }

  // use cache first for all other requests for performance
  event.respondWith(
   fetch(event.request).catch(function(){
     return caches.match(event.request).then(function(response){
       if(response){
         return response;
       }else if(event.request.headers.get('accet').includes('text/html')){
         return caches.match('/')
       }
     })
   })
  );
});
