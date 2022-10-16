function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
self.addEventListener('install', function() {
    console.log('[ServiceWorker] Installed');
    self.skipWaiting();
})
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

// self.addEventListener('activate', function(e) {
//     console.log("[SERVICE WORKER ] ACTIVATED")
// })

self.addEventListener("message", function ({ data = 600, source: { id } }) {
  wait(data * 1000).then(() => {
    //   console.log(e, "close modal close modal close modal");
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        if (client.id === id) {
          client.postMessage(data);
        }
      });
       
    });
    // if(!client) return ;
    // client.postMessage(" tvaaaar")
    // self.ClientRectList.matchAll(
  });
});