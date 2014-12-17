
console.log("SW startup");
/*console.log("Request", self.Request);
console.log("Response", self.Response);
console.log("fetch", self.fetch);
console.log("Cache", self.Cache);
console.log("caches", self.caches);
console.log("getAll", self.getAll);*/

/*
    navigator: WorkerNavigator
    onactivate: null
    onerror: null
    onfetch: null
    ongeofenceenter: null
    ongeofenceleave: null
    oninstall: null
    onmessage: null
    onnotificationclick: null
    onnotificationerror: null
    onpush: null
    onsync: null
*/
var notifyMe = function() {
    if (!Notification) {
        console.log('Notification : Please us a modern version of Chrome, Firefox, Opera or Firefox.');
        return;
    }

    if (Notification.permission !== "granted") Notification.requestPermission();

    var notification = new Notification('Notification title', {
        icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
        body: "Hey there! You've been notified!",
    });

    // notification.onclick = function () {
    //     window.open("http://stackoverflow.com/a/13328397/1269037");
    // }
};

self.addEventListener('install', function(event) {
    console.log('install', event);
    //debugger;
    
});

self.addEventListener('activate', function(event) {
    //debugger;
    console.log('Activating...', event);

    /*event.waitUntil(
        somethingThatReturnsAPromise().then(function() {
            console.log("Activated!");
        })
    );*/
});

self.addEventListener('fetch', function(event) { // http://www.html5rocks.com/en/tutorials/service-worker/introduction/
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

self.addEventListener('message', function(event) {
    console.log('message 1', event);
    console.log("Got message in SW", event.data.text);

    if (event.source) event.source.postMessage("Woop!");
    else console.log("No event.source");
    if (event.data.port) event.data.port.postMessage("Woop!");
});

self.onmessage = function(event) {
    console.log("Got message in SW", event.data.text);

    if (event.source) event.source.postMessage("Woopy!");
    else console.log("No event.source");
    if (event.data.port) event.data.port.postMessage("Woopa!");
};

setInterval(function() {
    notifyMe();
}, 10000);