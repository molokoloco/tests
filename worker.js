
console.log('SW startup');
/*
    console.log('Request', self.Request);
    console.log('Response', self.Response);
    console.log('fetch', self.fetch);
    console.log('Cache', self.Cache);
    console.log('caches', self.caches);
    console.log('getAll', self.getAll);
*/

// --------------------------------------------------------- //

var notifInt = null,
    count = 0;

var notifyNow = function(mess) {
    count++
    notifInt = null;
    var notification = new Notification('Offres promos !', {
        icon: 'http://img.clubic.com/05575691-photo-logo-bouygues-telecom.jpg',
        body: mess ? mess : 'Bonjour ! Nouvelles offres sur Bouyguestelecom.fr !!! ('+count+')',
    });
    // notification.onclick = function () {}
    if (count < 2) notifInt = setTimeout(notifyNow, 20 * 1000, 'Later..');
};

var notifyMe = function(mess) {
    if (!Notification) {
        console.log('Notification : Please us a modern version of Chrome, Firefox, Opera or Firefox.');
        return;
    }
    if (Notification.permission !== 'granted') Notification.requestPermission();
    if (notifInt) clearInterval(notifInt);
    notifInt = setTimeout(notifyNow, 20 * 1000, mess);
};

// --------------------------------------------------------- //

self.addEventListener('install', function(event) {
    console.log('install', event);
});

self.addEventListener('activate', function(event) { // can control pages !
    console.log('Activating...', event);
    // event.waitUntil(somethingThatReturnsAPromise().then(function() {}));
});

self.addEventListener('fetch', function(event) { // http://www.html5rocks.com/en/tutorials/service-worker/introduction/
    console.log('fetch', event);
    notifyMe();
    /*
    console.log('Fetching', event.request.url);
    console.log('Headers', new Set(event.request.headers));
    event.respondWith(fetch(event.request));
    event.respondWith(new Response('Hello everyone!'));
    event.respondWith(
        caches
        .match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) return response;
            return fetch(event.request);
        });
    );
    var requestURL = new URL(event.request);
    if (requestURL.origin == location.origin) {
        if (/^\/video\//.test(requestURL.pathname)) {}
    }
    */
});

self.addEventListener('message', function(event) {
    console.log('message 1', event);
    console.log('Got message in SW', event.data.text);

    if (event.source) event.source.postMessage('Woop!');
    else console.log('No event.source');
    if (event.data.port) event.data.port.postMessage('Woop!');
});

// --------------------------------------------------------- //

self.onmessage = function(event) {
    console.log('message 2', event);
    console.log('Got message in SW', event.data.text);

    if (event.source) event.source.postMessage('Woopy from worker!');
    else console.log('No event.source');
    if (event.data.port) event.data.port.postMessage('Woopa from worker!');
};

setTimeout(function() {
    notifyMe('Worker Roots');
}, 20 * 1000);

// --------------------------------------------------------- //