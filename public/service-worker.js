const version = 4;
const cacheName = `thats-what-she-said-${version}`;

const DB_NAME = "mero-maya-ko-thailo";
const STORE_NAME = "bhana-nasakeko-bhawana";
const dbversion = 1;

self.addEventListener("install", function (event) {
  console.log("Service worker installed");
});

self.addEventListener("activate", function (event) {
  // naya bahana aaayesi purano hataune

  // delete old cache when new version is installed
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );

  console.log("Service worker activate bhayo");
});

self.addEventListener("fetch", function (event) {
  // usle bhaneko kura fetch garne hune =>network request
  console.log("Service worker fetched hudai xa ", event);

  const isOnline = navigator.onLine;

  const url = new URL(event.request.url);
  const isHtml = url.pathname.endsWith(".html");
  const isCss = url.pathname.endsWith(".css");
  const isJs = url.pathname.endsWith(".js");
  const json = url.hostname.includes("jsonplaceholder.typicode.com");

  const css = event.request.url.includes("css");

  // network first

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );

  const localDataPahile = (event) => {
    return caches.match(event.request);
  };

  const fakeResponse = (event) => {
    const fakedata = [
      {
        id: 1,
        title: "First Blog Post",
        body: "This is the content of the first blog post.",
      },
      {
        id: 2,
        title: "Second Blog Post",
        body: "Here's the body of the second blog post.",
      },
      {
        id: 3,
        title: "Third Blog Post",
        body: "And this is the third blog post's content.",
      },
    ];

    return fetch(event.request).then((fetchResponse) => {
      console.log(fetchResponse.headers.get("content-type"), "content-type");

      return new Response(JSON.stringify(fakedata), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (fetchResponse.headers.get("content-type") === "application/json") {
        console.log("json");
        //  return new Response(JSON.stringify(fakedata),{
        //    status:200,
        //    headers:{
        //      "Content-Type":"application/json",
        //      'Access-Control-Allow-Origin': '*'
        //    }
        //   })
      }
    });
  };

  // event.respondWith(fakeResponse(event));

  const bahiraKoMatra = (event) => {
    return fetch(event.request);
  };

  // cache first apporach
  // event.respondWith(
  //   caches.match(event.request).then((cachedResponse) => {
  //     return (
  //       cachedResponse ||
  //       fetch(event.request).then((response) => {
  //         return caches.open(cacheName).then((cache) => {
  //           cache.put(event.request, response.clone());
  //           return response;
  //         });
  //       })
  //     );
  //   })
  // );

  const customResponse = (event) => {
    console.log("event", event);
  };
});

self.addEventListener("message", async function (event) {
  const clientid = event.source.id;
  await sendMessage(clientid, event.data?.text);
});

// singlelovegurumerosathi
const sendMessage = (clientid, content) => {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(content);
    });
  });
};

self.addEventListener("sync", function (event) {
  if (event.tag == "myFirstSync") {
    console.log("Service worker sync event ma yeta aako ho ma");
    event.waitUntil(syncData());
  }
});

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, dbversion, (upgradedb) => {
      if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
        upgradedb.createObjectStore(STORE_NAME, {
          keyPath: STORE_NAME,
          autoIncrement: true,
        });
      }
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// indexedDB add gardai samaaan
async function addToIndexedDB(data) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await store.add(data);
}

// backend frontend combination
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
            //  notification dekha mora chado
            showNotification(
              "Kuraute sathi",
              "bhetane bitikai bhandeko xu hai."
            );

            if (json) {
              const transaction = db.transaction([STORE_NAME], "readwrite");
              const store = transaction.objectStore(STORE_NAME);
              // tero kaam xoena abo hai => delete blog

              console.log("delete blog", blog.id);
              const result = await store.delete(blog.id);
              result.onsuccess = (event) => {
                console.log("deleted", event.target.result);
              };
              result.onerror = (event) => {
                console.log("error", event.target.error);
              };
              transaction.oncomplete = (event) => {
                console.log("transaction complete");
              };

              db.close();
            }
          });
      });
    }
  };
}

const showNotification = (title, body) => {
  self.registration.showNotification(title, {
    body: body,
  });
};
