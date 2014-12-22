
console.log('SW init');
// var self = self || this;

// --------------------------------------------------------- //

if (Notification.permission !== 'granted') Notification.requestPermission();

var notifInt = null,
    count = 0;

var notifyNow = function(mess) {
    count++;
    notifInt = null;
    var notification = new Notification('Offres promos !', {
        icon: 'http://img.clubic.com/05575691-photo-logo-bouygues-telecom.jpg',
        body: mess ? mess : 'Bonjour ! Nouvelles offres sur Bouyguestelecom.fr !!! ('+count+')',
    });
    // notification.onclick = function () {};
};

var notifyLater = function(mess) {
    if (!Notification) {
        console.log('Notification : Please us a modern version of Chrome, Firefox, Opera ...');
        return;
    }
    if (notifInt) clearInterval(notifInt);
    notifInt = setTimeout(notifyNow, 20 * 1000, mess);
};

// --------------------------------------------------------- //

var pollServer = function() {
    console.log('pollServer()');

    fetch('http://www.bytel.tv/notifs/poll.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            if (json && json.message) {
                // console.log('message', json);
                if (json.message != 'reset') {
                    notifyNow(json.message);
                    fetch('http://www.bytel.tv/notifs/poll.php?message=reset'); // Reset
                }
            }
        })
        .catch(function(err) {
            console.log('err', err);
        });

    setTimeout(pollServer, 3000);
};

pollServer();

// --------------------------------------------------------- //

self.addEventListener('install', function(event) {
    console.log('install', event);
    notifyLater('Worker install');
});

self.addEventListener('activate', function(event) { // can control pages !
    console.log('Activating...', event);
    // event.waitUntil(somethingThatReturnsAPromise().then(function() {}));
    notifyLater('Worker activate');
});

self.addEventListener('fetch', function(event) { // http://www.html5rocks.com/en/tutorials/service-worker/introduction/
    console.log('fetch', event.request.url, event);
    
    // notifyLater('Detect new network request');

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
            })
    );
    var requestURL = new URL(event.request);
    if (requestURL.origin == location.origin) {
        if (/^\/video\//.test(requestURL.pathname)) {}
    }
    */
});

// --------------------------------------------------------- //

self.onmessage = function(event) {
    console.log('Got message in SW1', event.data);
    notifyLater('onmessage1 '+event.data);

    if (event.source) event.source.postMessage('Woopy from worker!');
    else console.log('No event.source');
    if (event.data.port) event.data.port.postMessage('Woopa from worker!');
};

self.addEventListener('message', function(event) {
    console.log('Got message in SW2', event.data);
    notifyLater('onmessage2 '+event.data);

    if (event.source) event.source.postMessage('Woop!');
    else console.log('No event.source');
    if (event.data.port) event.data.port.postMessage('Woop!');
});

if (MessageChannel) {
    try {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function(event) {
            console.log('worker messageChannel 1', event);
        };
        messageChannel.port2.onmessage = function(event) {
            console.log('worker messageChannel 2', event);
        };
        messageChannel.port1.start();
        
        setTimeout(function() {
            messageChannel.port1.postMessage('Hello from worker !');
        }, 5000);

        /*if (self.postMessage) {
            self.postMessage({
                text: 'Hi Worker world!',
                port: messageChannel && messageChannel.port2
            }, [messageChannel && messageChannel.port2]);
        }*/
    } catch(e) {
        console.log('No messageChannel', e);
    }
}

// --------------------------------------------------------- //

self.onerror = function(event) {
    console.log('onactivate', event);
};
self.ongeofenceenter = function(event) {
    console.log('ongeofenceenter', event);
};
self.ongeofenceleave = function(event) {
    console.log('ongeofenceleave', event);
};
self.onsync = function(event) {
    console.log('onsync', event);
};
self.onnotificationclick = function(event) {
    console.log('onnotificationclick', event);
};
self.onnotificationerror = function(event) {
    console.log('onnotificationerror', event);
};
self.onpush = function(event) { // // http://w3c.github.io/push-api/
    console.log('onpush', event);
};

// --------------------------------------------------------- //

notifyNow('Worker Loaded...');