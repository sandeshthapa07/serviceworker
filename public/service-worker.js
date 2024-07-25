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

self.addEventListener("message", async function (event) {
  const clientid = event.source.id;

  // const isOnline = navigator.onLine;
  // console.log("isOnline", this.navigator.onLine);
  console.log(
    "client id",
    clientid,
    event.data,
    "message recieved from website"
  );
  await sendMessage(clientid, event.data?.text);
});

const sendMessage = (clientid, content) => {
  // const clientid = event.source.id;/
  // console.log("client id", clientid, id, "message recieved from website");
  // navigator.onLine ? sendOnlineMessage(clientid) : sendOfflineMessage(clientid);
  console.log("sending message to client");

  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      console.log("client", content);
      client.postMessage(content);
    });
  });
};

self.addEventListener("sync", function (event) {
  if (event.tag == "myfirstsync") {
    console.log("Service worker sync event ma yeta aako ho");
    event.waitUntil(syncData());
  }
});

const DB_NAME = "OfflineDataStore";
const STORE_NAME = "pendingRequests";
const dbversion = 1;

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, dbversion, (upgradedb) => {
      if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = upgradedb.createObjectStore(STORE_NAME, {
          keyPath: STORE_NAME,
          autoIncrement: true,
        });
      }
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    // request.onupgradeneeded = (event) => {
    //   const db = event.target.result;
    //   db.createObjectStore(STORE_NAME, { autoIncrement: true });
    // };
  });
}

async function addToIndexedDB(data) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await store.add(data);
}

async function syncData() {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const data = await store.getAll();
  data.onsuccess = (event) => {
    const bloglist = event.target.result;

    if (bloglist.length > 0) {
      bloglist.forEach((blog) => {
        fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify(blog),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then(async (json) => {
            // after this show notification
            showNotification();
            console.log("response from server", json);
            if (json) {
              const transaction = db.transaction(STORE_NAME, "readwrite");
              const store = transaction.objectStore(STORE_NAME);
              console.log("delete blog", typeof blog.id);
              await store.delete(blog.id);
              await store.done;
            }
          });
      });
    }
  };
}

const deleteBlog = (id) => {
  console.log("delete blog", id);
};

const showNotification = () => {
  console.log("showing notification");
  self.registration.showNotification("Notification", {
    body: "This is a notification",
  });
};
