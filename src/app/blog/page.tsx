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
    } else {
      // indexedDB => save to indexedDB
      await addToIndexedDB(blogdata);
      // communication beteween sw and browser => waiter
      sendMessage();
      // chefharu
      backgroundSync()
    }
  };
  const { serviceWorker, contentFromSW } = useContext(SWContext);

 
   useEffect(() => {
    setText(contentFromSW);
   }, [contentFromSW]);
   

  
   const backgroundSync = () => {
    navigator.serviceWorker.ready.then(function(swRegistration) {
      return swRegistration.sync.register('myFirstSync');
    });
   }

  const sendMessage = () => {
    if (serviceWorker) {
      (serviceWorker as any).postMessage({ text });
    }

   
  };

  return (
    <div className="">
      <form className="flex p-24 flex-col gap-5">

        <h1 className="text-3xl font-bold">Preview</h1>

        <p>{contentFromSW}</p>

        <div className="flex flex-col gap-5 ">
          <label htmlFor="editor">Content</label>
          <textarea
            name="editor"
            value={text}
          
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

const DB_NAME = "mero-maya-ko-thailo";
const STORE_NAME = "bhana-nasakeko-bhawana";
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
