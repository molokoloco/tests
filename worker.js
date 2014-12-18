
console.log('SW startup', self);
/*
    console.log('Request', self.Request);
    console.log('Response', self.Response);
    console.log('fetch', self.fetch);
    console.log('Cache', self.Cache);
    console.log('caches', self.caches);
    console.log('getAll', self.getAll);
*/

// --------------------------------------------------------- //

var state = null;

var pollServer = function() {
    console.log('pollServer()');

    fetch('http://www.bytel.tv/notifs/poll.php?message=worker1')
        .then(function(response) {
            //console.log('response', response);
            return response.json();
        })
        .then(function(json) {
            //console.log('json', json);
            if (json && json.message) {
                console.log('message', json.message);

                if (state && state != json.message) {

                    notifyNow('New response ! '+ json.message);

                }
                if (!state) state = json.message;
            }
        })
        .catch(function(err) {
            console.log('err', err);
        });

    setTimeout(pollServer, 10000);
};


pollServer();


// --------------------------------------------------------- //

var notifInt = null,
    count = 0;

var notifyNow = function(mess) {
    count++;
    notifInt = null;
    var notification = new Notification('Offres promos !', {
        icon: 'http://img.clubic.com/05575691-photo-logo-bouygues-telecom.jpg',
        body: mess ? mess : 'Bonjour ! Nouvelles offres sur Bouyguestelecom.fr !!! ('+count+')',
    });
    // notification.onclick = function () {}
    if (count < 2) {
        
        notifInt = setTimeout(notifyNow, 20 * 1000, 'Later after..');

        try {
            var messageChannel = new MessageChannel();

            messageChannel.port1.onmessage = function(event) {
                log('message from worker channel', event);
            };

            if (self.postMessage) {
                self.postMessage({
                    text: 'Hi Worker world!',
                    port: messageChannel && messageChannel.port2
                }, [messageChannel && messageChannel.port2]);
            }
        } catch(e) {
            console.log('No messageChannel', e);
        }

        

    }
};

var notifyMe = function(mess) {
    if (!Notification) {
        console.log('Notification : Please us a modern version of Chrome, Firefox, Opera ...');
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
    console.log('fetch', event.request.url, event);
    
    notifyMe('Detect new network request');
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

if (MessageChannel) {
    try {
        var messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = function(event) {
            log('message from worker channel', event);
        };

        if (self.postMessage) {
            self.postMessage({
                text: 'Hi Worker world!',
                port: messageChannel && messageChannel.port2
            }, [messageChannel && messageChannel.port2]);
        }
    } catch(e) {
        console.log('No messageChannel', e);
    }
}

// --------------------------------------------------------- //

self.onerror = function(event) {
    console.log('onactivate', event);
};
self.ongeofenceenter = function(event) {
    console.log('onactivate', event);
};
self.ongeofenceleave = function(event) {
    console.log('onactivate', event);
};
self.onsync = function(event) {
    console.log('onactivate', event);
};
self.onnotificationclick = function(event) {
    console.log('onactivate', event);
};
self.onnotificationerror = function(event) {
    console.log('onactivate', event);
};

// --------------------------------------------------------- //

var xmlhttp;

if (XMLHttpRequest) xmlhttp = new XMLHttpRequest();


xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 ) {
       if(xmlhttp.status == 200){
           document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
       }
       else if(xmlhttp.status == 400) {
          alert('There was an error 400')
       }
       else {
           alert('something else other than 200 was returned')
       }
    }
}

xmlhttp.open("GET", "ajax_info.txt", true);
xmlhttp.send();

// --------------------------------------------------------- //

notifyMe('Worker Roots');