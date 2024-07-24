self.addEventListener("install", function (event) {
  console.log("Service worker installed");
});

self.addEventListener("activate", function (event) {
  console.log("Service worker activated");
});

self.addEventListener("fetch", function (event) {
  console.log("Service worker fetched");
});

self.addEventListener("push", function (event) {
  console.log("Service worker push");
});

self.addEventListener("notificationclick", function (event) {
  console.log("Service worker notification click");
});

self.addEventListener("message", function (event) {
  const clientid = event.source.id;

  const isOnline = navigator.onLine;
  console.log("isOnline", this.navigator.onLine);
  console.log(
    "client id",
    clientid,
    event.data,
    "message recieved from website"
  );
  sendMessage(clientid);
});

const sendMessage = (clientid) => {
  // const clientid = event.source.id;/
  // console.log("client id", clientid, id, "message recieved from website");
  // navigator.onLine ? sendOnlineMessage(clientid) : sendOfflineMessage(clientid);

  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(`sendiing from service worker ${clientid}`);
    });
  });
};
