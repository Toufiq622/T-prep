// T-PREP Service Worker
// এই ফাইলটা অ্যাপকে অফলাইনে কাজ করতে সাহায্য করে

const CACHE_NAME = 'tprep-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html'
];

// ইনস্টল হওয়ার সময় ফাইলগুলো ক্যাশে রাখা হয়
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// পুরনো ক্যাশ পরিষ্কার করা হয়
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// নেটওয়ার্ক না থাকলে ক্যাশ থেকে ফাইল দেওয়া হয়
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
