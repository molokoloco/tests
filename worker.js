
console.log("SW startup");
console.log("Request", this.Request);
console.log("Response", this.Response);
console.log("fetch", this.fetch);
console.log("Cache", this.Cache);
console.log("caches", this.caches);
console.log("getAll", this.getAll);

this.addEventListener('install', function(event) {
    console.log('install', event);
    //debugger;
    
});

this.addEventListener('activate', function(event) {
    //debugger;
    console.log('Activating...', event);

    /*event.waitUntil(
        somethingThatReturnsAPromise().then(function() {
            console.log("Activated!");
        })
    );*/
});

this.addEventListener('fetch', function(event) { // http://www.html5rocks.com/en/tutorials/service-worker/introduction/
    console.log('fetch', event);

    //event.respondWith(new Response("Hello everyone!"));
    
    /*
    console.log("Fetching", event.request.url);
    console.log("Headers", new Set(event.request.headers));
    event.respondWith(fetch(event.request));
    */
    /*
    event.respondWith(
        caches
        .match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) return response;
            return fetch(event.request);
        });
    );
    */
});

this.addEventListener('message', function(event) {
    console.log('message', event);
    console.log("Got message in SW", event.data.text);

    if (event.source) event.source.postMessage("Woop!");
    else console.log("No event.source");
    if (event.data.port) event.data.port.postMessage("Woop!");
});