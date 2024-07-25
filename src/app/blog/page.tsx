"use client";

import { useContext, useEffect, useState } from "react";
import { SWContext } from "../../../components/ServiceWorker";

const Page = () => {
  const [text, setText] = useState("");

  const handleMessage = async () => {
    const blogdata = {
      id: Date.now(),
      content: text,
    };

    if (navigator.onLine) {
      sendMessage();
      console.log("online mode active");
      sendMessage();
    } else {
      await addToIndexedDB(blogdata);
      sendMessage();
      console.log("message added to indexedDB");
    }
  };
  // const [response, setResponse] = useState("");
  // const [serviceWorker, setServiceWorker] = useState(null);
  const { serviceWorker, contentFromSW } = useContext(SWContext);
  console.log(contentFromSW);

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/service-worker.js")
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //         setServiceWorker(
  //           (registration.active as any) ||
  //             registration.waiting ||
  //             registration.installing
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   }

  //   navigator?.serviceWorker?.addEventListener("message", (event) => {
  //     console.log("Message received from service worker:", event.data);
  //     //   setResponse(event.data);
  //   });
  //   // return () => {
  //   //   navigator.serviceWorker.removeEventListener("message", handleMessage);
  //   // };
  // }, []);

  const sendMessage = () => {
    if (serviceWorker) {
      (serviceWorker as any).postMessage({ text });
    }

    // navigator.serviceWorker.ready.then((registration) => {
    //   registration.sync.register("myfirstsync");
    // });
  };

  return (
    <div className="">
      <form className="flex p-24 flex-col gap-5">
        <div className="flex flex-col gap-5 ">
          <label htmlFor="editor">Content</label>
          <textarea
            name="editor"
            onChange={(e) => setText(e.target.value)}
            id="editor"
            className="bg-gray-300 h-[200px] p-4 rounded=lg"
          />
        </div>
        <div className="flex justify-end ">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleMessage();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;

const DB_NAME = "OfflineDataStore";
const STORE_NAME = "pendingRequests";
const dbversion = 1;

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, dbversion);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as any).result;
      db.createObjectStore(STORE_NAME, { autoIncrement: true });
    };
  });
}

async function addToIndexedDB(data: any) {
  const db: any = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  await store.add(data);
}
